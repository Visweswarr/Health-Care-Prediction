import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  LocalHospital as HospitalIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  History as HistoryIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sample data for charts
  const predictionData = [
    { name: 'Jan', predictions: 4 },
    { name: 'Feb', predictions: 3 },
    { name: 'Mar', predictions: 7 },
    { name: 'Apr', predictions: 5 },
    { name: 'May', predictions: 8 },
    { name: 'Jun', predictions: 6 }
  ];

  const severityData = [
    { name: 'Low', value: 40, color: '#4caf50' },
    { name: 'Medium', value: 35, color: '#ff9800' },
    { name: 'High', value: 20, color: '#f44336' },
    { name: 'Critical', value: 5, color: '#9c27b0' }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Typography>Loading dashboard...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Welcome back, {user?.name}!
      </Typography>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <HospitalIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Total Predictions</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {stats?.totalPredictions || 0}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Disease predictions made
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'secondary.light', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SecurityIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Insurance Plans</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {stats?.totalInsurancePlans || 0}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Plans calculated
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Medical Conditions</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {stats?.totalMedicalConditions || 0}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Conditions tracked
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WarningIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Active Conditions</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {stats?.activeConditions || 0}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Currently active
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Recent Predictions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <HistoryIcon sx={{ mr: 1 }} />
                Recent Predictions
              </Typography>
              
              {stats?.recentPredictions && stats.recentPredictions.length > 0 ? (
                <List>
                  {stats.recentPredictions.map((prediction, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          <HospitalIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={prediction.disease}
                          secondary={`Confidence: ${prediction.confidence}% • ${new Date(prediction.predictedDate).toLocaleDateString()}`}
                        />
                        <Chip
                          label={`${prediction.confidence}%`}
                          color={prediction.confidence > 70 ? 'success' : prediction.confidence > 40 ? 'warning' : 'error'}
                          size="small"
                        />
                      </ListItem>
                      {index < stats.recentPredictions.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No recent predictions
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/disease-prediction')}
                    sx={{ mt: 2 }}
                  >
                    Make a Prediction
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Medical Conditions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1 }} />
                Recent Medical Conditions
              </Typography>
              
              {stats?.recentConditions && stats.recentConditions.length > 0 ? (
                <List>
                  {stats.recentConditions.map((condition, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          {condition.status === 'active' ? (
                            <WarningIcon color="warning" />
                          ) : condition.status === 'resolved' ? (
                            <CheckCircleIcon color="success" />
                          ) : (
                            <InfoIcon color="info" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={condition.condition}
                          secondary={`Status: ${condition.status} • ${new Date(condition.diagnosedDate).toLocaleDateString()}`}
                        />
                        <Chip
                          label={condition.status}
                          color={condition.status === 'active' ? 'warning' : condition.status === 'resolved' ? 'success' : 'info'}
                          size="small"
                        />
                      </ListItem>
                      {index < stats.recentConditions.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No medical conditions recorded
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/profile')}
                    sx={{ mt: 2 }}
                  >
                    Add Medical History
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Prediction Trends Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                Prediction Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={predictionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="predictions" stroke="#2196f3" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Severity Distribution */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Severity Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/disease-prediction')}
                    sx={{ py: 2 }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <HospitalIcon sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="body2">Disease Prediction</Typography>
                    </Box>
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/insurance-calculator')}
                    sx={{ py: 2 }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <SecurityIcon sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="body2">Insurance Calculator</Typography>
                    </Box>
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/profile')}
                    sx={{ py: 2 }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <PersonIcon sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="body2">Update Profile</Typography>
                    </Box>
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/profile')}
                    sx={{ py: 2 }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <HistoryIcon sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="body2">Medical History</Typography>
                    </Box>
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 