const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/profile', auth, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/profile', auth, async (req, res) => {
  try {
    const { name, age, gender } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (age) updates.age = age;
    if (gender) updates.gender = gender;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ user, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/medical-history', auth, async (req, res) => {
  try {
    const { condition, diagnosedDate, status } = req.body;

    req.user.medicalHistory.push({
      condition,
      diagnosedDate: new Date(diagnosedDate),
      status: status || 'active'
    });

    await req.user.save();
    res.json({ 
      message: 'Medical history updated successfully',
      medicalHistory: req.user.medicalHistory
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/medical-history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('medicalHistory');
    res.json({ medicalHistory: user.medicalHistory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/medical-history/:conditionId', auth, async (req, res) => {
  try {
    const { condition, diagnosedDate, status } = req.body;
    const conditionId = req.params.conditionId;

    const user = await User.findById(req.user._id);
    const medicalCondition = user.medicalHistory.id(conditionId);

    if (!medicalCondition) {
      return res.status(404).json({ error: 'Medical condition not found' });
    }

    if (condition) medicalCondition.condition = condition;
    if (diagnosedDate) medicalCondition.diagnosedDate = new Date(diagnosedDate);
    if (status) medicalCondition.status = status;

    await user.save();
    res.json({ 
      message: 'Medical condition updated successfully',
      medicalHistory: user.medicalHistory
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/medical-history/:conditionId', auth, async (req, res) => {
  try {
    const conditionId = req.params.conditionId;
    const user = await User.findById(req.user._id);
    
    user.medicalHistory = user.medicalHistory.filter(
      condition => condition._id.toString() !== conditionId
    );

    await user.save();
    res.json({ 
      message: 'Medical condition deleted successfully',
      medicalHistory: user.medicalHistory
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const stats = {
      totalPredictions: user.predictions.length,
      totalMedicalConditions: user.medicalHistory.length,
      totalInsurancePlans: user.insuranceHistory.length,
      activeConditions: user.medicalHistory.filter(c => c.status === 'active').length,
      recentPredictions: user.predictions.slice(-5),
      recentConditions: user.medicalHistory.slice(-5)
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 