import sys
import json
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import pickle
import os
import requests
from io import StringIO

DISEASE_DATA = {
    'Disease': [
        'Common Cold', 'Influenza', 'Pneumonia', 'Bronchitis', 'Asthma',
        'Diabetes Type 1', 'Diabetes Type 2', 'Hypertension', 'Migraine',
        'Gastritis', 'Appendicitis', 'Heart Disease', 'Kidney Disease',
        'Liver Disease', 'Cancer', 'Tuberculosis', 'Malaria', 'Dengue',
        'COVID-19', 'Sinusitis', 'Ear Infection', 'Eye Infection',
        'Skin Infection', 'Urinary Tract Infection', 'Food Poisoning'
    ],
    'Symptoms': [
        ['fever', 'cough', 'sore throat', 'runny nose', 'congestion', 'sneezing', 'fatigue'],
        ['fever', 'cough', 'sore throat', 'body aches', 'fatigue', 'headache', 'chills'],
        ['fever', 'cough', 'difficulty breathing', 'chest pain', 'fatigue', 'sweating'],
        ['cough', 'mucus', 'chest discomfort', 'fatigue', 'mild fever', 'shortness of breath'],
        ['wheezing', 'shortness of breath', 'chest tightness', 'coughing', 'rapid breathing'],
        ['frequent urination', 'excessive thirst', 'hunger', 'fatigue', 'blurred vision', 'weight loss'],
        ['frequent urination', 'excessive thirst', 'hunger', 'fatigue', 'blurred vision', 'slow healing'],
        ['headache', 'shortness of breath', 'nosebleeds', 'chest pain', 'dizziness'],
        ['severe headache', 'nausea', 'sensitivity to light', 'vomiting', 'dizziness'],
        ['stomach pain', 'nausea', 'vomiting', 'loss of appetite', 'bloating', 'indigestion'],
        ['abdominal pain', 'nausea', 'vomiting', 'loss of appetite', 'fever', 'constipation'],
        ['chest pain', 'shortness of breath', 'fatigue', 'dizziness', 'irregular heartbeat'],
        ['fatigue', 'swelling', 'shortness of breath', 'nausea', 'itching', 'urination changes'],
        ['fatigue', 'abdominal pain', 'yellowing skin', 'nausea', 'loss of appetite'],
        ['fatigue', 'weight loss', 'pain', 'fever', 'night sweats', 'lumps'],
        ['cough', 'fever', 'night sweats', 'weight loss', 'fatigue', 'chest pain'],
        ['fever', 'chills', 'headache', 'muscle pain', 'fatigue', 'nausea'],
        ['fever', 'headache', 'muscle pain', 'rash', 'nausea', 'vomiting'],
        ['fever', 'cough', 'fatigue', 'loss of taste', 'shortness of breath', 'body aches'],
        ['headache', 'facial pain', 'congestion', 'cough', 'fatigue', 'bad breath'],
        ['ear pain', 'hearing loss', 'fever', 'drainage', 'irritability'],
        ['redness', 'itching', 'discharge', 'pain', 'blurred vision', 'sensitivity to light'],
        ['redness', 'itching', 'rash', 'blisters', 'pain', 'swelling'],
        ['frequent urination', 'burning sensation', 'cloudy urine', 'fever', 'back pain'],
        ['nausea', 'vomiting', 'diarrhea', 'stomach cramps', 'fever', 'headache']
    ],
    'Severity': [
        'low', 'medium', 'high', 'medium', 'medium',
        'high', 'high', 'high', 'medium',
        'low', 'critical', 'high', 'high',
        'high', 'critical', 'high', 'high', 'high',
        'high', 'low', 'medium', 'medium',
        'low', 'medium', 'medium'
    ],
    'Age_Risk': [
        'all', 'all', 'elderly', 'adult', 'all',
        'young', 'adult', 'adult', 'adult',
        'adult', 'young', 'elderly', 'elderly',
        'adult', 'elderly', 'all', 'all', 'all',
        'all', 'all', 'child', 'all',
        'all', 'adult', 'all'
    ]
}

def download_kaggle_dataset():
    return pd.DataFrame(DISEASE_DATA)

def create_synthetic_dataset():
    data = []
    labels = []
    
    df = pd.DataFrame(DISEASE_DATA)
    
    for idx, row in df.iterrows():
        disease = row['Disease']
        symptoms = row['Symptoms']
        severity = row['Severity']
        age_risk = row['Age_Risk']
        
        for _ in range(100):
            num_symptoms = np.random.randint(2, min(7, len(symptoms) + 1))
            selected_symptoms = np.random.choice(symptoms, num_symptoms, replace=False)
            
            if np.random.random() < 0.2:
                all_symptoms = [s for symptoms_list in df['Symptoms'] for s in symptoms_list]
                other_symptoms = [s for s in all_symptoms if s not in symptoms]
                if other_symptoms:
                    noise_count = np.random.randint(0, 2)
                    if noise_count > 0:
                        noise_symptoms = np.random.choice(other_symptoms, noise_count)
                        selected_symptoms = np.append(selected_symptoms, noise_symptoms)
            
            feature_vector = create_symptom_vector(selected_symptoms)
            
            data.append(feature_vector)
            labels.append(disease)
    
    return np.array(data), np.array(labels)

def create_symptom_vector(symptoms):
    all_symptoms = set()
    for symptoms_list in DISEASE_DATA['Symptoms']:
        all_symptoms.update(symptoms_list)
    
    all_symptoms = sorted(list(all_symptoms))
    vector = np.zeros(len(all_symptoms))
    
    for symptom in symptoms:
        if symptom in all_symptoms:
            idx = all_symptoms.index(symptom)
            vector[idx] = 1
    
    return vector

def train_advanced_model():
    X, y = create_synthetic_dataset()
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    models = {
        'random_forest': RandomForestClassifier(n_estimators=200, random_state=42, max_depth=10),
        'gradient_boosting': GradientBoostingClassifier(n_estimators=100, random_state=42, max_depth=6)
    }
    
    best_model = None
    best_score = 0
    
    for name, model in models.items():
        model.fit(X_train_scaled, y_train)
        score = model.score(X_test_scaled, y_test)
        print(f"{name} accuracy: {score:.3f}")
        
        if score > best_score:
            best_score = score
            best_model = model
    
    return best_model, scaler

def predict_disease_advanced(symptoms, age, gender):
    try:
        model, scaler = train_advanced_model()
        
        feature_vector = create_symptom_vector(symptoms)
        feature_vector = feature_vector.reshape(1, -1)
        
        feature_vector_scaled = scaler.transform(feature_vector)
        
        probabilities = model.predict_proba(feature_vector_scaled)[0]
        
        top_indices = np.argsort(probabilities)[::-1][:5]
        
        predictions = []
        for idx in top_indices:
            if probabilities[idx] > 0.01:
                disease = model.classes_[idx]
                confidence = probabilities[idx] * 100
                
                confidence = adjust_confidence(confidence, disease, age, gender)
                
                predictions.append({
                    'disease': disease,
                    'confidence': round(confidence, 2),
                    'description': get_disease_description(disease),
                    'severity': get_disease_severity(disease),
                    'treatment': get_disease_treatment(disease),
                    'prevention': get_disease_prevention(disease),
                    'risk_factors': get_risk_factors(disease, age, gender)
                })
        
        return predictions
    
    except Exception as e:
        print(f"Error in disease prediction: {str(e)}", file=sys.stderr)
        return []

def adjust_confidence(confidence, disease, age, gender):
    if age > 60:
        if disease in ['Heart Disease', 'Diabetes Type 2', 'Hypertension', 'Kidney Disease']:
            confidence *= 1.2
        elif disease in ['Appendicitis', 'Asthma']:
            confidence *= 0.8
    elif age < 18:
        if disease in ['Appendicitis', 'Ear Infection', 'Asthma']:
            confidence *= 1.1
        elif disease in ['Heart Disease', 'Diabetes Type 2', 'Hypertension']:
            confidence *= 0.7
    
    if gender == 'female':
        if disease in ['Migraine', 'Urinary Tract Infection']:
            confidence *= 1.1
    elif gender == 'male':
        if disease in ['Heart Disease', 'Hypertension']:
            confidence *= 1.1
    
    return min(confidence, 100)

def get_disease_description(disease):
    descriptions = {
        'Common Cold': 'A viral infection of the upper respiratory tract causing mild symptoms',
        'Influenza': 'A contagious respiratory illness caused by influenza viruses with severe symptoms',
        'Pneumonia': 'Infection that inflames the air sacs in one or both lungs, can be life-threatening',
        'Bronchitis': 'Inflammation of the bronchial tubes causing cough and breathing difficulties',
        'Asthma': 'A chronic condition that affects the airways in the lungs, causing breathing problems',
        'Diabetes Type 1': 'Autoimmune condition where the body attacks insulin-producing cells',
        'Diabetes Type 2': 'Metabolic disorder where the body becomes resistant to insulin',
        'Hypertension': 'High blood pressure that can lead to serious cardiovascular complications',
        'Migraine': 'A neurological condition characterized by severe, recurring headaches',
        'Gastritis': 'Inflammation of the stomach lining causing pain and digestive issues',
        'Appendicitis': 'Inflammation of the appendix requiring emergency surgical removal',
        'Heart Disease': 'Various conditions affecting the heart and blood vessels',
        'Kidney Disease': 'Progressive loss of kidney function affecting waste filtration',
        'Liver Disease': 'Various conditions affecting liver function and health',
        'Cancer': 'Uncontrolled growth of abnormal cells that can spread throughout the body',
        'Tuberculosis': 'Bacterial infection primarily affecting the lungs',
        'Malaria': 'Parasitic disease transmitted through mosquito bites',
        'Dengue': 'Viral disease transmitted by mosquitoes causing fever and pain',
        'COVID-19': 'Respiratory illness caused by SARS-CoV-2 virus',
        'Sinusitis': 'Inflammation of the sinuses causing facial pain and congestion',
        'Ear Infection': 'Infection of the ear causing pain and hearing problems',
        'Eye Infection': 'Infection of the eye causing redness, pain, and vision problems',
        'Skin Infection': 'Bacterial or fungal infection of the skin',
        'Urinary Tract Infection': 'Infection of the urinary system causing pain and frequent urination',
        'Food Poisoning': 'Illness caused by consuming contaminated food or water'
    }
    return descriptions.get(disease, 'A medical condition requiring professional diagnosis')

def get_disease_severity(disease):
    """Get disease severity level"""
    severity_levels = {
        'Common Cold': 'low',
        'Influenza': 'medium',
        'Pneumonia': 'high',
        'Bronchitis': 'medium',
        'Asthma': 'medium',
        'Diabetes Type 1': 'high',
        'Diabetes Type 2': 'high',
        'Hypertension': 'high',
        'Migraine': 'medium',
        'Gastritis': 'low',
        'Appendicitis': 'critical',
        'Heart Disease': 'high',
        'Kidney Disease': 'high',
        'Liver Disease': 'high',
        'Cancer': 'critical',
        'Tuberculosis': 'high',
        'Malaria': 'high',
        'Dengue': 'high',
        'COVID-19': 'high',
        'Sinusitis': 'low',
        'Ear Infection': 'medium',
        'Eye Infection': 'medium',
        'Skin Infection': 'low',
        'Urinary Tract Infection': 'medium',
        'Food Poisoning': 'medium'
    }
    return severity_levels.get(disease, 'medium')

def get_disease_treatment(disease):
    treatments = {
        'Common Cold': 'Rest, fluids, over-the-counter medications, symptom management',
        'Influenza': 'Rest, fluids, antiviral medications, fever management',
        'Pneumonia': 'Antibiotics, hospitalization if severe, oxygen therapy',
        'Bronchitis': 'Rest, fluids, cough suppressants, bronchodilators',
        'Asthma': 'Inhalers, avoiding triggers, long-term control medications',
        'Diabetes Type 1': 'Insulin therapy, blood sugar monitoring, diet management',
        'Diabetes Type 2': 'Oral medications, diet, exercise, blood sugar monitoring',
        'Hypertension': 'Lifestyle changes, medication, regular blood pressure monitoring',
        'Migraine': 'Pain relievers, rest in dark room, preventive medications',
        'Gastritis': 'Antacids, avoiding irritants, medication, diet changes',
        'Appendicitis': 'Emergency surgery (appendectomy), antibiotics',
        'Heart Disease': 'Medication, lifestyle changes, surgery if needed',
        'Kidney Disease': 'Medication, diet changes, dialysis if severe',
        'Liver Disease': 'Medication, lifestyle changes, liver transplant if severe',
        'Cancer': 'Surgery, chemotherapy, radiation therapy, targeted therapy',
        'Tuberculosis': 'Long-term antibiotic treatment, isolation if needed',
        'Malaria': 'Antimalarial medications, supportive care',
        'Dengue': 'Supportive care, fluid management, pain relief',
        'COVID-19': 'Supportive care, isolation, vaccination, antiviral medications',
        'Sinusitis': 'Decongestants, antibiotics if bacterial, nasal irrigation',
        'Ear Infection': 'Antibiotics, pain relievers, ear drops',
        'Eye Infection': 'Antibiotic eye drops, warm compresses, hygiene',
        'Skin Infection': 'Antibiotics, antifungal medications, topical treatments',
        'Urinary Tract Infection': 'Antibiotics, increased fluid intake, pain relief',
        'Food Poisoning': 'Fluid replacement, rest, antibiotics if bacterial'
    }
    return treatments.get(disease, 'Consult a healthcare provider for proper treatment')

def get_disease_prevention(disease):
    prevention = {
        'Common Cold': 'Wash hands frequently, avoid close contact, maintain good hygiene',
        'Influenza': 'Annual flu vaccine, good hygiene, avoid sick people',
        'Pneumonia': 'Pneumococcal vaccine, good hygiene, quit smoking',
        'Bronchitis': 'Avoid smoking, good hygiene, manage underlying conditions',
        'Asthma': 'Avoid triggers, take prescribed medications, regular check-ups',
        'Diabetes Type 1': 'No known prevention, early detection important',
        'Diabetes Type 2': 'Healthy diet, regular exercise, maintain healthy weight',
        'Hypertension': 'Reduce salt intake, exercise, maintain healthy weight',
        'Migraine': 'Identify triggers, maintain regular sleep, stress management',
        'Gastritis': 'Avoid spicy foods, limit alcohol, eat smaller meals',
        'Appendicitis': 'No known prevention, seek immediate medical attention',
        'Heart Disease': 'Healthy diet, exercise, quit smoking, manage stress',
        'Kidney Disease': 'Control blood pressure, diabetes, avoid nephrotoxic drugs',
        'Liver Disease': 'Limit alcohol, healthy diet, avoid risky behaviors',
        'Cancer': 'Regular screenings, healthy lifestyle, avoid carcinogens',
        'Tuberculosis': 'BCG vaccine, avoid close contact with infected individuals',
        'Malaria': 'Use mosquito nets, repellents, prophylactic medications',
        'Dengue': 'Use mosquito repellents, eliminate breeding sites',
        'COVID-19': 'Vaccination, mask wearing, social distancing, good hygiene',
        'Sinusitis': 'Manage allergies, avoid irritants, good nasal hygiene',
        'Ear Infection': 'Keep ears dry, avoid cotton swabs, treat allergies',
        'Eye Infection': 'Good hand hygiene, avoid touching eyes, proper contact lens care',
        'Skin Infection': 'Good hygiene, keep skin clean and dry, avoid sharing items',
        'Urinary Tract Infection': 'Stay hydrated, good hygiene, urinate frequently',
        'Food Poisoning': 'Proper food handling, cooking, storage, and hygiene'
    }
    return prevention.get(disease, 'Consult healthcare provider for prevention strategies')

def get_risk_factors(disease, age, gender):
    risk_factors = []
    
    if age > 60:
        risk_factors.extend(['Advanced age', 'Weakened immune system'])
    elif age < 18:
        risk_factors.extend(['Young age', 'Immature immune system'])
    
    if gender == 'female':
        if disease in ['Migraine', 'Urinary Tract Infection']:
            risk_factors.append('Female gender')
    elif gender == 'male':
        if disease in ['Heart Disease', 'Hypertension']:
            risk_factors.append('Male gender')
    
    disease_risks = {
        'Heart Disease': ['High blood pressure', 'High cholesterol', 'Smoking'],
        'Diabetes Type 2': ['Obesity', 'Family history', 'Sedentary lifestyle'],
        'Asthma': ['Allergies', 'Family history', 'Environmental factors'],
        'Cancer': ['Family history', 'Age', 'Lifestyle factors'],
        'Hypertension': ['High salt intake', 'Obesity', 'Stress']
    }
    
    if disease in disease_risks:
        risk_factors.extend(disease_risks[disease])
    
    return risk_factors

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print(json.dumps([]))
        sys.exit(1)
    
    try:
        symptoms = json.loads(sys.argv[1])
        age = int(sys.argv[2])
        gender = sys.argv[3]
        
        predictions = predict_disease_advanced(symptoms, age, gender)
        
        print(json.dumps(predictions))
        
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        print(json.dumps([])) 