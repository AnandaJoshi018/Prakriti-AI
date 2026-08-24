# Project Information

## 1. Project Overview
- **Project Name**: Prakriti AI
- **Purpose**: Prakriti AI is a holistic wellness platform designed to analyze a user's physical and mental symptoms, integrate information from uploaded medical prescriptions, and determine their dominant Ayurvedic body constitution (Tridosha balance: Vata, Pitta, and Kapha). It delivers personalized daily schedules, diet charts, yoga guidelines, and herbal recommendations.
- **Problem Statement**: Determining one's Ayurvedic constitution (Prakriti) historically requires specialized, in-person consults. Additionally, modern patients frequently have physical records or prescriptions that they cannot easily tie into holistic lifestyle recommendations.
- **Objective**: Automate Ayurvedic constitution estimation by utilizing Machine Learning (NLP/SVM) to evaluate symptom language, blend it with a structured physiological questionnaire, extract clinical text via OCR from uploaded prescriptions, and generate downloadable PDF analysis reports containing comprehensive wellness guidelines.
- **Project Type**: AI/ML + Web Application

---

## 2. Complete Tech Stack

### Frontend
- **Framework**: React (v19.2.4)
- **Language**: JavaScript (JSX)
- **UI Libraries**: Lucide React (v1.8.0) for iconography
- **CSS Framework**: Tailwind CSS (v4.2.2) via `@tailwindcss/vite` integration
- **Routing**: React Router DOM (v7.14.1)
- **State Management**: React Hooks (`useState`, `useMemo`, `useEffect`) and local storage for authentication token and session state persistence
- **Build Tool**: Vite (v8.0.4)
- **HTTP Client**: Web Fetch API (packaged in `src/services/api.js`)
- **Icons**: Lucide React
- **Charts**: Custom CSS-based percentage bars (no external charting package)
- **Other Packages**: `@types/react`, `@types/react-dom`, `@vitejs/plugin-react`

### Backend
- **Framework**: FastAPI (v0.139.2)
- **Language**: Python (v3.11–3.13)
- **API Architecture**: RESTful API with versioned router prefix (`/api/v1`)
- **Authentication**: JSON Web Tokens (JWT) using `python-jose` with HTTP Bearer token extraction
- **Database**: SQLite (default local file `prakriti_ai.db`) or PostgreSQL (supported via configuration)
- **ORM**: SQLAlchemy (v2.0.51) supporting asynchronous operations via `aiosqlite` (SQLite) or `asyncpg` (PostgreSQL)
- **Validation**: Pydantic (v2.13.4) and `pydantic-settings` (v2.14.2)
- **Documentation**: OpenAPI/Swagger UI (served at `/docs`) and ReDoc (served at `/redoc`)
- **Logging**: Python `logging` module configured with custom loggers (JSON or plain-text) in `app/core/logging.py`
- **Dependency Injection**: FastAPI `Depends` for managing database sessions and session auth
- **Other Libraries**: `passlib` (bcrypt) for password cryptography, `easyocr` for OCR text extraction, `PyMuPDF` (fitz) for PDF content extraction, `reportlab` for PDF report generation, `pytest` for unit testing

---

## 3. Machine Learning
- **ML Library**: `scikit-learn` (v1.9.0) with support from `pandas` (v2.3.3) and `numpy` (v2.5.1).
- **Model Used**: Linear Support Vector Classifier (`LinearSVC(class_weight="balanced", random_state=42, dual=False)`).
- **Vectorizer**: Term Frequency-Inverse Document Frequency Vectorizer (`TfidfVectorizer(stop_words="english", ngram_range=(1, 2), max_features=5000, sublinear_tf=True)`).
- **Calibration Method**: `CalibratedClassifierCV` wrapper (using 5-fold cross-validation `cv=5` to calculate probability predictions since raw LinearSVC does not support `predict_proba` natively).
- **Text Preprocessing**: The system lowercases the raw input strings and strips away all non-alphabetic characters (only letters `a-z` and spaces are retained) using the `preprocess_text` function in `backend/app/ml/preprocessing.py`.
- **Dataset Cleaning**: 
  - Standardizes the column headers of all dataset tables (strips whitespace and capitalizes words).
  - Extracts and retains only the target columns: `Symptoms`, `Vata`, `Pitta`, and `Kapha`.
  - Removes any records that contain null/missing values.
  - Removes duplicate records based on the `Symptoms` column.
  - Formats the numerical columns `Vata`, `Pitta`, and `Kapha` to numeric format (replaces failures or empty values with `0`).
  - Removes rows where all three doshas are equal to `0` or are completely identical (no clear dominant constitution).
- **Duplicate Removal**: Performed in pandas via `df.drop_duplicates(subset=["Symptoms"])`.
- **Missing Value Handling**: Performed in pandas via `df.dropna()`.
- **Dataset Balancing**: Performed in `balance_dataset` using upsampling (`sklearn.utils.resample`). The majority class size is determined, and all minority classes are upsampled with replacement (`replace=True`) to match that count. The data is shuffled using `.sample(frac=1)`.
- **Feature Engineering**: A computed column `Dominant_Dosha` is generated representing the column name (`Vata`, `Pitta`, `Kapha`) with the highest score in each record: `df[["Vata", "Pitta", "Kapha"]].idxmax(axis=1)`.
- **Train/Test Split**: 80% train, 20% test, stratified by `Dominant_Dosha` (`stratify=y`, `random_state=42`).
- **Prediction Pipeline**:
  1. Combines user symptoms and OCR-extracted text into a single string.
  2. Runs text preprocessing (lowercasing, character filtering).
  3. Transforms the clean string into vector format via the loaded `TfidfVectorizer`.
  4. Passes the vectors through `CalibratedClassifierCV` to obtain probabilities for `Vata`, `Pitta`, and `Kapha`.
  5. Computes optional questionnaire responses into votes (Vata, Pitta, or Kapha) based on an assessment mapping.
  6. Blends the ML probabilities (80% weight) and the questionnaire probabilities (20% weight) using the blending formula:
     $$\text{Final Dosha Pct} = 0.8 \times \text{ML Pct} + 0.2 \times \text{Assessment Pct}$$
     *(Note: If no assessment is filled, the ML percentages are used at 100% weight)*.
  7. Calculates the dominant dosha (highest final percentage) and confidence level.
  8. Fetches Ayurvedic wellness recommendations corresponding to the dominant dosha.
- **Probability Calculation**: Calculated via `model.predict_proba(vec)[0]` on the calibrated classifier.
- **Model Saving**: Saved using `joblib.dump(model, model_path)` and `joblib.dump(vectorizer, vectorizer_path)` along with standard JSON serialization for training statistics/metadata in `metadata.json`.
- **Model Loading**: Done at startup by a singleton `ModelManager` class configured in `backend/app/ml/inference.py`.
- **Actual Files**:
  - Preprocessing, cleaning, upsampling, and text preprocessing: [preprocessing.py](file:///d:/PrakritiAI/backend/app/ml/preprocessing.py)
  - Offline training pipeline script: [training.py](file:///d:/PrakritiAI/backend/app/ml/training.py)
  - Production model loading and prediction manager: [inference.py](file:///d:/PrakritiAI/backend/app/ml/inference.py)
  - Blending algorithms, explanation generator, and dominant calculations: [prediction_service.py](file:///d:/PrakritiAI/backend/app/services/prediction_service.py)

---

## 4. Dataset Information
- **Dataset Files**:
  1. `AyurMind_Training_Dataset.csv`
  2. `prakriti_2000_dataset.xlsx`
  3. `Synthetic-generated-Dataset.xlsx`
- **Number of Datasets**: 3
- **File Formats**: Comma-Separated Values (`.csv`) and Microsoft Excel (`.xlsx`).
- **Columns**:
  - `AyurMind_Training_Dataset.csv`: `Symptoms`, `Diet`, `Yoga`, `Lifestyle`, `Vata`, `Pitta`, `Kapha`
  - `prakriti_2000_dataset.xlsx`: `Symptoms`, `Diet`, `Yoga`, `Lifestyle`, `Vata`, `Pitta`, `Kapha`
  - `Synthetic-generated-Dataset.xlsx`: `Symptoms`, `Diet`, `Yoga`, `Vata`, `Pitta`, `Kapha`
- **Target Labels**: `Dominant_Dosha` (`Vata`, `Pitta`, `Kapha`)
- **How Datasets are Merged**: The files are scanned sequentially, read into pandas dataframes, and combined vertically using `pd.concat(dataframes, ignore_index=True)`.
- **Where Datasets are Stored**: Under the [backend/datasets/](file:///d:/PrakritiAI/backend/datasets) directory.

---

## 5. OCR Module
- **OCR Library**: `easyocr` (for images) and PyMuPDF (`fitz` wrapper) (for PDF text layers).
- **Supported File Formats**: `.pdf`, `.jpg`, `.jpeg`, `.png`
- **Image Preprocessing**: Raw image bytes are read using PIL (`Image.open`). If the image color profile is not RGB, it is programmatically converted to RGB: `image.convert("RGB")`.
- **OCR Workflow**:
  1. Files are uploaded via the endpoint. The extension is validated against the allowed format list.
  2. If the file is a PDF, PyMuPDF opens the document and extracts text page-by-page.
  3. If the file is an image, the image is loaded, verified as RGB, and processed by `easyocr.Reader(["en"], gpu=False)` using the `.readtext(image, detail=0, paragraph=True)` method to extract paragraphs of English text.
  4. The system returns the extracted text string and any processing errors.
- **Files Responsible**:
  - Text extraction services: [easyocr_service.py](file:///d:/PrakritiAI/backend/app/ocr/easyocr_service.py)
  - Higher-level storage and trigger service: [upload_service.py](file:///d:/PrakritiAI/backend/app/services/upload_service.py)

---

## 6. Recommendation Engine
- **Recommendation Strategy**: Ayurvedic recommendations are statically defined for each dominant dosha (Vata, Pitta, Kapha) in a JSON configuration file. When a user's dominant dosha is calculated, the matching block of guidelines is loaded.
- **Rule Files**: [rules_v1.json](file:///d:/PrakritiAI/backend/app/recommendation/rules_v1.json)
- **Diet Generation**: Specifies appropriate food qualities (e.g., warm, cooked, grounding for Vata; cooling, sweet, bitter for Pitta; warm, light, dry for Kapha).
- **Yoga Generation**: Suggests specific exercise guidelines (e.g., gentle restorative Hatha for Vata; Moon Salutations for Pitta; vigorous Sun Salutations for Kapha).
- **Herbs**: Recommends balancing botanicals (e.g., Ashwagandha and Shatavari for Vata; Amalaki and Neem for Pitta; Trikatu and Tulsi for Kapha).
- **Lifestyle**: Suggests lifestyle guidelines, including massage practices (e.g., warm sesame oil Abhyanga for Vata; cooling coconut oil for Pitta; dry brushing/active routines for Kapha).
- **Daily Routine**: Provides a structured timeline containing morning routines, evening wind-down tips, hydration protocols, sleep parameters, mental hygiene practices, stress management guides, and general wellness tips.
- **File Responsible**: [engine.py](file:///d:/PrakritiAI/backend/app/recommendation/engine.py)

---

## 7. PDF Report
- **Library Used**: `reportlab` (uses flowable elements like `SimpleDocTemplate`, `Paragraph`, `Spacer`, and `Table` with `TableStyle` stylesheets).
- **Information Included**:
  - Document Title: "Prakriti AI — Dosha Analysis Report"
  - Execution metadata: Generation date/time (UTC)
  - User input parameters: Symptoms, questionnaire options (if filled), and a snippet of the OCR extracted prescription text (up to 500 characters)
  - Tridosha Balance Table: Vata, Pitta, and Kapha percentages alongside dominant dosha and confidence score
  - Machine Learning Analysis description (AI explanation text)
  - Complete list of Ayurvedic Recommendations: Diet, Foods to Eat, Foods to Avoid, Herbs, Yoga, Lifestyle, Daily Routine, Morning Routine, Evening Routine, Hydration, Sleep, Mental Hygiene, Stress Management, and Wellness Tips
- **Output Format**: PDF document scaled to A4 layout. The styling uses a custom green palette (primary: `#1B4332`, secondary: `#2D6A4F`, table rows: `#F0F4EF`).
- **Download Flow**:
  1. Frontend triggers a `POST` request to `/api/v1/reports` with the `prediction_id`.
  2. The server loads the prediction, compiles the input/output details, triggers `generate_prediction_report`, and saves the file to `backend/uploads/reports/report_{prediction_id}.pdf`.
  3. The server logs the report record into the database table, returning the database ID and the endpoint route path (`/api/v1/reports/{report_id}/download`).
  4. The frontend initiates a `GET` request to the returned URL path. The server streams the PDF as a `FileResponse`.
- **Files Responsible**:
  - ReportLab PDF generator service: [report_generator.py](file:///d:/PrakritiAI/backend/app/pdf/report_generator.py)
  - API endpoint routing: [reports.py](file:///d:/PrakritiAI/backend/app/api/v1/endpoints/reports.py)

---

## 8. Authentication
- **JWT**: Handled using the `python-jose` library. When a user logs in, a session token is generated containing the user's email as the subject (`sub`) and an expiration timestamp (`exp`). It is signed using the `HS256` algorithm and the `JWT_SECRET_KEY` loaded from the settings.
- **Password Hashing**: Cryptographic password hashing is managed using `passlib` configured to use the `bcrypt` hashing scheme.
- **Protected Routes**: Protected routes utilize FastAPI's dependency injection to invoke `Depends(get_current_user)`. This checks for the `Authorization: Bearer <token>` HTTP header, decodes the token, verifies the signature, and matches the subject against the database. If any validation fails, it raises an `HTTP 401 Unauthorized` exception.
- **User Flow**:
  1. A new user registers by sending credentials to `POST /api/v1/auth/register`.
  2. The user signs in via `POST /api/v1/auth/login`, receiving a JSON token payload: `{"access_token": "...", "token_type": "bearer"}`.
  3. The token is stored in the browser's `localStorage` as `prakriti_token`.
  4. Subsequent API calls (like history and profile retrieval) retrieve this token from storage and place it in the `Authorization` header.
  5. If an API call fails with status code `401`, the token is cleared from `localStorage` (`clearStoredToken()`), and the user is redirected to the `/login` page.
- **Files Responsible**:
  - Security configuration & algorithms: [security.py](file:///d:/PrakritiAI/backend/app/auth/security.py)
  - Current user dependencies: [dependencies.py](file:///d:/PrakritiAI/backend/app/auth/dependencies.py)
  - Auth routes: [auth.py](file:///d:/PrakritiAI/backend/app/api/v1/endpoints/auth.py)

---

## 9. Database
- **Database Engine**: SQLite (default configuration) or PostgreSQL.
- **ORM**: SQLAlchemy (v2.0) using Declarative Mapping and Asynchronous Session Management.
- **Models**:
  - **User**: Represents registered users. Holds `id`, unique `email`, `full_name`, `hashed_password`, and `created_at` timestamp.
  - **Prediction**: Represents dosha predictions. Holds input `symptoms`, serialized questionnaire (`assessment_json`), `ocr_text`, `ocr_filename`, numerical percentages (`vata_pct`, `pitta_pct`, `kapha_pct`), `dominant_dosha`, `confidence`, `explanation` text, serialized `recommendations_json`, and `created_at`. Can optionally link to `user_id`.
  - **Upload**: Represents file uploads. Holds file metadata (`filename`, `content_type`, `file_path`), the extracted `ocr_text`, `ocr_error` messages, and `created_at` timestamp. Can optionally link to `user_id`.
  - **Report**: Represents generated PDF reports. Tracks the PDF file's local path (`file_path`), creation time (`created_at`), corresponding `prediction_id` (foreign key to `predictions.id`), and optional `user_id`.
- **Tables**: `users`, `predictions`, `uploads`, `reports`
- **Relationships**:
  - `User.predictions` (one-to-many relationship with `Prediction`)
  - `User.reports` (one-to-many relationship with `Report`)
  - `Prediction.reports` (one-to-many relationship with `Report`)
  - `Report.user` (many-to-one relationship with `User`)
  - `Report.prediction` (many-to-one relationship with `Prediction`)
- **Files Responsible**:
  - Database initialization, engine setup, and async session generator: [database.py](file:///d:/PrakritiAI/backend/app/core/database.py)
  - Model definitions: [models/init.py](file:///d:/PrakritiAI/backend/app/models/__init__.py)

---

## 10. Backend Folder Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/      # Individual FastAPI endpoints (auth, health, predictions, reports, uploads)
│   │       └── router.py       # Main aggregated API router
│   ├── auth/
│   │   ├── dependencies.py     # FastAPI authentication dependencies (inject current user)
│   │   └── security.py         # Password hashing (passlib) and JWT token generation/decoding
│   ├── core/
│   │   ├── config.py           # Application configurations (loads environment variables using pydantic-settings)
│   │   ├── database.py         # Database engine setup, async session generator, tables initializer
│   │   ├── exceptions.py       # Custom exception classes and global handlers
│   │   └── logging.py          # Logger settings
│   ├── ml/
│   │   ├── inference.py        # Singleton manager to load model and run text inference
│   │   ├── preprocessing.py    # Dataset standardizers, cleaner, text preprocessor, class balancer
│   │   └── training.py         # Model training script for LinearSVC + CalibratedClassifierCV
│   ├── models/
│   │   └── __init__.py         # SQLAlchemy ORM models (User, Prediction, Upload, Report)
│   ├── ocr/
│   │   └── easyocr_service.py  # OCR extraction functions (EasyOCR for images, PyMuPDF for PDFs)
│   ├── pdf/
│   │   └── report_generator.py # ReportLab PDF creator
│   ├── recommendation/
│   │   ├── engine.py           # Recommendation lookup helper
│   │   └── rules_v1.json       # JSON file storing dietary/lifestyle rules for Vata, Pitta, Kapha
│   ├── schemas/
│   │   ├── auth.py             # Auth Pydantic input/output schemas
│   │   ├── prediction.py       # Prediction Pydantic schemas (assessment, request, response)
│   │   ├── report.py           # Report creation and response schemas
│   │   └── upload.py           # Upload response schemas
│   ├── services/
│   │   ├── prediction_service.py # Core prediction logic combining ML + optional assessment
│   │   └── upload_service.py   # Upload file storage and OCR processor
│   ├── utils/
│   │   └── __init__.py         # Utility functions
│   └── main.py                 # FastAPI application factory and lifespan setup
├── datasets/                   # Subdirectory containing dataset files for ML training
├── trained_models/             # Stored ML pickles (model.pkl, vectorizer.pkl, metadata.json)
├── uploads/                    # Local storage directory for file uploads and generated PDF reports
├── main.py                     # Entrypoint script to run the uvicorn server
└── requirements.txt            # Python dependencies configuration file
```

### Purpose of Every Folder:
- **`app/api/v1/endpoints/`**: Contains the route handlers categorized by business domain.
- **`app/api/v1/`**: Groups version 1 of the REST API endpoints and routing logic.
- **`app/api/`**: Main directory for application endpoints.
- **`app/auth/`**: Holds password cryptography routines, token encoding/decoding, and authorization dependencies.
- **`app/core/`**: Implements system configurations, global exception handlers, log setups, and ORM engine management.
- **`app/ml/`**: Machine learning operations including cleaning raw datasets, training SVM pipelines, and managing model inferences.
- **`app/models/`**: Defines SQLAlchemy ORM entities mapping directly to SQL tables.
- **`app/ocr/`**: Integrates optical character recognition engines (EasyOCR, PyMuPDF).
- **`app/pdf/`**: Implements structural layout designs to compile Ayurvedic results into ReportLab PDF objects.
- **`app/recommendation/`**: Manages structural rules maps (JSON) and retrieval routines to match doshas with guidelines.
- **`app/schemas/`**: Pydantic input/output models enforcing strict contract definitions.
- **`app/services/`**: Orchestrates operations from database layers, ML models, and helper functions (prediction/upload logic).
- **`app/utils/`**: Holds miscellaneous utility functions.
- **`datasets/`**: Directory where raw training files (CSV and Excel) are saved.
- **`trained_models/`**: Destination where model pipelines are saved.
- **`uploads/`**: Stores uploaded prescription files and generated PDF reports.

---

## 11. Frontend Folder Structure

```
src/
├── assets/                     # Graphic assets (images, vectors)
├── components/                 # Reusable UI component definitions
│   ├── DashboardSidebar.jsx    # Sidebar navigation for the app portal
│   ├── FeatureCards.jsx        # Landing page feature cards
│   ├── Footer.jsx              # Responsive footers (marketing, auth, appShell)
│   ├── HeroSection.jsx         # Landing page and signup hero segments
│   ├── LoginForm.jsx           # Sign in input panel & state handling
│   ├── Navbar.jsx              # Responsive navigation header
│   ├── RecommendationCard.jsx  # Customized cards displaying Ayurvedic protocols
│   ├── ResultCard.jsx          # Simple components for displaying results
│   ├── SignupForm.jsx          # User registration panel
│   ├── SymptomInput.jsx        # Textarea symptom input box
│   └── UploadCard.jsx          # Dashed file drop-zone card supporting PDF/images
├── pages/                      # Page components corresponding to routing
│   ├── DashboardPage.jsx       # Main symptom checker dashboard portal
│   ├── HistoryPage.jsx         # Access past prediction logs and reports
│   ├── HomePage.jsx            # Landing / Marketing page
│   ├── LearnAyurvedaPage.jsx   # Interactive reference guide on Ayurvedic concepts
│   ├── LearnMorePage.jsx       # Additional features details page
│   ├── LoginPage.jsx           # Sign in page container
│   ├── RecommendationPage.jsx  # Full details of the prediction recommendations
│   ├── ResultPage.jsx          # Predictions visualization and download page
│   └── SignupPage.jsx          # User signup page container
├── services/
│   ├── api.js                  # Fetch API request handlers & state storage utilities
│   └── api.test.js             # Basic API endpoint tests
├── styles/
│   ├── App.css                 # Custom styled rules, colors, and layout configurations
│   └── index.css               # Tailwind directives and default typography
├── App.jsx                     # Application routing definitions (react-router-dom)
└── main.jsx                    # React client entry point
```

### Purpose of Every Folder:
- **`assets/`**: Contains static image resources used across the user interface.
- **`components/`**: House reusable modular interface elements (inputs, nav bars, card blocks).
- **`pages/`**: Page container layouts mapping to specific paths.
- **`services/`**: Holds API integration layers and request utilities.
- **`styles/`**: Defines the CSS styling variables, Tailwind configurations, and UI aesthetics.

---

## 12. API Documentation

### 1. Root Health Check
- **URL**: `/health`
- **Method**: `GET`
- **Request Body**: None
- **Response**: `{"status": "ok"}`
- **Authentication Required**: No
- **Purpose**: Verifies that the FastAPI application is running.

### 2. V1 Health Check
- **URL**: `/api/v1/health`
- **Method**: `GET`
- **Request Body**: None
- **Response**: `{"status": "ok", "service": "Prakriti AI API", "version": "0.1.0"}`
- **Authentication Required**: No
- **Purpose**: Checks the health status and returns the application version.

### 3. Readiness Check
- **URL**: `/api/v1/ready`
- **Method**: `GET`
- **Request Body**: None
- **Response**: `{"status": "ready", "model_loaded": true}` (or `"degraded"` if model fails to load)
- **Authentication Required**: No
- **Purpose**: Checks if the machine learning model files are loaded and ready.

### 4. User Registration
- **URL**: `/api/v1/auth/register`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123",
    "full_name": "John Doe"
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe"
  }
  ```
- **Authentication Required**: No
- **Purpose**: Registers a new user account with hashed passwords.

### 5. User Login
- **URL**: `/api/v1/auth/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer"
  }
  ```
- **Authentication Required**: No
- **Purpose**: Authenticates a user and returns a JWT access token.

### 6. User Profile
- **URL**: `/api/v1/auth/me`
- **Method**: `GET`
- **Request Body**: None
- **Response**:
  ```json
  {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe"
  }
  ```
- **Authentication Required**: Yes (Bearer Token)
- **Purpose**: Retrieves the profile details of the authenticated user.

### 7. List Predictions
- **URL**: `/api/v1/predictions`
- **Method**: `GET`
- **Request Body**: None
- **Response**: Array of prediction detail response objects (returns empty list if anonymous).
- **Authentication Required**: Optional (Bearer Token)
- **Purpose**: Retrieves all predictions associated with the active user.

### 8. Create Prediction
- **URL**: `/api/v1/predictions`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "symptoms": "dry skin, anxiety, joint stiffness",
    "assessment": {
      "body_build": "Thin",
      "appetite": "Irregular",
      "sleep": "Light",
      "skin": "Dry",
      "personality": "Restless"
    },
    "ocr_text": "optional prescription text",
    "ocr_filename": "optional_file_name.pdf"
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "prediction": {
      "Vata": 80.0,
      "Pitta": 10.0,
      "Kapha": 10.0
    },
    "dominant_dosha": "Vata",
    "confidence": 80.0,
    "explanation": "Based on symptom language analysis...",
    "recommendations": {
      "diet": "...",
      "foods_to_eat": "...",
      "foods_to_avoid": "...",
      "herbs": "...",
      "yoga": "...",
      "lifestyle": "...",
      "daily_routine": "...",
      "morning_routine": "...",
      "evening_routine": "...",
      "hydration": "...",
      "sleep": "...",
      "mental_hygiene": "...",
      "stress_management": "...",
      "wellness_tips": "..."
    }
  }
  ```
- **Authentication Required**: Optional (saves user reference if Bearer Token is supplied)
- **Purpose**: Runs ML prediction and returns the dominant constitution and recommendations.

### 9. Prediction History
- **URL**: `/api/v1/predictions/history`
- **Method**: `GET`
- **Request Body**: None
- **Response**: Array of prediction objects:
  ```json
  [
    {
      "id": 1,
      "prediction": { "Vata": 80.0, "Pitta": 10.0, "Kapha": 10.0 },
      "dominant_dosha": "Vata",
      "confidence": 80.0,
      "explanation": "...",
      "recommendations": { ... },
      "symptoms": "...",
      "assessment": { ... },
      "ocr_text": "...",
      "ocr_filename": "...",
      "created_at": "2026-07-26T11:28:01.123"
    }
  ]
  ```
- **Authentication Required**: Yes (Bearer Token)
- **Purpose**: Retrieves the detailed prediction history of the user.

### 10. Get Prediction By ID
- **URL**: `/api/v1/predictions/{prediction_id}`
- **Method**: `GET`
- **Request Body**: None
- **Response**: Single prediction detail object.
- **Authentication Required**: No
- **Purpose**: Retrieves a specific prediction's parameters and results.

### 11. Upload Prescription for OCR
- **URL**: `/api/v1/uploads/prescription`
- **Method**: `POST`
- **Request Body**: Multipart Form Data (`file`: File object)
- **Response**:
  ```json
  {
    "id": 1,
    "filename": "prescription.jpg",
    "content_type": "image/jpeg",
    "ocr_text": "Extracted text content...",
    "ocr_error": null
  }
  ```
- **Authentication Required**: Optional (Bearer Token)
- **Purpose**: Saves prescription files and runs OCR text extraction.

### 12. Create Report
- **URL**: `/api/v1/reports`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "prediction_id": 1
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "prediction_id": 1,
    "download_url": "/api/v1/reports/1/download",
    "created_at": "2026-07-26T11:28:05.123"
  }
  ```
- **Authentication Required**: Optional (Bearer Token)
- **Purpose**: Generates a PDF report for a prediction on the server and returns a download link.

### 13. Download Report
- **URL**: `/api/v1/reports/{report_id}/download`
- **Method**: `GET`
- **Request Body**: None
- **Response**: File Stream (`application/pdf`)
- **Authentication Required**: No
- **Purpose**: Downloads the generated PDF report.

---

## 13. Frontend Pages

### 1. `HomePage.jsx`
- **Purpose**: The marketing landing page for the application. Introduces the core concepts of Prakriti AI.
- **Components Used**:
  - `Navbar` (variant "marketing", active "home")
  - `HeroSection` (variant "home")
  - `FeatureCards` (variant "home")
  - `Footer` (variant "marketing")
- **API Calls**: None.
- **Navigation**: Directs to `/login`, `/signup`, or `/learn-more`.

### 2. `LearnMorePage.jsx`
- **Purpose**: An informational page explaining the details of platform features.
- **Components Used**:
  - `Navbar` (variant "marketing", active "features")
  - `HeroSection` (variant "learn")
  - `FeatureCards` (variant "learn")
  - `Footer` (variant "marketing")
- **API Calls**: None.
- **Navigation**: Navigates back to the homepage.

### 3. `LoginPage.jsx`
- **Purpose**: The login screen where users authenticate.
- **Components Used**:
  - `LoginForm`
  - `Footer` (variant "authLogin")
- **API Calls**: `loginUser` (invokes `POST /api/v1/auth/login`).
- **Navigation**: Redirects to `/dashboard` upon successful authentication, or allows navigating to `/signup` or `/`.

### 4. `SignupPage.jsx`
- **Purpose**: The sign-up portal for new users.
- **Components Used**:
  - `Navbar` (variant "signup")
  - `HeroSection` (variant "signupLeft")
  - `SignupForm`
  - `Footer` (variant "authSignup")
- **API Calls**: `registerUser` (invokes `POST /api/v1/auth/register`).
- **Navigation**: Redirects to `/login` upon successful registration.

### 5. `DashboardPage.jsx`
- **Purpose**: The main interactive portal where users submit data for analysis.
- **Components Used**:
  - `DashboardSidebar` (active "dashboard")
  - `SymptomInput` (textarea for symptom descriptions)
  - `UploadCard` (dashed zone for file uploads)
  - `Footer` (variant "appShell")
- **API Calls**:
  - `getCurrentUser` (fetches name at startup: `GET /api/v1/auth/me`)
  - `uploadPrescription` (OCR file upload: `POST /api/v1/uploads/prescription`)
  - `createPrediction` (submits symptoms, assessment, and OCR text: `POST /api/v1/predictions`)
- **Navigation**: Navigates to `/result` on successful prediction. Navigates to `/login` if token validation fails.

### 6. `ResultPage.jsx`
- **Purpose**: Visualizes the predicted Tridosha balance percentages and dominant dosha description.
- **Components Used**:
  - `DashboardSidebar` (active "result")
  - `Footer` (variant "appShell")
- **API Calls**:
  - `generateReport` (creates report record: `POST /api/v1/reports`)
  - `downloadReport` (fetches the PDF file: `GET /api/v1/reports/{id}/download`)
- **Navigation**: Navigates to `/dashboard` or uses the sidebar.

### 7. `RecommendationPage.jsx`
- **Purpose**: Displays categorized Ayurvedic recommendations for the user's dominant dosha.
- **Components Used**:
  - `DashboardSidebar` (active "recommendation")
  - `DietaryProtocolCard`, `MovementCard`, `EveningRoutineCard`, `MentalHygieneCard` (defined in `RecommendationCard.jsx`)
  - `Footer` (variant "appShell")
- **API Calls**: `listPredictions` (loads latest prediction if none is cached in `localStorage`).
- **Navigation**: Uses the sidebar.

### 8. `LearnAyurvedaPage.jsx`
- **Purpose**: An interactive educational reference guide explaining Ayurveda, Vata, Pitta, Kapha, seasonal diets, and yoga practices. Includes a FAQ section.
- **Components Used**:
  - `DashboardSidebar` (active "dashboard")
  - `Footer`
- **API Calls**: None.
- **Navigation**: Navigates to `/dashboard`.

### 9. `HistoryPage.jsx`
- **Purpose**: Displays a list of the user's past predictions.
- **Components Used**:
  - `DashboardSidebar` (active "history")
  - `Footer` (variant "appShell")
- **API Calls**:
  - `getPredictionHistory` (`GET /api/v1/predictions/history`)
  - `generateReport` (`POST /api/v1/reports`)
  - `downloadReport` (`GET /api/v1/reports/{id}/download`)
- **Navigation**: Directs to `/result` to inspect a past prediction in detail.

---

## 14. Complete Workflow

```
[ User Login ] (Enters email/password at /login; JWT stored in localStorage)
       ↓
[ Dashboard ] (Loads user name, ready for user inputs)
       ↓
[ Symptoms ] (User inputs symptom description in text area)
       ↓
[ Assessment ] (Optional: User answers 5 constitutional questions)
       ↓
[ OCR Upload ] (Optional: User uploads PDF/image; text is extracted via OCR)
       ↓
[ Prediction ] (Sends data to backend; ML classifier & assessment are blended 80/20)
       ↓
[ Recommendations ] (Calculates dominant dosha and loads recommendations)
       ↓
[ PDF Report ] (Generates PDF report on the server and downloads it to client)
       ↓
[ Logout ] (Token is cleared from localStorage upon 401 Unauthorized/expiry)
```

---

## 15. Environment Variables

### Frontend Variables
- `VITE_API_BASE_URL`: Specifies the backend server's host and port (defaults to `http://127.0.0.1:8000`).

### Backend Variables
- `APP_NAME`: The title of the FastAPI application (defaults to `Prakriti AI API`).
- `APP_VERSION`: The application version (defaults to `0.1.0`).
- `ENVIRONMENT`: The running mode (defaults to `development`).
- `DEBUG`: Enables SQLAlchemy query logs and detailed error tracebacks if set to `true` (defaults to `false`).
- `HOST`: Server interface to bind to (defaults to `127.0.0.1`).
- `PORT`: Server port (defaults to `8000`).
- `LOG_LEVEL`: Log severity level (defaults to `INFO`).
- `JSON_LOGS`: Enables JSON structured logging if `true` (defaults to `false`).
- `API_V1_PREFIX`: Path prefix for routing (defaults to `/api/v1`).
- `DOCS_ENABLED`: Exposes the interactive API documentation at `/docs` if `true`.
- `CORS_ORIGINS`: Comma-separated list of allowed client origins (defaults to `http://localhost:5173`).
- `DATABASE_URL`: SQLAlchemy connection string (defaults to `sqlite:///./prakriti_ai.db`).
- `JWT_SECRET_KEY`: Secret string to cryptographically sign session tokens (Not Found in `.env.example` placeholder).
- `JWT_ALGORITHM`: Cryptographic algorithm used to sign tokens (defaults to `HS256`).
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Expiration time for generated session keys (defaults to `60`).
- `DATASET_DIR`: Path where training datasets are located (defaults to `datasets`).
- `MODEL_DIR`: Path where trained model files are saved/loaded (defaults to `trained_models`).
- `UPLOAD_DIR`: Path to save uploaded prescriptions and generated reports (defaults to `uploads`).
- `MAX_UPLOAD_SIZE_MB`: Max size in MB of uploaded files (defaults to `10`).

---

## 16. Installed Packages

### Frontend Packages
- `lucide-react`: `^1.8.0`
- `react`: `^19.2.4`
- `react-dom`: `^19.2.4`
- `react-router-dom`: `^7.14.1`
- `@eslint/js`: `^9.39.4`
- `@tailwindcss/vite`: `^4.2.2`
- `@types/react`: `^19.2.14`
- `@types/react-dom`: `^19.2.3`
- `@vitejs/plugin-react`: `^6.0.1`
- `eslint`: `^9.39.4`
- `eslint-plugin-react-hooks`: `^7.0.1`
- `eslint-plugin-react-refresh`: `^0.5.2`
- `globals`: `^17.4.0`
- `tailwindcss`: `^4.2.2`
- `vite`: `^8.0.4`

### Backend Packages
- `fastapi`: `0.139.2` (via `>=0.115,<1.0` requirement)
- `uvicorn[standard]`: `0.51.0` (via `>=0.30,<1.0` requirement)
- `pydantic`: `2.13.4` (via `>=2.9,<3.0` requirement)
- `pydantic-settings`: `2.14.2` (via `>=2.5,<3.0` requirement)
- `email-validator`: `2.3.0` (via `>=2.2,<3.0` requirement)
- `python-multipart`: `0.0.32` (via `>=0.0.20,<1.0` requirement)
- `aiofiles`: `24.1.0` (via `>=24.1,<25.0` requirement)
- `orjson`: `3.11.9` (via `>=3.10,<4.0` requirement)
- `SQLAlchemy`: `2.0.51` (via `>=2.0,<3.0` requirement)
- `aiosqlite`: `0.22.1` (via `>=0.20,<1.0` requirement)
- `greenlet`: `3.5.4` (via `>=3.0,<4.0` requirement)
- `python-jose[cryptography]`: `3.5.0` (via `>=3.3,<4.0` requirement)
- `passlib[bcrypt]`: `1.7.4` (via `>=1.7.4,<2.0` requirement)
- `bcrypt`: `4.3.0` (via `>=4.1,<5.0` requirement)
- `numpy`: `2.5.1` (via `>=2.1,<3.0` requirement)
- `pandas`: `2.3.3` (via `>=2.2,<3.0` requirement)
- `scipy`: `1.18.0` (via `>=1.14,<2.0` requirement)
- `scikit-learn`: `1.9.0` (via `>=1.5,<2.0` requirement)
- `joblib`: `1.5.3` (via `>=1.4,<2.0` requirement)
- `openpyxl`: `3.1.5` (via `>=3.1,<4.0` requirement)
- `xgboost`: `3.3.0` (via `>=2.1,<4.0` requirement)
- `lightgbm`: `4.7.0` (via `>=4.5,<5.0` requirement)
- `catboost`: `1.2.10` (via `>=1.2,<2.0` requirement)
- `easyocr`: `1.7.2` (via `>=1.7,<2.0` requirement)
- `Pillow`: `10.4.0` (via `>=10.4,<12.0` requirement)
- `PyMuPDF`: `1.28.0` (via `>=1.24,<2.0` requirement)
- `reportlab`: `4.5.1` (via `>=4.2,<5.0` requirement)
- `httpx`: `0.28.1` (via `>=0.27,<1.0` requirement)
- `pytest`: `8.4.2` (via `>=8.3,<9.0` requirement)
- `pytest-asyncio`: `0.26.0` (via `>=0.24,<1.0` requirement)

---

## 17. Current Project Status

- **Completed Modules**:
  - User Authentication (Registration, Login, JWT verification, password hashing)
  - Predictions Module (Symptom processing, questionnaire mapping, ML + assessment weighting)
  - OCR Module (Text extraction from images using EasyOCR, and text from PDF documents using PyMuPDF)
  - Recommendations Module (JSON-based lookup engine)
  - PDF Generation Module (ReportLab template builder)
  - App Shell & Dashboard UI (Responsive sidebars, symptom text areas, file upload cards, and results display)
- **Partially Completed Modules**:
  - Model Training Pipeline: The training workflow is offline and manual. Running `python -m app.ml.training` pulls the datasets, processes features, balances classes, fits the SVM models, and outputs model files. It is not currently integrated as an online trigger inside the web application UI.
- **Missing Modules**: None (all core objectives are met).
- **Overall Completion Percentage**: **95%** (fully operational wellness checking flow, with ML retraining remaining as an offline script).

---

## 18. Deployment

### Frontend Deployment
1. Build the static frontend bundle using Vite:
   ```bash
   npm run build
   ```
2. Deploy the generated output folder (`dist/`) to a static hosting provider (e.g., Netlify, Vercel, AWS S3, or Cloudflare Pages).
3. Ensure the environment variable `VITE_API_BASE_URL` is set to the live URL of the deployed backend service.

### Backend Deployment
1. Set up a production server environment (e.g., AWS EC2, VPS, Heroku, Render, or Docker containers).
2. Configure the production environment variables in the server settings (or a secure `.env` file).
3. Ensure `JWT_SECRET_KEY` is set to a long, cryptographically random secret.
4. Replace `DATABASE_URL` with a production database URI (e.g., PostgreSQL).
5. Start the server using Uvicorn:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
   ```

### Required Environment Variables
- `VITE_API_BASE_URL` (Frontend: Live API URL)
- `DATABASE_URL` (Backend: Production database connection URI)
- `JWT_SECRET_KEY` (Backend: Strong token signature secret)
- `CORS_ORIGINS` (Backend: Deployed URL of the frontend)
- `ENVIRONMENT` (Backend: `"production"`)

---

## 19. Future Improvements
- **Online Model Retraining**: Build an admin dashboard where administrators can upload new datasets and trigger model retraining directly from the UI.
- **Multi-Language OCR Support**: Extend the EasyOCR initialization language parameters (`["en"]`) to support multi-language translation and extraction from non-English prescriptions.
- **Constitutional Progress Tracking**: Expand the database and frontend history pages to visualize changes in a user's Tridosha balance over time.
- **Token Refresh Flows**: Implement JWT refresh tokens to maintain user sessions securely without prompting for credentials frequently.

---

## 20. Developer Notes
- **Database Engine**: While SQLite (`sqlite+aiosqlite`) is used locally, database connections utilize SQLAlchemy's async engine. When deploying to PostgreSQL, ensure the `DATABASE_URL` uses the `postgresql+asyncpg://` schema.
- **Model Estimation**: The base classifier is `LinearSVC`. Because linear SVMs do not natively yield probability distributions, it is calibrated using `CalibratedClassifierCV`. Do not replace the model wrapper without ensuring the alternative classifier supports `predict_proba`.
- **Text Preprocessing**: The preprocessing logic excludes numbers and symbols from the text before vectorization. Ensure that symptom checklists do not rely on numeric descriptors in the raw text corpus.
- **Blending Ratio**: The symptom-to-assessment blending ratio is currently hardcoded in [prediction_service.py](file:///d:/PrakritiAI/backend/app/services/prediction_service.py) as `0.8` (symptom weight) and `0.2` (questionnaire weight). Adjusting these parameters requires modifying the constants `SYMPTOM_WEIGHT` and `ASSESSMENT_WEIGHT`.
