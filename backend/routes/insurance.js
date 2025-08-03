const express = require('express');
const Insurance = require('../models/Insurance');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/plans', async (req, res) => {
  try {
    const plans = await Insurance.find().select('provider planName basePremium coverage description features');
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/plans/:id', async (req, res) => {
  try {
    const plan = await Insurance.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ error: 'Insurance plan not found' });
    }
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/calculate-premium', auth, async (req, res) => {
  try {
    const { planId, age, gender, medicalConditions } = req.body;

    const plan = await Insurance.findById(planId);
    if (!plan) {
      return res.status(404).json({ error: 'Insurance plan not found' });
    }

    if (age < plan.minAge || age > plan.maxAge) {
      return res.status(400).json({ 
        error: `Age must be between ${plan.minAge} and ${plan.maxAge} years` 
      });
    }

    let premium = plan.basePremium;

    premium *= plan.ageMultiplier;

    premium *= plan.genderMultiplier[gender] || 1.0;

    if (medicalConditions && medicalConditions.length > 0) {
      premium *= plan.medicalConditionMultiplier;
    }

    const ageFactor = Math.max(1, (age - 30) * 0.02);
    premium *= ageFactor;

    res.json({
      plan: {
        provider: plan.provider,
        planName: plan.planName,
        coverage: plan.coverage,
        description: plan.description,
        features: plan.features,
        exclusions: plan.exclusions
      },
      calculation: {
        basePremium: plan.basePremium,
        ageFactor: ageFactor.toFixed(2),
        genderMultiplier: plan.genderMultiplier[gender] || 1.0,
        medicalConditionMultiplier: medicalConditions?.length > 0 ? plan.medicalConditionMultiplier : 1.0,
        finalPremium: Math.round(premium)
      },
      userInfo: {
        age,
        gender,
        medicalConditions: medicalConditions || []
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('insuranceHistory');
    res.json({ insuranceHistory: user.insuranceHistory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/history', auth, async (req, res) => {
  try {
    const { provider, policyNumber, startDate, endDate, premium } = req.body;

    req.user.insuranceHistory.push({
      provider,
      policyNumber,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      premium
    });

    await req.user.save();
    res.json({ message: 'Insurance history updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/compare', async (req, res) => {
  try {
    const { planIds, age, gender, medicalConditions } = req.body;

    if (!planIds || planIds.length < 2) {
      return res.status(400).json({ error: 'At least 2 plans required for comparison' });
    }

    const plans = await Insurance.find({ _id: { $in: planIds } });
    const comparisons = [];

    for (const plan of plans) {
      let premium = plan.basePremium;
      premium *= plan.ageMultiplier;
      premium *= plan.genderMultiplier[gender] || 1.0;

      if (medicalConditions && medicalConditions.length > 0) {
        premium *= plan.medicalConditionMultiplier;
      }

      const ageFactor = Math.max(1, (age - 30) * 0.02);
      premium *= ageFactor;

      comparisons.push({
        plan: {
          id: plan._id,
          provider: plan.provider,
          planName: plan.planName,
          coverage: plan.coverage,
          description: plan.description,
          features: plan.features
        },
        premium: Math.round(premium),
        monthlyPremium: Math.round(premium / 12)
      });
    }

    comparisons.sort((a, b) => a.premium - b.premium);

    res.json({
      comparisons,
      userInfo: { age, gender, medicalConditions: medicalConditions || [] }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 