const mongoose = require('mongoose');
const Disease = require('./models/Disease');
const Insurance = require('./models/Insurance');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare-aid', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB for seeding'))
.catch(err => console.error('MongoDB connection error:', err));

const diseases = [
  {
    name: 'Common Cold',
    symptoms: ['fever', 'cough', 'sore throat', 'runny nose', 'congestion', 'sneezing', 'fatigue'],
    description: 'A viral infection of the upper respiratory tract causing mild symptoms',
    severity: 'low',
    treatment: 'Rest, fluids, over-the-counter medications, symptom management',
    prevention: 'Wash hands frequently, avoid close contact, maintain good hygiene',
    riskFactors: ['Weakened immune system', 'Close contact with infected individuals'],
    ageGroup: 'all',
    genderPreference: 'none'
  },
  {
    name: 'Influenza',
    symptoms: ['fever', 'cough', 'sore throat', 'body aches', 'fatigue', 'headache', 'chills'],
    description: 'A contagious respiratory illness caused by influenza viruses with severe symptoms',
    severity: 'medium',
    treatment: 'Rest, fluids, antiviral medications, fever management',
    prevention: 'Annual flu vaccine, good hygiene, avoid sick people',
    riskFactors: ['Weakened immune system', 'Age', 'Chronic conditions'],
    ageGroup: 'all',
    genderPreference: 'none'
  },
  {
    name: 'Pneumonia',
    symptoms: ['fever', 'cough', 'difficulty breathing', 'chest pain', 'fatigue', 'sweating'],
    description: 'Infection that inflames the air sacs in one or both lungs, can be life-threatening',
    severity: 'high',
    treatment: 'Antibiotics, hospitalization if severe, oxygen therapy',
    prevention: 'Pneumococcal vaccine, good hygiene, quit smoking',
    riskFactors: ['Age', 'Smoking', 'Chronic lung disease'],
    ageGroup: 'elderly',
    genderPreference: 'none'
  },
  {
    name: 'Diabetes Type 2',
    symptoms: ['frequent urination', 'excessive thirst', 'hunger', 'fatigue', 'blurred vision', 'slow healing'],
    description: 'Metabolic disorder where the body becomes resistant to insulin',
    severity: 'high',
    treatment: 'Oral medications, diet, exercise, blood sugar monitoring',
    prevention: 'Healthy diet, regular exercise, maintain healthy weight',
    riskFactors: ['Obesity', 'Family history', 'Sedentary lifestyle'],
    ageGroup: 'adult',
    genderPreference: 'none'
  },
  {
    name: 'Hypertension',
    symptoms: ['headache', 'shortness of breath', 'nosebleeds', 'chest pain', 'dizziness'],
    description: 'High blood pressure that can lead to serious cardiovascular complications',
    severity: 'high',
    treatment: 'Lifestyle changes, medication, regular blood pressure monitoring',
    prevention: 'Reduce salt intake, exercise, maintain healthy weight',
    riskFactors: ['High salt intake', 'Obesity', 'Stress', 'Age'],
    ageGroup: 'adult',
    genderPreference: 'none'
  },
  {
    name: 'Asthma',
    symptoms: ['wheezing', 'shortness of breath', 'chest tightness', 'coughing', 'rapid breathing'],
    description: 'A chronic condition that affects the airways in the lungs, causing breathing problems',
    severity: 'medium',
    treatment: 'Inhalers, avoiding triggers, long-term control medications',
    prevention: 'Avoid triggers, take prescribed medications, regular check-ups',
    riskFactors: ['Allergies', 'Family history', 'Environmental factors'],
    ageGroup: 'all',
    genderPreference: 'none'
  },
  {
    name: 'Migraine',
    symptoms: ['severe headache', 'nausea', 'sensitivity to light', 'vomiting', 'dizziness'],
    description: 'A neurological condition characterized by severe, recurring headaches',
    severity: 'medium',
    treatment: 'Pain relievers, rest in dark room, preventive medications',
    prevention: 'Identify triggers, maintain regular sleep, stress management',
    riskFactors: ['Family history', 'Stress', 'Hormonal changes'],
    ageGroup: 'adult',
    genderPreference: 'female'
  },
  {
    name: 'Appendicitis',
    symptoms: ['abdominal pain', 'nausea', 'vomiting', 'loss of appetite', 'fever', 'constipation'],
    description: 'Inflammation of the appendix requiring emergency surgical removal',
    severity: 'critical',
    treatment: 'Emergency surgery (appendectomy), antibiotics',
    prevention: 'No known prevention, seek immediate medical attention',
    riskFactors: ['Age', 'Family history'],
    ageGroup: 'young',
    genderPreference: 'none'
  }
];

// Insurance data
const insurancePlans = [
  {
    provider: 'HealthFirst Insurance',
    planName: 'Basic Health Plan',
    basePremium: 3000,
    coverage: 'Basic medical coverage including doctor visits and prescription drugs',
    ageMultiplier: 1.0,
    genderMultiplier: {
      male: 1.1,
      female: 1.0,
      other: 1.05
    },
    medicalConditionMultiplier: 1.3,
    maxAge: 65,
    minAge: 18,
    description: 'Affordable basic health coverage for individuals and families',
    features: [
      'Doctor visits',
      'Prescription drugs',
      'Emergency room visits',
      'Preventive care'
    ],
    exclusions: [
      'Cosmetic procedures',
      'Experimental treatments',
      'Dental care',
      'Vision care'
    ]
  },
  {
    provider: 'PremiumCare Plus',
    planName: 'Comprehensive Health Plan',
    basePremium: 5000,
    coverage: 'Comprehensive medical coverage including specialist visits, surgery, and mental health',
    ageMultiplier: 1.0,
    genderMultiplier: {
      male: 1.05,
      female: 1.0,
      other: 1.025
    },
    medicalConditionMultiplier: 1.2,
    maxAge: 70,
    minAge: 18,
    description: 'Comprehensive health coverage with extensive benefits',
    features: [
      'All basic features',
      'Specialist visits',
      'Surgery coverage',
      'Mental health services',
      'Physical therapy',
      'Laboratory tests'
    ],
    exclusions: [
      'Cosmetic procedures',
      'Experimental treatments'
    ]
  },
  {
    provider: 'SeniorHealth',
    planName: 'Senior Care Plan',
    basePremium: 4000,
    coverage: 'Specialized coverage for seniors including long-term care and prescription drugs',
    ageMultiplier: 1.2,
    genderMultiplier: {
      male: 1.1,
      female: 1.0,
      other: 1.05
    },
    medicalConditionMultiplier: 1.1,
    maxAge: 85,
    minAge: 55,
    description: 'Specialized health coverage designed for seniors',
    features: [
      'All comprehensive features',
      'Long-term care',
      'Home health services',
      'Medical equipment',
      'Vision care',
      'Dental care'
    ],
    exclusions: [
      'Cosmetic procedures',
      'Experimental treatments'
    ]
  },
  {
    provider: 'FamilyHealth',
    planName: 'Family Wellness Plan',
    basePremium: 3500,
    coverage: 'Family-focused coverage including pediatric care and maternity benefits',
    ageMultiplier: 0.9,
    genderMultiplier: {
      male: 1.0,
      female: 1.05,
      other: 1.025
    },
    medicalConditionMultiplier: 1.15,
    maxAge: 60,
    minAge: 18,
    description: 'Family-oriented health coverage with pediatric and maternity benefits',
    features: [
      'All basic features',
      'Pediatric care',
      'Maternity benefits',
      'Wellness programs',
      'Vaccinations',
      'Preventive screenings'
    ],
    exclusions: [
      'Cosmetic procedures',
      'Experimental treatments',
      'Fertility treatments'
    ]
  }
];

async function seedDatabase() {
  try {
    await Disease.deleteMany({});
    await Insurance.deleteMany({});
    
    console.log('Cleared existing data');
    
    const insertedDiseases = await Disease.insertMany(diseases);
    console.log(`Inserted ${insertedDiseases.length} diseases`);
    
    const insertedInsurance = await Insurance.insertMany(insurancePlans);
    console.log(`Inserted ${insertedInsurance.length} insurance plans`);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase(); 