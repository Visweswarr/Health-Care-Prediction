import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Paper
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Person as PersonIcon,
  History as HistoryIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    age: user?.age || '',
    gender: user?.gender || ''
  });
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCondition, setNewCondition] = useState({
    condition: '',
    diagnosedDate: '',
    status: 'active'
  });

  useEffect(() => {
    fetchMedicalHistory();
  }, []);

  const fetchMedicalHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user/medical-history');
      setMedicalHistory(response.data.medicalHistory);
    } catch (error) {
      setError('Failed to fetch medical history');
    }
  };

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await updateProfile(profileData);
      if (result.success) {
        setSuccess('Profile updated successfully');
        setEditMode(false);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCondition = async () => {
    if (!newCondition.condition || !newCondition.diagnosedDate) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:5000/api/user/medical-history', newCondition);
      setSuccess('Medical condition added successfully');
      setDialogOpen(false);
      setNewCondition({ condition: '', diagnosedDate: '', status: 'active' });
      fetchMedicalHistory();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to add medical condition');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCondition = async (conditionId) => {
    if (!window.confirm('Are you sure you want to delete this medical condition?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/user/medical-history/${conditionId}`);
      setSuccess('Medical condition deleted successfully');
      fetchMedicalHistory();
    } catch (error) {
      setError('Failed to delete medical condition');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'warning';
      case 'resolved': return 'success';
      case 'chronic': return 'info';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Profile & Medical History
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Profile Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ mr: 1 }} />
                  Profile Information
                </Typography>
                <Button
                  variant={editMode ? 'outlined' : 'contained'}
                  startIcon={editMode ? <CancelIcon /> : <EditIcon />}
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? 'Cancel' : 'Edit'}
                </Button>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={profileData.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                    disabled={!editMode}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Age"
                    type="number"
                    value={profileData.age}
                    onChange={(e) => handleProfileChange('age', e.target.value)}
                    disabled={!editMode}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal" disabled={!editMode}>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={profileData.gender}
                      onChange={(e) => handleProfileChange('gender', e.target.value)}
                      label="Gender"
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={user?.email || ''}
                    disabled
                    margin="normal"
                    helperText="Email cannot be changed"
                  />
                </Grid>
              </Grid>

              {editMode && (
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveProfile}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setEditMode(false);
                      setProfileData({
                        name: user?.name || '',
                        age: user?.age || '',
                        gender: user?.gender || ''
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Medical History */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
                  <HistoryIcon sx={{ mr: 1 }} />
                  Medical History
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setDialogOpen(true)}
                >
                  Add Condition
                </Button>
              </Box>

              {medicalHistory.length > 0 ? (
                <List>
                  {medicalHistory.map((condition, index) => (
                    <React.Fragment key={condition._id}>
                      <ListItem>
                        <ListItemText
                          primary={condition.condition}
                          secondary={`Diagnosed: ${new Date(condition.diagnosedDate).toLocaleDateString()} • Status: ${condition.status}`}
                        />
                        <Chip
                          label={condition.status}
                          color={getStatusColor(condition.status)}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleDeleteCondition(condition._id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < medicalHistory.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
                  <Typography variant="body1" color="text.secondary">
                    No medical conditions recorded
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Click "Add Condition" to start tracking your medical history
                  </Typography>
                </Paper>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* User Statistics */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Health Statistics
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                      {medicalHistory.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Conditions
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                      {medicalHistory.filter(c => c.status === 'active').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Conditions
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                      {medicalHistory.filter(c => c.status === 'resolved').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Resolved Conditions
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                      {medicalHistory.filter(c => c.status === 'chronic').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Chronic Conditions
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Medical Condition Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Medical Condition</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Condition Name"
            value={newCondition.condition}
            onChange={(e) => setNewCondition(prev => ({ ...prev, condition: e.target.value }))}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Date Diagnosed"
            type="date"
            value={newCondition.diagnosedDate}
            onChange={(e) => setNewCondition(prev => ({ ...prev, diagnosedDate: e.target.value }))}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={newCondition.status}
              onChange={(e) => setNewCondition(prev => ({ ...prev, status: e.target.value }))}
              label="Status"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
              <MenuItem value="chronic">Chronic</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddCondition}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Condition'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile; 