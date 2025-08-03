const express = require('express');
const { PythonShell } = require('python-shell');
const path = require('path');
const Disease = require('../models/Disease');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const diseases = await Disease.find().select('name symptoms description severity');
    res.json(diseases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id);
    if (!disease) {
      return res.status(404).json({ error: 'Disease not found' });
    }
    res.json(disease);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/predict', auth, async (req, res) => {
  try {
    const { symptoms, age, gender } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ error: 'Symptoms are required' });
    }

    const predictions = await simpleDiseasePrediction(symptoms, age, gender);
    
    if (predictions.length > 0) {
      const topPrediction = predictions[0];
      req.user.predictions.push({
        disease: topPrediction.disease,
        confidence: topPrediction.confidence,
        symptoms: symptoms
      });
      await req.user.save();
    }

    res.json({
      predictions,
      symptoms: symptoms,
      userAge: age,
      userGender: gender
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/predict-ml', auth, async (req, res) => {
  try {
    const { symptoms, age, gender } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ error: 'Symptoms are required' });
    }

    const options = {
      mode: 'json',
      pythonPath: 'python',
      pythonOptions: ['-u'],
      scriptPath: path.join(__dirname, '../ml'),
      args: [JSON.stringify(symptoms), age, gender]
    };

    PythonShell.run('disease_predictor.py', options, (err, results) => {
      if (err) {
        console.error('Python script error:', err);
        return res.status(500).json({ error: 'ML prediction failed' });
      }

      if (results && results.length > 0) {
        const predictions = results[0];
        
        if (predictions.length > 0) {
          const topPrediction = predictions[0];
          req.user.predictions.push({
            disease: topPrediction.disease,
            confidence: topPrediction.confidence,
            symptoms: symptoms
          });
          req.user.save();
        }

        res.json({
          predictions,
          symptoms: symptoms,
          userAge: age,
          userGender: gender,
          method: 'ML'
        });
      } else {
        res.status(500).json({ error: 'No predictions returned from ML model' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/history/predictions', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('predictions');
    res.json({ predictions: user.predictions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function simpleDiseasePrediction(symptoms, age, gender) {
  const diseases = await Disease.find();
  const predictions = [];

  for (const disease of diseases) {
    const matchingSymptoms = disease.symptoms.filter(symptom => 
      symptoms.some(userSymptom => 
        userSymptom.toLowerCase().includes(symptom.toLowerCase()) ||
        symptom.toLowerCase().includes(userSymptom.toLowerCase())
      )
    );

    if (matchingSymptoms.length > 0) {
      const confidence = (matchingSymptoms.length / disease.symptoms.length) * 100;
      predictions.push({
        disease: disease.name,
        confidence: Math.round(confidence),
        description: disease.description,
        severity: disease.severity,
        treatment: disease.treatment,
        prevention: disease.prevention,
        matchingSymptoms: matchingSymptoms
      });
    }
  }

  return predictions
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);
}

module.exports = router; 