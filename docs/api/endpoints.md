# API Documentation

## Table of Contents

- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)
- [Endpoints](#endpoints)
  - [Health Check](#health-check)
  - [Start Consultation](#start-consultation)
  - [Collect Patient History](#collect-patient-history)
  - [Generate Differential Diagnosis](#generate-differential-diagnosis)
  - [Generate Additional Options](#generate-additional-options)
  - [Query Session State](#query-session-state)
  - [Finalize Consultation](#finalize-consultation)
- [Data Models](#data-models)
- [Examples](#examples)

---

## Overview

The Elio API is a RESTful service that provides clinical decision support through AI-powered differential diagnosis generation. All endpoints return JSON-formatted responses.

### API Version

**Current Version:** 2.0.0  
**Release Date:** 2025-10-14  
**Protocol:** HTTPS (production), HTTP (development)

---

## Base URL

### Development
```
http://localhost:10000
```

### Production
```
https://elio-backend.onrender.com
```

---

## Authentication

**Current Version:** No authentication required (public demo)

**Planned:** OAuth 2.0 with bearer tokens

```http
Authorization: Bearer {token}
```

---

## Rate Limiting

### Limits

- **Rate:** 100 requests per 15 minutes
- **Scope:** Per IP address
- **Headers:**
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Time when limit resets (Unix timestamp)

### Rate Limit Exceeded Response

**Status Code:** `429 Too Many Requests`

```json
{
  "statusCode": 429,
  "error": "Too Many Requests",
  "message": "Límite excedido. Intenta en 300 segundos."
}
```

---

## Error Handling

### Standard Error Response

All errors follow this structure:

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "statusCode": 400,
  "timestamp": "2025-10-14T14:16:26.000Z"
}
```

### HTTP Status Codes

| Code | Description | Usage |
|------|-------------|-------|
| `200` | OK | Successful request |
| `400` | Bad Request | Invalid request parameters |
| `404` | Not Found | Session or resource not found |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server-side error |
| `503` | Service Unavailable | External service (AI) unavailable |

### Common Error Scenarios

#### Invalid Session ID

```json
{
  "error": "Not Found",
  "message": "Sesión no encontrada",
  "statusCode": 404,
  "timestamp": "2025-10-14T14:16:26.000Z"
}
```

#### Missing Required Fields

```json
{
  "error": "Bad Request",
  "message": "Campo requerido: motivo_consulta",
  "statusCode": 400,
  "timestamp": "2025-10-14T14:16:26.000Z"
}
```

#### AI Service Error

```json
{
  "error": "Service Unavailable",
  "message": "Error al conectar con el servicio de IA",
  "statusCode": 503,
  "timestamp": "2025-10-14T14:16:26.000Z"
}
```

---

## Endpoints

### Health Check

Verify that the API server is running and responsive.

**Endpoint:** `GET /health`

**Authentication:** None required

**Request:**

```bash
curl -X GET http://localhost:10000/health
```

**Response:** `200 OK`

```json
{
  "status": "ok",
  "timestamp": "2025-10-14T14:16:26.000Z",
  "uptime": 3662.5,
  "environment": "development"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Server status (`ok` or `error`) |
| `timestamp` | string | Current server time (ISO 8601) |
| `uptime` | number | Server uptime in seconds |
| `environment` | string | Current environment (`development` or `production`) |

---

### Start Consultation

Initialize a new consultation session and generate AI-powered patient history options.

**Endpoint:** `POST /start`

**Authentication:** None required

**Request Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "motivo_consulta": "Oppressive chest pain for 2 hours with radiation to left arm and dyspnea"
}
```

**Request Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `motivo_consulta` | string | Yes | Chief complaint or reason for consultation |

**Validation Rules:**

- `motivo_consulta` must be a non-empty string
- Minimum length: 10 characters
- Maximum length: 1000 characters

**Response:** `200 OK`

```json
{
  "patientID": "a3f5c8e2-9d1b-4c7e-8f3a-6b2d4e1c9a5f",
  "pasoActual": "consulta",
  "opciones": [
    {
      "label": "Arterial hypertension diagnosed 5 years ago, under treatment with losartan",
      "checked": false
    },
    {
      "label": "Type 2 Diabetes Mellitus diagnosed 3 years ago, controlled with metformin",
      "checked": false
    },
    {
      "label": "Dyslipidemia diagnosed 2 years ago, managed with diet and exercise",
      "checked": false
    },
    {
      "label": "Active smoking (1 pack/day for 10 years)",
      "checked": false
    },
    {
      "label": "Occasional alcohol consumption (social, 2-3 beers/week)",
      "checked": false
    },
    {
      "label": "Previous laparoscopic cholecystectomy (2019)",
      "checked": false
    },
    {
      "label": "Hospitalization for pneumonia in 2021, required oxygen therapy",
      "checked": false
    },
    {
      "label": "Open appendectomy in childhood (approximately 15 years ago)",
      "checked": false
    }
  ]
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `patientID` | string | Unique session identifier (UUID v4) |
| `pasoActual` | string | Current workflow step (`consulta`) |
| `opciones` | array | AI-generated patient history options |
| `opciones[].label` | string | History option description |
| `opciones[].checked` | boolean | Selection status (always `false` initially) |

**Session Lifecycle:**

- Session created with 30-minute timeout
- Session ID must be used in subsequent requests
- Session automatically purged after timeout or completion

**Example Request:**

```bash
curl -X POST http://localhost:10000/start \
  -H "Content-Type: application/json" \
  -d '{
    "motivo_consulta": "Severe headache with photophobia and nausea for 6 hours"
  }'
```

---

### Collect Patient History

Store selected patient history options in the active session.

**Endpoint:** `POST /api/collect`

**Authentication:** None required

**Request Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "id": "a3f5c8e2-9d1b-4c7e-8f3a-6b2d4e1c9a5f",
  "opciones": [
    "Arterial hypertension diagnosed 5 years ago, under treatment with losartan",
    "Type 2 Diabetes Mellitus diagnosed 3 years ago, controlled with metformin",
    "Active smoking (1 pack/day for 10 years)"
  ]
}
```

**Request Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Session ID from `/start` response |
| `opciones` | array | Yes | Selected patient history options |

**Validation Rules:**

- `id` must be a valid UUID
- `opciones` must be an array of strings
- Minimum 0 options (patient can select none)
- Maximum 20 options

**Response:** `200 OK`

```json
{
  "success": true,
  "partialState": {
    "motivo_consulta": "Oppressive chest pain for 2 hours with radiation to left arm and dyspnea",
    "opciones": [
      "Arterial hypertension diagnosed 5 years ago, under treatment with losartan",
      "Type 2 Diabetes Mellitus diagnosed 3 years ago, controlled with metformin",
      "Active smoking (1 pack/day for 10 years)"
    ]
  }
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Operation success status |
| `partialState` | object | Current session state snapshot |
| `partialState.motivo_consulta` | string | Chief complaint |
| `partialState.opciones` | array | Selected history options |

**Example Request:**

```bash
curl -X POST http://localhost:10000/api/collect \
  -H "Content-Type: application/json" \
  -d '{
    "id": "a3f5c8e2-9d1b-4c7e-8f3a-6b2d4e1c9a5f",
    "opciones": [
      "Arterial hypertension",
      "Type 2 Diabetes",
      "Active smoking"
    ]
  }'
```

---

### Generate Differential Diagnosis

Generate AI-powered differential diagnosis with SNOMED CT coding.

**Endpoint:** `POST /api/diagnostico`

**Authentication:** None required

**Request Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "id": "a3f5c8e2-9d1b-4c7e-8f3a-6b2d4e1c9a5f"
}
```

**Request Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Session ID from `/start` response |

**Validation Rules:**

- `id` must be a valid UUID
- Session must exist and be active
- Session must have completed `/api/collect` step

**Response:** `200 OK`

```json
{
  "Estado": "45-year-old male patient presenting with acute oppressive chest pain radiating to left arm, accompanied by dyspnea. Significant cardiovascular risk factors: arterial hypertension, type 2 diabetes mellitus, and active smoking.",
  "Diferenciales": [
    {
      "Patología": "Acute Myocardial Infarction",
      "Probabilidad": "Very High",
      "Justificación": "Oppressive chest pain with radiation to left arm in a patient with multiple cardiovascular risk factors (hypertension, diabetes, smoking). The clinical presentation is highly suggestive of acute coronary syndrome. Requires immediate cardiology evaluation and emergency protocol activation."
    },
    {
      "Patología": "Unstable Angina",
      "Probabilidad": "High",
      "Justificación": "Chest pain characteristics and risk factor profile are consistent with unstable angina. Differentiation from acute myocardial infarction requires cardiac biomarkers and ECG analysis."
    },
    {
      "Patología": "Pulmonary Embolism",
      "Probabilidad": "Medium",
      "Justificación": "Dyspnea and chest pain could indicate pulmonary embolism. Consider in differential, especially if risk factors for thromboembolism are present."
    },
    {
      "Patología": "Aortic Dissection",
      "Probabilidad": "Low",
      "Justificación": "Hypertension is a risk factor for aortic dissection. Consider if pain has tearing quality or radiates to back. Requires imaging for definitive diagnosis."
    }
  ],
  "Análisis": "The clinical presentation strongly suggests acute coronary syndrome in a high-risk patient. The combination of oppressive chest pain with left arm radiation, dyspnea, and multiple cardiovascular risk factors (hypertension, diabetes, smoking) creates a very high probability of acute myocardial infarction. Immediate intervention is critical. The patient requires emergency cardiology consultation, ECG, cardiac biomarkers (troponin, CK-MB), and consideration for urgent cardiac catheterization. Time-to-treatment is crucial for myocardial salvage.",
  "Próxima_Acción": "IMMEDIATE ACTIONS REQUIRED:\n1. Activate emergency cardiac protocol\n2. Obtain 12-lead ECG immediately\n3. Draw cardiac biomarkers (troponin I/T, CK-MB, myoglobin)\n4. Establish IV access and administer:\n   - Aspirin 300mg chewed\n   - Nitroglycerin sublingual (if BP permits)\n   - Oxygen therapy if SpO2 < 94%\n5. Urgent cardiology consultation\n6. Consider antiplatelet therapy (clopidogrel/ticagrelor)\n7. Prepare for possible cardiac catheterization\n8. Continuous cardiac monitoring\n9. Chest X-ray to rule out other pathologies\n10. Monitor vital signs every 5 minutes",
  "Codificación_Estandarizada": "SNOMED CT International Edition",
  "Patologías_Codificadas": [
    {
      "Patología": "Acute Myocardial Infarction",
      "SNOMED_ConceptID": "57054005",
      "SNOMED_Term": "Acute myocardial infarction",
      "Tipo_Entidad": "Clinical Finding"
    },
    {
      "Patología": "Unstable Angina",
      "SNOMED_ConceptID": "25106000",
      "SNOMED_Term": "Unstable angina",
      "Tipo_Entidad": "Clinical Finding"
    },
    {
      "Patología": "Pulmonary Embolism",
      "SNOMED_ConceptID": "59282003",
      "SNOMED_Term": "Pulmonary embolism",
      "Tipo_Entidad": "Clinical Finding"
    },
    {
      "Patología": "Aortic Dissection",
      "SNOMED_ConceptID": "53741008",
      "SNOMED_Term": "Dissection of aorta",
      "Tipo_Entidad": "Clinical Finding"
    }
  ]
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `Estado` | string | Clinical case summary |
| `Diferenciales` | array | Differential diagnoses (3-5 items) |
| `Diferenciales[].Patología` | string | Pathology name |
| `Diferenciales[].Probabilidad` | string | Probability level (`Very High`, `High`, `Medium`, `Low`) |
| `Diferenciales[].Justificación` | string | Clinical reasoning |
| `Análisis` | string | Comprehensive clinical analysis |
| `Próxima_Acción` | string | Recommended next steps |
| `Codificación_Estandarizada` | string | Coding standard used |
| `Patologías_Codificadas` | array | SNOMED CT coded pathologies |
| `Patologías_Codificadas[].Patología` | string | Pathology name |
| `Patologías_Codificadas[].SNOMED_ConceptID` | string | SNOMED CT Concept ID |
| `Patologías_Codificadas[].SNOMED_Term` | string | Official SNOMED CT term |
| `Patologías_Codificadas[].Tipo_Entidad` | string | Entity type |

**Processing Time:**

- Average: 1500-3000ms
- Depends on AI service response time
- Timeout: 30 seconds

**Example Request:**

```bash
curl -X POST http://localhost:10000/api/diagnostico \
  -H "Content-Type: application/json" \
  -d '{
    "id": "a3f5c8e2-9d1b-4c7e-8f3a-6b2d4e1c9a5f"
  }'
```

---

### Generate Additional Options

Generate more AI-powered patient history options for the current session.

**Endpoint:** `GET /generator/:id`

**Authentication:** None required

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Session ID from `/start` response |

**Response:** `200 OK`

```json
{
  "opciones": [
    "History of inflammatory bowel disease",
    "Known medication allergies (penicillin, sulfonamides)",
    "Chronic NSAID use for osteoarthritis",
    "Previous history of renal colic",
    "Recent travel to endemic area (last 3 months)"
  ]
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `opciones` | array | Additional history options (typically 5 items) |

**Use Case:**

This endpoint is useful when the initial set of options does not include the relevant patient history. The AI generates contextually appropriate additional options based on the chief complaint.

**Example Request:**

```bash
curl -X GET http://localhost:10000/generator/a3f5c8e2-9d1b-4c7e-8f3a-6b2d4e1c9a5f
```

---

### Query Session State

Retrieve the current state of an active consultation session.

**Endpoint:** `GET /consulta/:id`

**Authentication:** None required

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Session ID from `/start` response |

**Response:** `200 OK`

```json
{
  "partialState": {
    "motivo_consulta": "Oppressive chest pain for 2 hours with radiation to left arm and dyspnea",
    "opciones": [
      "Arterial hypertension diagnosed 5 years ago",
      "Type 2 Diabetes Mellitus",
      "Active smoking"
    ],
    "diagnostico": {
      "Estado": "45-year-old male patient...",
      "Diferenciales": [...],
      "Análisis": "...",
      "Próxima_Acción": "...",
      "Patologías_Codificadas": [...]
    },
    "resumen_clinico": "CLINICAL CONSULTATION SUMMARY\n\n..."
  }
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `partialState` | object | Complete session state |
| `partialState.motivo_consulta` | string | Chief complaint |
| `partialState.opciones` | array | Selected patient history |
| `partialState.diagnostico` | object | Differential diagnosis (if generated) |
| `partialState.resumen_clinico` | string | Clinical summary (if finalized) |

**Use Cases:**

- Resume an interrupted consultation
- Verify session data before proceeding
- Debugging and development

**Example Request:**

```bash
curl -X GET http://localhost:10000/consulta/a3f5c8e2-9d1b-4c7e-8f3a-6b2d4e1c9a5f
```

---

### Finalize Consultation

Generate comprehensive clinical summary and close the consultation session.

**Endpoint:** `POST /api/end`

**Authentication:** None required

**Request Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "id": "a3f5c8e2-9d1b-4c7e-8f3a-6b2d4e1c9a5f"
}
```

**Request Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Session ID from `/start` response |

**Validation Rules:**

- `id` must be a valid UUID
- Session must exist
- Session must have completed `/api/diagnostico` step

**Response:** `200 OK`

```json
{
  "resumen": "CLINICAL CONSULTATION SUMMARY\n\nDate: 2025-10-14\nPatient ID: a3f5c8e2-9d1b-4c7e-8f3a-6b2d4e1c9a5f\n\nCHIEF COMPLAINT:\nOppressive chest pain for 2 hours with radiation to left arm and dyspnea\n\nRELEVANT PATIENT HISTORY:\n- Arterial hypertension diagnosed 5 years ago, under treatment with losartan\n- Type 2 Diabetes Mellitus diagnosed 3 years ago, controlled with metformin\n- Active smoking (1 pack/day for 10 years)\n\nDIFFERENTIAL DIAGNOSES:\n\n1. Acute Myocardial Infarction (Probability: Very High)\n   SNOMED CT: 57054005 - Acute myocardial infarction\n   Clinical Reasoning: Oppressive chest pain with left arm radiation in patient with multiple cardiovascular risk factors. Requires immediate cardiology evaluation and emergency protocol activation.\n\n2. Unstable Angina (Probability: High)\n   SNOMED CT: 25106000 - Unstable angina\n   Clinical Reasoning: Chest pain characteristics and risk factor profile consistent with unstable angina. Differentiation requires cardiac biomarkers and ECG.\n\n3. Pulmonary Embolism (Probability: Medium)\n   SNOMED CT: 59282003 - Pulmonary embolism\n   Clinical Reasoning: Dyspnea and chest pain could indicate pulmonary embolism.\n\n4. Aortic Dissection (Probability: Low)\n   SNOMED CT: 53741008 - Dissection of aorta\n   Clinical Reasoning: Hypertension is risk factor. Consider if pain has tearing quality.\n\nCLINICAL ANALYSIS:\nThe clinical presentation strongly suggests acute coronary syndrome in a high-risk patient. Immediate intervention is critical. Time-to-treatment is crucial for myocardial salvage.\n\nRECOMMENDED ACTIONS:\n1. Activate emergency cardiac protocol\n2. Obtain 12-lead ECG immediately\n3. Draw cardiac biomarkers (troponin, CK-MB)\n4. Establish IV access and administer aspirin 300mg\n5. Urgent cardiology consultation\n6. Prepare for possible cardiac catheterization\n7. Continuous cardiac monitoring\n\n---\nDocument generated by Elio AI Medical Assistant\nClinical decision support system - Does not replace professional medical judgment",
  "partialState": {
    "motivo_consulta": "Oppressive chest pain for 2 hours with radiation to left arm and dyspnea",
    "opciones": [...],
    "diagnostico": {...},
    "resumen_clinico": "CLINICAL CONSULTATION SUMMARY..."
  },
  "sessionClosed": true
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `resumen` | string | Formatted clinical summary (plain text) |
| `partialState` | object | Final session state |
| `sessionClosed` | boolean | Session closure status |

**Session Behavior:**

- Session marked as closed
- Session will be purged in next cleanup cycle
- Session cannot be modified after finalization
- Summary includes all consultation data

**Example Request:**

```bash
curl -X POST http://localhost:10000/api/end \
  -H "Content-Type: application/json" \
  -d '{
    "id": "a3f5c8e2-9d1b-4c7e-8f3a-6b2d4e1c9a5f"
  }'
```

---

## Data Models

### PatientSession

```typescript
interface PatientSession {
  id: string;                          // UUID v4
  motivo_consulta: string;             // Chief complaint
  opciones: string[];                  // Selected patient history
  diagnostico?: DiagnosticoResponse;   // Differential diagnosis
  resumen_clinico?: string;            // Clinical summary
  timestamp: Date;                     // Session creation time
}
```

### DiagnosticoResponse

```typescript
interface DiagnosticoResponse {
  Estado: string;                              // Clinical case summary
  Diferenciales: Diferencial[];                // 3-5 differential diagnoses
  Análisis: string;                            // Clinical analysis
  Próxima_Acción: string;                      // Recommended next steps
  Codificación_Estandarizada: string;          // "SNOMED CT International Edition"
  Patologías_Codificadas: PatologiaCodificada[]; // SNOMED CT codes
}
```

### Diferencial

```typescript
interface Diferencial {
  Patología: string;                   // Pathology name
  Probabilidad: "Very High" | "High" | "Medium" | "Low";
  Justificación: string;               // Clinical reasoning
}
```

### PatologiaCodificada

```typescript
interface PatologiaCodificada {
  Patología: string;           // Pathology name
  SNOMED_ConceptID: string;    // SNOMED CT Concept ID
  SNOMED_Term: string;         // Official SNOMED CT term (English)
  Tipo_Entidad: string;        // Entity type (e.g., "Clinical Finding")
}
```

---

## Examples

### Complete Consultation Flow

```bash
# 1. Start consultation
PATIENT_ID=$(curl -s -X POST http://localhost:10000/start \
  -H "Content-Type: application/json" \
  -d '{"motivo_consulta": "Severe abdominal pain in right lower quadrant"}' \
  | jq -r '.patientID')

echo "Patient ID: $PATIENT_ID"

# 2. Collect patient history
curl -s -X POST http://localhost:10000/api/collect \
  -H "Content-Type: application/json" \
  -d "{
    \"id\": \"$PATIENT_ID\",
    \"opciones\": [
      \"Previous appendectomy\",
      \"History of kidney stones\"
    ]
  }" | jq '.'

# 3. Generate differential diagnosis
curl -s -X POST http://localhost:10000/api/diagnostico \
  -H "Content-Type: application/json" \
  -d "{\"id\": \"$PATIENT_ID\"}" | jq '.'

# 4. Finalize consultation
curl -s -X POST http://localhost:10000/api/end \
  -H "Content-Type: application/json" \
  -d "{\"id\": \"$PATIENT_ID\"}" | jq -r '.resumen'
```

### Generate Additional Options

```bash
# Get more history options mid-consultation
curl -s http://localhost:10000/generator/$PATIENT_ID | jq '.opciones[]'
```

### Query Session State

```bash
# Check current session state
curl -s http://localhost:10000/consulta/$PATIENT_ID | jq '.partialState'
```

---

## Postman Collection

A complete Postman collection is available at:

**Location:** [docs/api/postman-collection.json](postman-collection.json)

**Import Instructions:**

1. Open Postman
2. Click Import
3. Select the JSON file
4. Collection will include all endpoints with example requests

---

## Interactive Documentation

**Swagger UI:** Available at `/docs` when server is running

Access interactive API documentation:

```
http://localhost:10000/docs
```

Features:
- Try API endpoints directly
- View request/response schemas
- Download OpenAPI specification
- Example requests and responses

---
