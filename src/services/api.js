const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

function getStoredToken() {
  if (typeof window === 'undefined') {
    return null
  }
  return window.localStorage.getItem('prakriti_token')
}

function setStoredToken(token) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('prakriti_token', token)
  }
}

function clearStoredToken() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('prakriti_token')
  }
}

const questionMap = {
  0: 'body_build',
  1: 'appetite',
  2: 'sleep',
  3: 'skin',
  4: 'personality',
}

const assessmentValueMap = {
  body_build: { Thin: 'Thin', Medium: 'Medium', Heavy: 'Heavy' },
  appetite: { Irregular: 'Irregular', Strong: 'Strong', Slow: 'Slow' },
  sleep: { Light: 'Light', Moderate: 'Moderate', Deep: 'Deep' },
  skin: { Dry: 'Dry', Warm: 'Warm', Oily: 'Oily' },
  personality: { Restless: 'Restless', Competitive: 'Competitive', Calm: 'Calm' },
}

function buildPredictionPayload({ symptoms, assessment, ocrText, ocrFilename }) {
  const mappedAssessment = Object.entries(assessment || {}).reduce((acc, [index, value]) => {
    const key = questionMap[index]
    if (key && assessmentValueMap[key]?.[value]) {
      acc[key] = assessmentValueMap[key][value]
    }
    return acc
  }, {})

  return {
    symptoms: symptoms?.trim() || '',
    assessment: Object.keys(mappedAssessment).length > 0 ? mappedAssessment : null,
    ocr_text: ocrText?.trim() || null,
    ocr_filename: ocrFilename?.trim() || null,
  }
}

async function createPrediction(payload) {
  const token = getStoredToken()
  const response = await fetch(`${API_BASE_URL}/api/v1/predictions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.detail || 'Prediction request failed')
  }

  return response.json()
}

async function listPredictions() {
  const token = getStoredToken()
  const response = await fetch(`${API_BASE_URL}/api/v1/predictions`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.detail || 'Failed to fetch predictions')
  }

  return response.json()
}

async function uploadPrescription(file) {
  const token = getStoredToken()
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/api/v1/uploads/prescription`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.detail || 'Prescription upload failed')
  }

  return response.json()
}

async function getCurrentUser() {
  const token = getStoredToken()
  if (!token) return null
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    if (response.status === 401) {
      clearStoredToken()
      throw new Error('Session expired. Please login again.')
    }
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.detail || 'Failed to fetch user profile')
  }

  return response.json()
}

async function getPredictionHistory() {
  const token = getStoredToken()
  if (!token) {
    // No token means the user is not logged in. Throw so HistoryPage can redirect.
    throw new Error('Session expired. Please login again.')
  }
  const response = await fetch(`${API_BASE_URL}/api/v1/predictions/history`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    if (response.status === 401) {
      clearStoredToken()
      throw new Error('Session expired. Please login again.')
    }
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(extractApiError(errorBody, 'Failed to fetch prediction history'))
  }

  return response.json()
}


/**
 * Extracts a human-readable error message from a FastAPI error response body.
 *
 * FastAPI returns either:
 *   { "detail": "Email already registered" }          ← string
 *   { "detail": [{ "loc": [...], "msg": "..." }] }    ← Pydantic validation array
 *
 * We always resolve to a string so JSX never renders [object Object].
 */
function extractApiError(errorBody, fallback) {
  const detail = errorBody?.detail
  if (!detail) return fallback
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail) && detail.length > 0) {
    // Pydantic v2 format: each item has a "msg" field
    const firstMsg = detail[0]?.msg
    if (typeof firstMsg === 'string') return firstMsg
  }
  return fallback
}

async function loginUser(payload) {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(extractApiError(errorBody, 'Login failed'))
  }

  return response.json()
}

async function registerUser(payload) {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(extractApiError(errorBody, 'Registration failed'))
  }

  return response.json()
}


async function generateReport(payload) {
  const token = getStoredToken()
  const response = await fetch(`${API_BASE_URL}/api/v1/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.detail || 'Report generation failed')
  }

  return response.json()
}

async function downloadReport(downloadUrl) {
  const token = getStoredToken()
  const response = await fetch(`${API_BASE_URL}${downloadUrl}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.detail || 'Report download failed')
  }

  const blob = await response.blob()
  const contentDisposition = response.headers.get('content-disposition') || ''
  const filenameMatch = contentDisposition.match(/filename="?([^";]+)"?/) || []
  const filename = filenameMatch[1] || 'prakriti_report.pdf'
  const objectUrl = window.URL.createObjectURL(blob)
  const link = window.document.createElement('a')
  link.href = objectUrl
  link.download = filename
  link.click()
  window.URL.revokeObjectURL(objectUrl)
}

export { API_BASE_URL, buildPredictionPayload, clearStoredToken, createPrediction, downloadReport, generateReport, loginUser, registerUser, setStoredToken, uploadPrescription, listPredictions, getCurrentUser, getPredictionHistory }
