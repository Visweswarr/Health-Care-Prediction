import React, { useState, useEffect } from 'react';
import TiltCard from '../components/TiltCard';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Paper
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Science as ScienceIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const DiseasePrediction = () => {
  const { user } = useAuth();
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useML, setUseML] = useState(true);

  // Common symptoms list
  const commonSymptoms = [
    'fever', 'cough', 'sore throat', 'runny nose', 'congestion', 'sneezing',
    'fatigue', 'headache', 'body aches', 'chills', 'difficulty breathing',
    'chest pain', 'sweating', 'mucus', 'chest discomfort', 'shortness of breath',
    'wheezing', 'chest tightness', 'rapid breathing', 'frequent urination',
    'excessive thirst', 'hunger', 'blurred vision', 'weight loss', 'slow healing',
    'nosebleeds', 'dizziness', 'severe headache', 'nausea', 'sensitivity to light',
    'vomiting', 'stomach pain', 'loss of appetite', 'bloating', 'indigestion',
    'abdominal pain', 'constipation', 'irregular heartbeat', 'swelling',
    'itching', 'urination changes', 'yellowing skin', 'night sweats', 'lumps',
    'hearing loss', 'drainage', 'irritability', 'redness', 'discharge',
    'blurred vision', 'sensitivity to light', 'rash', 'blisters', 'pain',
    'swelling', 'burning sensation', 'cloudy urine', 'back pain', 'diarrhea',
    'stomach cramps'
  ];

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const fetchSymptoms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/disease');
      // Extract unique symptoms from diseases
      const allSymptoms = new Set();
      response.data.forEach(disease => {
        disease.symptoms.forEach(symptom => {
          allSymptoms.add(symptom);
        });
      });
      setSymptoms(Array.from(allSymptoms).sort());
    } catch (error) {
      console.error('Error fetching symptoms:', error);
      setSymptoms(commonSymptoms);
    }
  };

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handlePrediction = async () => {
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom');
      return;
    }

    setLoading(true);
    setError('');
    setPredictions([]);

    try {
      const endpoint = useML ? '/predict-ml' : '/predict';
      const response = await axios.post(`http://localhost:5000/api/disease${endpoint}`, {
        symptoms: selectedSymptoms,
        age: user.age,
        gender: user.gender
      });

      setPredictions(response.data.predictions);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to get predictions');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <WarningIcon color="error" />;
      case 'high': return <WarningIcon color="warning" />;
      case 'medium': return <InfoIcon color="info" />;
      case 'low': return <CheckCircleIcon color="success" />;
      default: return <InfoIcon />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Disease Prediction
      </Typography>

      <Grid container spacing={4}>
        {/* Symptoms Selection */}
        <Grid item xs={12} md={6}>
          <TiltCard>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ScienceIcon sx={{ mr: 1 }} />
                Select Your Symptoms
              </Typography>
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Prediction Method</InputLabel>
                <Select
                  value={useML}
                  onChange={(e) => setUseML(e.target.value)}
                  label="Prediction Method"
                >
                  <MenuItem value={true}>Machine Learning (Advanced)</MenuItem>
                  <MenuItem value={false}>Rule-based (Basic)</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Select all symptoms that apply to you:
              </Typography>

              <Box sx={{ maxHeight: 400, overflow: 'auto', mb: 2 }}>
                <Grid container spacing={1}>
                  {symptoms.map((symptom) => (
                    <Grid item key={symptom}>
                      <Chip
                        label={symptom}
                        onClick={() => handleSymptomToggle(symptom)}
                        color={selectedSymptoms.includes(symptom) ? 'primary' : 'default'}
                        variant={selectedSymptoms.includes(symptom) ? 'filled' : 'outlined'}
                        sx={{ mb: 1 }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Button
                variant="contained"
                fullWidth
                onClick={handlePrediction}
                disabled={loading || selectedSymptoms.length === 0}
                sx={{ 
                  py: 1.5,
                  borderRadius: '25px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  boxShadow: '0 8px 25px rgba(33, 150, 243, 0.3)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 35px rgba(33, 150, 243, 0.4)',
                  },
                  '&:disabled': {
                    transform: 'none',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  }
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Get Prediction'}
              </Button>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </CardContent>
          </TiltCard>
        </Grid>

        {/* Predictions Display */}
        <Grid item xs={12} md={6}>
          <TiltCard>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Prediction Results
              </Typography>

              {loading && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Analyzing symptoms with {useML ? 'AI' : 'rule-based'} algorithm...
                  </Typography>
                </Box>
              )}

              {!loading && predictions.length > 0 && (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Based on your symptoms, here are the possible conditions:
                  </Typography>

                  {predictions.map((prediction, index) => (
                    <Accordion key={index} sx={{ mb: 2 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          {getSeverityIcon(prediction.severity)}
                          <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                            {prediction.disease}
                          </Typography>
                          <Chip
                            label={`${prediction.confidence}%`}
                            color={prediction.confidence > 70 ? 'success' : prediction.confidence > 40 ? 'warning' : 'error'}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Chip
                            label={prediction.severity}
                            color={getSeverityColor(prediction.severity)}
                            size="small"
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {prediction.description}
                          </Typography>

                          <Typography variant="subtitle2" gutterBottom>
                            Treatment:
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            {prediction.treatment}
                          </Typography>

                          <Typography variant="subtitle2" gutterBottom>
                            Prevention:
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            {prediction.prevention}
                          </Typography>

                          {prediction.risk_factors && prediction.risk_factors.length > 0 && (
                            <>
                              <Typography variant="subtitle2" gutterBottom>
                                Risk Factors:
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                                {prediction.risk_factors.map((factor, idx) => (
                                  <Chip key={idx} label={factor} size="small" variant="outlined" />
                                ))}
                              </Box>
                            </>
                          )}

                          <LinearProgress
                            variant="determinate"
                            value={prediction.confidence}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}

              {!loading && predictions.length === 0 && !error && (
                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
                  <Typography variant="body1" color="text.secondary">
                    Select symptoms and click "Get Prediction" to see results
                  </Typography>
                </Paper>
              )}
            </CardContent>
          </TiltCard>
        </Grid>
      </Grid>

      {/* Disclaimer */}
      <Alert severity="info" sx={{ mt: 4 }}>
        <Typography variant="body2">
          <strong>Disclaimer:</strong> This prediction system is for informational purposes only and should not replace professional medical advice. 
          Always consult with a healthcare provider for proper diagnosis and treatment.
        </Typography>
      </Alert>
    </Container>
  );
};

export default DiseasePrediction; 