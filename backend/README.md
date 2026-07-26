# Prakriti AI Backend

Standalone FastAPI backend for Prakriti AI. Does not modify or serve the React frontend.

## Setup

From the `backend/` directory (Python 3.11–3.13):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

## Train the ML model

Place datasets in `backend/datasets/` then run:

```powershell
python -m app.ml.training
```

Artifacts are saved to `backend/trained_models/`:
- `model.pkl` — CalibratedClassifierCV(LinearSVC)
- `vectorizer.pkl` — TfidfVectorizer
- `metadata.json` — accuracy and classification report

## Run the API

```powershell
uvicorn main:app --reload
```

- API: `http://127.0.0.1:8000`
- Docs: `http://127.0.0.1:8000/docs`
- Health: `GET /health` and `GET /api/v1/health`

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/register` | Register user |
| POST | `/api/v1/auth/login` | Login, returns JWT |
| POST | `/api/v1/predictions` | Create dosha prediction |
| GET | `/api/v1/predictions/{id}` | Get prediction by ID |
| POST | `/api/v1/uploads/prescription` | Upload PDF/image for OCR |
| POST | `/api/v1/reports` | Generate PDF report |
| GET | `/api/v1/reports/{id}/download` | Download PDF report |
| GET | `/health` | Health check |

## Prediction request

```json
{
  "symptoms": "dry skin, anxiety, irregular digestion",
  "assessment": {
    "body_build": "Thin",
    "appetite": "Irregular",
    "sleep": "Light",
    "skin": "Dry",
    "personality": "Restless"
  },
  "ocr_text": "optional extracted prescription text"
}
```

Symptoms carry 80% weight; optional assessment carries 20%. If assessment is omitted, prediction uses symptoms only.

## Configuration

All settings via `.env`. SQLite is default; switch to PostgreSQL by changing `DATABASE_URL` only.

## Tests

```powershell
pytest tests/ -v
```
