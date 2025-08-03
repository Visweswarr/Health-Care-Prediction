# Healthcare Aid - Full Stack Application

A comprehensive healthcare application with AI-powered disease prediction, insurance estimation, and personalized health management.

**Created by: Visweswar**

## Features

### 🏥 Disease Prediction
- **AI-Powered Analysis**: Advanced machine learning algorithms for disease prediction
- **Symptom Analysis**: Comprehensive symptom-based disease detection
- **Confidence Scoring**: Probability-based predictions with confidence levels
- **Treatment Recommendations**: Detailed treatment and prevention information
- **Risk Assessment**: Personalized risk factors based on age, gender, and medical history

### 💊 Insurance Calculator
- **Premium Estimation**: Calculate insurance premiums based on health profile
- **Plan Comparison**: Compare multiple insurance plans side-by-side
- **Personalized Factors**: Age, gender, and medical condition considerations
- **Coverage Analysis**: Detailed feature and exclusion breakdowns

### 👤 User Management
- **Secure Authentication**: JWT-based user authentication
- **Profile Management**: Complete user profile with medical history
- **Health Dashboard**: Analytics and insights into health patterns
- **Medical History**: Track and manage medical conditions

### 📊 Analytics Dashboard
- **Health Statistics**: Comprehensive health metrics and trends
- **Prediction History**: Track all disease predictions
- **Visual Analytics**: Charts and graphs for health insights
- **Quick Actions**: Easy access to main features

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Python** - ML integration
- **scikit-learn** - Machine learning library

### Frontend
- **React.js** - UI framework
- **Material-UI** - Component library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization

### Machine Learning
- **Random Forest** - Disease prediction
- **Gradient Boosting** - Alternative ML model
- **TF-IDF Vectorization** - Text processing
- **Feature Engineering** - Symptom vectorization

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Python (v3.8 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install Python dependencies**:
   ```bash
   pip install scikit-learn pandas numpy
   ```

4. **Set up environment variables**:
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/healthcare-aid
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

5. **Seed the database**:
   ```bash
   node seed.js
   ```

6. **Start the backend server**:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

## Usage

### Getting Started

1. **Register an account** at `http://localhost:3000/register`
2. **Login** with your credentials
3. **Complete your profile** with age, gender, and medical history
4. **Start using the features**:
   - Disease Prediction
   - Insurance Calculator
   - Health Dashboard

### Disease Prediction

1. Navigate to "Disease Prediction"
2. Select your symptoms from the comprehensive list
3. Choose between ML-based or rule-based prediction
4. Review the predictions with confidence scores
5. Check treatment and prevention recommendations

### Insurance Calculator

1. Navigate to "Insurance Calculator"
2. Enter your age, gender, and medical conditions
3. Select an insurance plan
4. View calculated premium with breakdown
5. Compare multiple plans side-by-side

### Profile Management

1. Navigate to "Profile"
2. Update personal information
3. Add medical conditions with dates and status
4. View health statistics and trends

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Disease Prediction
- `GET /api/disease` - Get all diseases
- `POST /api/disease/predict` - Rule-based prediction
- `POST /api/disease/predict-ml` - ML-based prediction
- `GET /api/disease/history/predictions` - Prediction history

### Insurance
- `GET /api/insurance/plans` - Get insurance plans
- `POST /api/insurance/calculate-premium` - Calculate premium
- `POST /api/insurance/compare` - Compare plans
- `GET /api/insurance/history` - Insurance history

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/medical-history` - Get medical history
- `POST /api/user/medical-history` - Add medical condition
- `PUT /api/user/medical-history/:id` - Update condition
- `DELETE /api/user/medical-history/:id` - Delete condition
- `GET /api/user/stats` - Get user statistics

## Machine Learning Model

The disease prediction system uses a comprehensive dataset with 25+ diseases and 50+ symptoms. The ML model features:

- **Random Forest Classifier** with 200 estimators
- **Gradient Boosting** as alternative model
- **TF-IDF Vectorization** for symptom processing
- **Feature Engineering** with binary symptom vectors
- **Confidence Adjustment** based on age and gender factors

### Model Training
The model is trained on synthetic data generated from real disease-symptom patterns, ensuring realistic predictions while maintaining privacy.

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  age: Number,
  gender: String,
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    status: String
  }],
  predictions: [{
    disease: String,
    confidence: Number,
    symptoms: [String],
    predictedDate: Date
  }]
}
```

### Disease Model
```javascript
{
  name: String,
  symptoms: [String],
  description: String,
  severity: String,
  treatment: String,
  prevention: String,
  riskFactors: [String],
  ageGroup: String,
  genderPreference: String
}
```

### Insurance Model
```javascript
{
  provider: String,
  planName: String,
  basePremium: Number,
  coverage: String,
  ageMultiplier: Number,
  genderMultiplier: Object,
  medicalConditionMultiplier: Number,
  features: [String],
  exclusions: [String]
}
```

## Security Features

- **JWT Authentication** with secure token management
- **Password Hashing** using bcryptjs
- **Input Validation** on all endpoints
- **CORS Configuration** for cross-origin requests
- **Error Handling** with proper HTTP status codes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Disclaimer

This application is for educational and informational purposes only. It should not replace professional medical advice. Always consult with healthcare providers for proper diagnosis and treatment.

## Support

For support or questions, please open an issue in the repository or contact the development team.

---

**Healthcare Aid** - Empowering health decisions with AI and data-driven insights.

**Developer: Visweswar** 