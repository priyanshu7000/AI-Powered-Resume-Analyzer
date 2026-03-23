# Architecture Overview

This document explains the high-level architecture of the AI Resume Analyzer & Job Matcher application.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    User Interface                        │   │
│  │  (Pages, Components, Forms)                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Redux Store (State Management)             │   │
│  │  (Auth, Resume, Job Matching, UI Slices)               │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │             API Service Layer (Axios)                   │   │
│  │  (Interceptors, API calls)                             │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓ (HTTPS)
┌─────────────────────────────────────────────────────────────────┐
│                    API Server (Express.js)                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Routes                               │   │
│  │  (/auth, /resume, /ai)                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   Controllers                           │   │
│  │  (Request handlers, response formatting)               │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Services                             │   │
│  │  (Business logic for Auth, Resume, Job Matching)       │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Middleware (Auth, Validation)             │   │
│  │  (JWT protection, Input validation, Error handling)    │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Utilities                            │   │
│  │  (JWT, PDF Parsing, AI Analysis)                       │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
           ↓                           ↓
    ┌──────────────┐           ┌──────────────────┐
    │   MongoDB    │           │   OpenAI API     │
    │   Database   │           │   (GPT-3.5)      │
    └──────────────┘           └──────────────────┘
```

## Data Flow

### User Registration/Login
```
User Input → React Form
         ↓
Redux authSlice (dispatch register/login)
         ↓
API Service → POST /api/auth/register|login
         ↓
Auth Controller
         ↓
Auth Service (validation, hashing, token generation)
         ↓
MongoDB (Store user)
         ↓
Return tokens to frontend
         ↓
Redux stores tokens & user data
         ↓
Update state → Re-render UI
```

### Resume Upload & Analysis
```
User Selects PDF → React Component
         ↓
Redux resumeSlice (dispatch uploadResume)
         ↓
API Service → POST /api/resume/upload (multipart)
         ↓
Resume Controller
         ↓
File Upload Middleware (validation)
         ↓
Resume Service
         ├─ PDF Parser (extract text)
         ├─ Store to MongoDB
         └─ Return resume object
         ↓
Frontend updates Redux with resume
         ↓
User clicks "Analyze"
         ↓
Redux (dispatch analyzeResume)
         ↓
API Service → POST /api/resume/analyze/:resumeId
         ↓
Resume Service → AI Analysis Util
         ↓
OpenAI API (structured JSON prompt)
         ↓
Parse & validate response
         ↓
Update MongoDB with analysis results
         ↓
Return to frontend → Update Redux
         ↓
Display results in UI
```

### Job Matching
```
User Enters Job Details → React Form
         ↓
Redux jobSlice (dispatch matchJob)
         ↓
API Service → POST /api/ai/match
         ↓
Job Match Controller
         ↓
Job Match Service
         ├─ Fetch resume text
         ├─ Call AI Analysis Util
         └─ Generate match score
         ↓
OpenAI API (resume vs job description)
         ↓
Parse response (matchScore, missingKeywords, suggestions)
         ↓
Store to MongoDB
         ↓
Return match result
         ↓
Redux updates matches state
         ↓
Display results in UI
```

## Component Architecture

### Frontend Layers

1. **Page Components** (`/pages`)
   - Full-page views (Login, Dashboard, Upload, etc.)
   - Handle page-level logic
   - Route-specific components

2. **Reusable Components** (`/components`)
   - UI building blocks (Button, Input, Card, etc.)
   - Stateless or minimal state
   - Theme-aware (dark/light mode)

3. **Redux Store** (`/app`, `/features`)
   - Centralized state management
   - Async thunks for API calls
   - Slices for different domains

4. **Services** (`/services`)
   - API client (Axios with interceptors)
   - Token refresh logic
   - Request/response handling

5. **Hooks** (`/hooks`)
   - Custom React hooks (useAuth, useToast)
   - Reusable logic

6. **Utils** (`/utils`)
   - Helper functions
   - Validation utilities
   - Formatting functions

## Backend Layers

1. **Routes** (`/routes`)
   - API endpoint definitions
   - Route protection with middleware
   - Request method handling

2. **Controllers** (`/controllers`)
   - Request parsing
   - Response formatting
   - Delegate business logic to services

3. **Services** (`/services`)
   - Core business logic
   - Data processing
   - Orchestrate operations

4. **Models** (`/models`)
   - MongoDB schemas
   - Data validation
   - Relationships

5. **Middleware** (`/middleware`)
   - Authentication (JWT)
   - Input validation (Joi)
   - Error handling
   - File upload handling

6. **Utils** (`/utils`)
   - JWT token generation/verification
   - PDF text extraction
   - AI API integration
   - Formatting functions

## Authentication Flow

```
Login Credentials
         ↓
Auth Service validates
         ↓
Generate JWT Tokens:
├─ Access Token (15 min expiry - in localStorage)
└─ Refresh Token (7 days - in httpOnly cookie)
         ↓
Return to frontend
         ↓
Frontend stores accessToken in localStorage
         ↓
API Interceptor adds token to all requests:
   Authorization: Bearer <token>
         ↓
Backend verifies token
├─ Valid → Process request
└─ Expired → Try refresh token
         ↓
Refresh Token:
├─ Valid → Issue new access token
└─ Expired → Redirect to login
```

## Security Architecture

```
┌─ HTTPS (in production)
├─ CORS (restricted to frontend origin)
├─ Helmet.js (security headers)
├─ Rate Limiting (prevent brute force)
├─ JWT Authentication
│  ├─ Access Token (short-lived)
│  └─ Refresh Token (httpOnly cookie)
├─ Input Validation (Joi)
├─ Password Hashing (bcryptjs)
├─ Error Handling (no info leakage)
└─ MongoDB connection (secure)
```

## Deployment Architecture

```
┌──────────────────────────────────────────┐
│          Internet / Users                 │
└──────────────┬───────────────────────────┘
               │
        ┌──────┴──────┐
        ↓             ↓
    ┌────────┐    ┌─────────┐
    │ Vercel │    │ Render  │
    │(Frontend)│  │(Backend)│
    └────┬───┘    └────┬────┘
         │             │
    React App      Express Server
    (SPA)          + Node.js
         │             │
         └──────┬──────┘
                ↓
         ┌─────────────┐
         │   MongoDB   │
         │   Atlas     │
         └─────────────┘
                │
         ┌──────┴──────┐
         ↓             ↓
    OpenAI API    PDF Parsing
```

## State Management

### Redux Store Structure
```
store
├─ auth (authSlice)
│  ├─ user
│  ├─ isAuthenticated
│  ├─ loading
│  └─ error
├─ resume (resumeSlice)
│  ├─ resumes []
│  ├─ currentResume
│  ├─ loading
│  └─ error
├─ job (jobSlice)
│  ├─ matches []
│  ├─ currentMatch
│  ├─ loading
│  └─ error
└─ ui (uiSlice)
   ├─ theme (light/dark)
   ├─ toastMessage
   └─ isLoading
```

## API Contract

All APIs follow RESTful principles with consistent response format:

```javascript
// Success Response
{
  success: true,
  message: "Operation completed",
  data: { /* actual data */ }
}

// Error Response
{
  success: false,
  message: "Error description",
  error: "error details"
}
```

## Performance Considerations

1. **Frontend**
   - Code splitting with Vite
   - Lazy loading routes
   - Memoization with useMemo/useCallback
   - Virtual scrolling for large lists

2. **Backend**
   - Database indexing on frequently queried fields
   - API response caching
   - Pagination for list endpoints
   - Rate limiting for protection

3. **Database**
   - Compound indexes for common queries
   - Data normalization
   - Regular backups

## Scalability

1. **Horizontal Scaling**
   - Stateless backend (can run multiple instances)
   - Use load balancer
   - Separate database server

2. **Vertical Scaling**
   - Upgrade server resources
   - Optimize queries
   - Implement caching

3. **Database Scaling**
   - Sharding for large datasets
   - Read replicas
   - Connection pooling

---

This architecture ensures a clean separation of concerns, easy maintenance, and scalability.
