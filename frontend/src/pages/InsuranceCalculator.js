import React, { useState, useEffect } from 'react';
import TiltCard from '../components/TiltCard';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Security as SecurityIcon,
  Compare as CompareIcon,
  Calculate as CalculateIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { insuranceAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const InsuranceCalculator = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [formData, setFormData] = useState({
    age: user?.age || '',
    gender: user?.gender || '',
    medicalConditions: []
  });
  const [calculation, setCalculation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const [selectedPlans, setSelectedPlans] = useState([]);

  const medicalConditions = [
    'Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Cancer',
    'Kidney Disease', 'Liver Disease', 'Arthritis', 'Depression', 'Anxiety'
  ];

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data } = await insuranceAPI.getAllPlans();
      setPlans(data);
    } catch (error) {
      setError('Failed to fetch insurance plans');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMedicalConditionToggle = (condition) => {
    setFormData(prev => ({
      ...prev,
      medicalConditions: prev.medicalConditions.includes(condition)
        ? prev.medicalConditions.filter(c => c !== condition)
        : [...prev.medicalConditions, condition]
    }));
  };

  const handleCalculate = async () => {
    if (!selectedPlan) {
      setError('Please select an insurance plan');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await insuranceAPI.calculatePremium({
        planId: selectedPlan,
        age: parseInt(formData.age),
        gender: formData.gender,
        medicalConditions: formData.medicalConditions
      });

      setCalculation(response.data);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to calculate premium');
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    if (selectedPlans.length < 2) {
      setError('Please select at least 2 plans for comparison');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await insuranceAPI.comparePlans({
        planIds: selectedPlans,
        age: parseInt(formData.age),
        gender: formData.gender,
        medicalConditions: formData.medicalConditions
      });

      setCalculation(response.data);
      setShowComparison(true);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to compare plans');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelection = (planId) => {
    setSelectedPlans(prev => 
      prev.includes(planId)
        ? prev.filter(id => id !== planId)
        : [...prev, planId]
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Insurance Calculator
      </Typography>

      <Grid container spacing={4}>
        {/* Calculator Form */}
        <Grid item xs={12} md={6}>
          <TiltCard>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <CalculateIcon sx={{ mr: 1 }} />
                Calculate Premium
              </Typography>

              <TextField
                fullWidth
                label="Age"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                margin="normal"
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  label="Gender"
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
                Medical Conditions (if any):
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {medicalConditions.map((condition) => (
                  <Chip
                    key={condition}
                    label={condition}
                    onClick={() => handleMedicalConditionToggle(condition)}
                    color={formData.medicalConditions.includes(condition) ? 'primary' : 'default'}
                    variant={formData.medicalConditions.includes(condition) ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>

              <FormControl fullWidth margin="normal">
                <InputLabel>Select Plan</InputLabel>
                <Select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  label="Select Plan"
                >
                  {plans.map((plan) => (
                    <MenuItem key={plan._id} value={plan._id}>
                      {plan.provider} - {plan.planName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                fullWidth
                onClick={handleCalculate}
                disabled={loading || !selectedPlan}
                sx={{ 
                  mt: 3, 
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
                {loading ? <CircularProgress size={24} /> : 'Calculate Premium'}
              </Button>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </CardContent>
          </TiltCard>

          {/* Plan Comparison */}
          <TiltCard sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <CompareIcon sx={{ mr: 1 }} />
                Compare Plans
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Select multiple plans to compare:
              </Typography>

              <Box sx={{ mb: 3 }}>
                {plans.map((plan) => (
                  <Chip
                    key={plan._id}
                    label={`${plan.provider} - ${plan.planName}`}
                    onClick={() => handlePlanSelection(plan._id)}
                    color={selectedPlans.includes(plan._id) ? 'primary' : 'default'}
                    variant={selectedPlans.includes(plan._id) ? 'filled' : 'outlined'}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>

              <Button
                variant="outlined"
                fullWidth
                onClick={handleCompare}
                disabled={loading || selectedPlans.length < 2}
                sx={{ 
                  py: 1.5,
                  borderRadius: '25px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderWidth: '2px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  },
                  '&:disabled': {
                    transform: 'none',
                    boxShadow: 'none',
                  }
                }}
              >
                Compare Selected Plans
              </Button>
            </CardContent>
          </TiltCard>
        </Grid>

        {/* Results Display */}
        <Grid item xs={12} md={6}>
          <TiltCard>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Calculation Results
              </Typography>

              {loading && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Calculating premium...
                  </Typography>
                </Box>
              )}

              {!loading && calculation && !showComparison && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {calculation.plan.provider} - {calculation.plan.planName}
                  </Typography>

                  <TableContainer component={Paper} sx={{ mb: 3 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Factor</TableCell>
                          <TableCell align="right">Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>Base Premium</TableCell>
                          <TableCell align="right">${calculation.calculation.basePremium}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Age Factor</TableCell>
                          <TableCell align="right">{calculation.calculation.ageFactor}x</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Gender Multiplier</TableCell>
                          <TableCell align="right">{calculation.calculation.genderMultiplier}x</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Medical Condition Multiplier</TableCell>
                          <TableCell align="right">{calculation.calculation.medicalConditionMultiplier}x</TableCell>
                        </TableRow>
                        <TableRow sx={{ backgroundColor: 'primary.light', color: 'white' }}>
                          <TableCell><strong>Final Premium</strong></TableCell>
                          <TableCell align="right"><strong>${calculation.calculation.finalPremium}</strong></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Typography variant="subtitle2" gutterBottom>
                    Plan Features:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {calculation.plan.features.map((feature, index) => (
                      <Chip key={index} label={feature} size="small" color="success" />
                    ))}
                  </Box>

                  <Typography variant="subtitle2" gutterBottom>
                    Exclusions:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {calculation.plan.exclusions.map((exclusion, index) => (
                      <Chip key={index} label={exclusion} size="small" color="error" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}

              {!loading && calculation && showComparison && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Plan Comparison
                  </Typography>

                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Plan</TableCell>
                          <TableCell align="right">Annual Premium</TableCell>
                          <TableCell align="right">Monthly Premium</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {calculation.comparisons.map((comparison, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Typography variant="subtitle2">
                                {comparison.plan.provider}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {comparison.plan.planName}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="h6" color="primary">
                                ${comparison.premium}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2">
                                ${comparison.monthlyPremium}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {!loading && !calculation && !error && (
                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
                  <Typography variant="body1" color="text.secondary">
                    Fill in the form and click "Calculate Premium" to see results
                  </Typography>
                </Paper>
              )}
            </CardContent>
          </TiltCard>
        </Grid>
      </Grid>

      {/* Information Section */}
      <TiltCard sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <TrendingUpIcon sx={{ mr: 1 }} />
            How Premiums Are Calculated
          </Typography>
          <Typography variant="body2" paragraph>
            Insurance premiums are calculated based on several factors including age, gender, medical conditions, 
            and the specific plan chosen. The calculation takes into account:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>Age Factor</Typography>
              <Typography variant="body2" color="text.secondary">
                Premiums typically increase with age due to higher health risks.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>Gender Factor</Typography>
              <Typography variant="body2" color="text.secondary">
                Different risk profiles for males and females affect premium rates.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>Medical Conditions</Typography>
              <Typography variant="body2" color="text.secondary">
                Pre-existing conditions may increase premiums due to higher risk.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>Plan Coverage</Typography>
              <Typography variant="body2" color="text.secondary">
                More comprehensive plans have higher base premiums but better coverage.
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
              </TiltCard>
      </Container>
  );
};

export default InsuranceCalculator; 