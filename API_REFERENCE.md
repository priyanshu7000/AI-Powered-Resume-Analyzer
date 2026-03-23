# 📚 API Reference

## Authentication Endpoints

### Register User
**POST** `/api/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### Login User
**POST** `/api/auth/login`

Authenticate and get tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Cookies Set:**
- `refreshToken`: httpOnly, secure, sameSite=strict

---

### Refresh Token
**POST** `/api/auth/refresh`

Get a new access token using the refresh token.

**Request:** (requires refreshToken in cookies)

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### Logout
**POST** `/api/auth/logout`

Logout and invalidate tokens.

**Security:** Requires valid JWT token

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Get Current User
**GET** `/api/auth/me`

Get authenticated user details.

**Security:** Requires valid JWT token

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

## Resume Endpoints

### Upload Resume
**POST** `/api/resume/upload`

Upload a PDF resume.

**Security:** Requires valid JWT token

**Request:** 
- Content-Type: multipart/form-data
- File field: `file` (PDF only, max 5MB)

**Response (201):**
```json
{
  "success": true,
  "message": "Resume uploaded successfully",
  "resume": {
    "_id": "resume_id",
    "userId": "user_id",
    "fileName": "resume.pdf",
    "resumeText": "extracted text...",
    "analyzed": false,
    "createdAt": "2024-03-20T10:30:00Z"
  }
}
```

---

### Get All Resumes
**GET** `/api/resume`

Get all resumes for the authenticated user.

**Security:** Requires valid JWT token

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "resumes": [
    {
      "_id": "resume_id",
      "fileName": "resume.pdf",
      "atsScore": 75,
      "analyzed": true,
      "createdAt": "2024-03-20T10:30:00Z"
    }
  ]
}
```

---

### Get Specific Resume
**GET** `/api/resume/:resumeId`

Get details of a specific resume.

**Security:** Requires valid JWT token

**Parameters:**
- `resumeId` (path): Resume ID

**Response (200):**
```json
{
  "success": true,
  "resume": {
    "_id": "resume_id",
    "fileName": "resume.pdf",
    "resumeText": "full text",
    "extractedSkills": ["JavaScript", "React"],
    "missingSkills": ["Python"],
    "atsScore": 75,
    "suggestions": ["Add more keywords"],
    "analyzed": true,
    "createdAt": "2024-03-20T10:30:00Z"
  }
}
```

---

### Analyze Resume
**POST** `/api/resume/analyze/:resumeId`

Analyze uploaded resume with AI.

**Security:** Requires valid JWT token

**Parameters:**
- `resumeId` (path): Resume ID

**Response (200):**
```json
{
  "success": true,
  "message": "Resume analyzed successfully",
  "resume": {
    "_id": "resume_id",
    "fileName": "resume.pdf",
    "extractedSkills": ["JavaScript", "React", "Node.js"],
    "missingSkills": ["Python", "AWS"],
    "atsScore": 82,
    "suggestions": [
      "Add more technical keywords",
      "Include metrics in achievements"
    ],
    "analyzed": true
  }
}
```

---

### Delete Resume
**DELETE** `/api/resume/:resumeId`

Delete a resume.

**Security:** Requires valid JWT token

**Parameters:**
- `resumeId` (path): Resume ID

**Response (200):**
```json
{
  "success": true,
  "message": "Resume deleted successfully"
}
```

---

## Job Matching Endpoints

### Match Job
**POST** `/api/ai/match`

Compare resume with job description.

**Security:** Requires valid JWT token

**Request Body:**
```json
{
  "resumeId": "resume_id",
  "jobTitle": "Senior Software Engineer",
  "jobDescription": "We are looking for a senior engineer with..."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Job match created successfully",
  "jobMatch": {
    "_id": "match_id",
    "jobTitle": "Senior Software Engineer",
    "matchScore": 78,
    "missingKeywords": ["Kubernetes", "Docker"],
    "suggestions": [
      "Your React skills match perfectly",
      "Consider learning containerization"
    ],
    "createdAt": "2024-03-20T10:30:00Z"
  }
}
```

---

### Get All Job Matches
**GET** `/api/ai/matches`

Get all job matches for the user.

**Security:** Requires valid JWT token

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "matches": [
    {
      "_id": "match_id",
      "jobTitle": "Senior Software Engineer",
      "matchScore": 78,
      "createdAt": "2024-03-20T10:30:00Z",
      "resumeId": {
        "fileName": "resume.pdf",
        "atsScore": 75
      }
    }
  ]
}
```

---

### Get Specific Match
**GET** `/api/ai/matches/:jobMatchId`

Get details of a job match.

**Security:** Requires valid JWT token

**Parameters:**
- `jobMatchId` (path): Job Match ID

**Response (200):**
```json
{
  "success": true,
  "match": {
    "_id": "match_id",
    "jobTitle": "Senior Software Engineer",
    "jobDescription": "Full job description...",
    "matchScore": 78,
    "missingKeywords": ["Kubernetes", "Docker", "Terraform"],
    "suggestions": [
      "Your React and Node.js skills align well",
      "Consider adding cloud infrastructure skills",
      "Your 5+ years experience matches requirement"
    ],
    "createdAt": "2024-03-20T10:30:00Z",
    "resumeId": {
      "_id": "resume_id",
      "fileName": "resume.pdf",
      "atsScore": 75,
      "extractedSkills": ["JavaScript", "React", "Node.js"]
    }
  }
}
```

---

### Delete Job Match
**DELETE** `/api/ai/matches/:jobMatchId`

Delete a job match.

**Security:** Requires valid JWT token

**Parameters:**
- `jobMatchId` (path): Job Match ID

**Response (200):**
```json
{
  "success": true,
  "message": "Job match deleted successfully"
}
```

---

## Error Responses

### 400 - Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 - Server Error
```json
{
  "success": false,
  "message": "Server error message"
}
```

---

## Authentication Headers

All protected endpoints require:

```
Authorization: Bearer <accessToken>
```

Or the `refreshToken` cookie must be present.

---

## Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per window
- **Response**: 429 Too Many Requests if exceeded

---

## Content Types

- **Request**: `application/json` or `multipart/form-data`
- **Response**: `application/json`

---

## CORS Configuration

- **Allowed Origins**: Frontend URL (configurable)
- **Allowed Methods**: GET, POST, PUT, DELETE
- **Allowed Headers**: Content-Type, Authorization
- **Credentials**: Allowed

---

## Pagination (Optional)

Some endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response includes:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Upload Resume
```bash
curl -X POST http://localhost:5000/api/resume/upload \
  -H "Authorization: Bearer <accessToken>" \
  -F "file=@resume.pdf"
```

### Get Resumes
```bash
curl -X GET http://localhost:5000/api/resume \
  -H "Authorization: Bearer <accessToken>"
```

---

For interactive API testing, visit `/api-docs` after starting the server.
