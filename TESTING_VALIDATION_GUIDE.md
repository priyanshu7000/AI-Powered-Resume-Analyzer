# Testing & Validation Guide

## Quick Start Testing (5 minutes)

### Step 1: Start the Server
```bash
cd "c:\Priyanshu Sharma\resume analyser\server"
npm run dev
```

**Success indicators:**
- ✅ No errors in console
- ✅ Server listening on port 5000
- ✅ Can see "Database connected" message

---

### Step 2: Prepare Test Resumes

Create 3 test resumes to verify realistic scoring:

#### **Test Resume 1: POOR Quality** (`poor-resume.txt`)
```
John Doe
john@email.com

Worked on projects. Used JavaScript. Done many things.
Experience
2020-2023: Did jobs
2019-2020: More jobs

Education
High School
```
**Expected ATS Score:** 25-40 (missing structure, no details, poor formatting)

#### **Test Resume 2: AVERAGE Quality** (`average-resume.txt`)
```
Jane Smith
(555) 123-4567 | jane@email.com | linkedin.com/in/jane

PROFESSIONAL SUMMARY
Experienced developer with 5 years in web development

EXPERIENCE
Senior Developer | Tech Company | 2020-Present
- Developed React applications for 3+ clients
- Improved performance by 40%
- Led team of 2 junior developers

SKILLS
Technical: JavaScript, React, Node.js, MongoDB
Soft Skills: Leadership, Communication
Tools: Git, VS Code, Jira
```
**Expected ATS Score:** 60-75 (complete sections, good keywords, clear structure)

#### **Test Resume 3: EXCELLENT Quality** (`excellent-resume.txt`)
```
Alex Johnson
Email: alex@email.com | Phone: (555) 987-6543
LinkedIn: linkedin.com/in/alexjohnson | GitHub: github.com/alexjohnson

PROFESSIONAL SUMMARY
Full-stack developer with 8 years of experience in building scalable web applications. 
Expertise in React, Node.js, AWS, and DevOps practices. Led cross-functional teams to deliver 
mission-critical applications serving 2M+ users daily.

TECHNICAL SKILLS
- Languages: JavaScript (Expert), Python (Advanced), TypeScript (Advanced)
- Frontend: React, Vue.js, Redux, HTML5, CSS3
- Backend: Node.js, Express, Django, FastAPI
- Databases: MongoDB, PostgreSQL, Redis
- Cloud & DevOps: AWS (EC2, S3, Lambda), Docker, Kubernetes, CI/CD
- Tools: Git, GitHub, Docker, Jenkins, Jira, VS Code

PROFESSIONAL EXPERIENCE
Senior Full-Stack Developer | Tech Unicorn | 2022-Present
- Architected microservices infrastructure using Kubernetes, reducing deployment time by 60%
- Led team of 5 engineers in building real-time analytics platform (2M queries/day)
- Implemented comprehensive CI/CD pipelines with Jenkins, improving deployment frequency 5x
- Mentored 3 junior developers; 2 promoted to mid-level roles
- Technologies: React, Node.js, PostgreSQL, AWS, Docker, Kubernetes

Full-Stack Developer | StartUp Corp | 2019-2022
- Built complete e-commerce platform from scratch using React and Node.js (50K monthly users)
- Optimized database queries reducing API latency by 45%
- Implemented real-time notification system using WebSockets
- Technologies: React, Node.js, MongoDB, Redis, AWS

EDUCATION
Bachelor of Science in Computer Science
University Name | 2016

CERTIFICATIONS
- AWS Solutions Architect Associate (2023)
- Kubernetes Certified Associate (2022)
```
**Expected ATS Score:** 82-92 (complete, detailed, strong keywords, excellent structure)

---

### Step 3: Upload & Analyze Resumes

#### Using Postman:

1. **Create Multipart Request:**
   - Method: POST
   - URL: `http://localhost:5000/api/resumes/create`
   - Headers: Set Authorization token if needed
   - Body → form-data:
     - Key: `file` (type: file)
     - Value: Select one test resume (convert to PDF if needed)

2. **Analyze Resume:**
   - Method: POST
   - URL: `http://localhost:5000/api/resumes/analyze/[resumeId]`
   - Headers: Set Authorization token
   - Response will contain:
     ```json
     {
       "atsScore": 28,
       "atsBreakdown": {...},
       "extractedSkills": [...],
       "missingSkills": [...],
       "categorizedSuggestions": {...}
     }
     ```

---

### Step 4: Verify Scores Match Expectations

| Resume | Expected Score | Actual Score | Status |
|--------|-----------------|--------------|--------|
| Poor | 25-40 | ____ | ✓ or ❌ |
| Average | 60-75 | ____ | ✓ or ❌ |
| Excellent | 82-92 | ____ | ✓ or ❌ |

**Validation Rules:**
- ✅ PASS if actual score within expected range
- ✅ PASS if poor resume doesn't score >50
- ✅ PASS if good resume doesn't score <70
- ✅ PASS if excellent resume is highest of three
- ❌ FAIL if scores don't make relative sense

---

## Deep Testing (20 minutes)

### Test 1: Verify AI-Only (No Local Fallback)

**What to Check:**
1. Groq API is being used and giving real scores
2. Gemini fallback works if Groq fails
3. No local approximation is happening

**How to Test:**

**Scenario A: Groq Primary**
```bash
# .env should have:
GROQ_API_KEY=your-key
GEMINI_API_KEY=your-key  # Optional

# Upload resume
# Check console - should see:
# "[AI Analysis] Using Groq API for: Resume Analysis"
```

**Scenario B: Gemini Fallback**
```bash
# .env should have:
# GROQ_API_KEY=invalid      # Comment out or make invalid
GEMINI_API_KEY=your-key

# Upload resume
# Check console - should see:
# "[Groq Error - Falling back to Gemini]"
# "[AI Analysis] Using Gemini API for: Resume Analysis"
```

**Scenario C: Error When Both Missing**
```bash
# .env should have:
# GROQ_API_KEY=xxx         # Commented out
# GEMINI_API_KEY=xxx       # Commented out

# Upload resume
# Should get error:
# "No AI APIs configured: Please set GROQ_API_KEY or GEMINI_API_KEY"
```

---

### Test 2: Verify Realistic Scoring

**Test Case A: Resume with Missing Contact Info**
```
Skills and Experience section...
(No email, phone, name, address)

This should score 20-35, NOT 70+
✅ PASS: Score is 20-35
❌ FAIL: Score is >50
```

**Test Case B: Resume with Only One Section**
```
EXPERIENCE
Worked at Company

(No summary, no skills, no education)

This should score 30-50, NOT 80+
✅ PASS: Score is 30-50
❌ FAIL: Score is >60
```

**Test Case C: Well-Formatted with Keywords**
```
[Complete resume with all sections]
[Strong technical keywords]
[Clear structure]
[Quantifiable achievements]

This should score 75-90
✅ PASS: Score is 75-90
❌ FAIL: Score is <70 or >95
```

---

### Test 3: Verify Skill Extraction

**What to Check:**
1. All mentioned skills are extracted
2. Skills categorized correctly (technical/soft/tools)
3. No fake/added skills

**Test Resume Snippet:**
```
SKILLS
- JavaScript (5 years)
- React (Expert)
- Node.js (Advanced)
- Python (Intermediate)
- Problem Solving
- Team Leadership
- Git, GitHub, Docker
```

**Expected Extracted Skills:**
```json
{
  "skills": [
    "JavaScript", "React", "Node.js", "Python",
    "Problem Solving", "Team Leadership",
    "Git", "GitHub", "Docker"
  ],
  "skillCategories": {
    "technical": ["JavaScript", "React", "Node.js", "Python"],
    "softSkills": ["Problem Solving", "Team Leadership"],
    "tools": ["Git", "GitHub", "Docker"]
  },
  "skillProficiency": [
    {
      "skill": "React",
      "category": "technical",
      "proficiencyLevel": "Expert",
      "yearsOfExperience": null
    },
    {
      "skill": "JavaScript",
      "category": "technical",
      "proficiencyLevel": "Intermediate",
      "yearsOfExperience": 5
    }
  ]
}
```

**Validation:**
- ✅ All skills mentioned are extracted
- ✅ No extra/hallucinated skills added
- ✅ Categories make sense
- ✅ Proficiency levels reasonable
- ❌ If skills are missing or wrong

---

### Test 4: Verify Suggestions Are Actionable

**Check Criteria:**
1. High-impact suggestions are ACTUALLY high-impact
2. Suggestions are specific (not generic)
3. Suggestions match resume issues

**Example High-Impact Suggestion (GOOD):**
```json
{
  "title": "Add Professional Summary",
  "description": "You're missing a professional summary. Add 2-3 sentences highlighting key skills and years of experience. This alone can add 8-10 points to your ATS score.",
  "category": "structure"
}
```

**Example Bad Suggestion (NOT GOOD):**
```json
{
  "title": "Use Action Verbs",
  "description": "Use action verbs in your experience",
  "category": "content"
  // ❌ Generic, no specific examples
  // ❌ Doesn't explain HOW to improve
}
```

**Validation Checklist:**
- ✅ Suggestions reference actual resume gaps
- ✅ Each suggestion explains HOW to fix (not just WHAT)
- ✅ Impact level matches severity
- ✅ No duplicate suggestions
- ✅ Suggestions would actually improve score

---

### Test 5: Verify Job Matching with New Field

**Setup:**
```
Resume: "5 years JavaScript, React, Node.js, MongoDB"
Job Description: Wants "JavaScript, React, Node.js, MongoDB, Docker, Kubernetes, AWS"
```

**Expected Response:**
```json
{
  "matchScore": 58,  // ≈65% match (4 of 6 requirements)
  "presentKeywords": [
    "JavaScript",
    "React", 
    "Node.js",
    "MongoDB"
  ],
  "missingKeywords": [
    "Docker",
    "Kubernetes",
    "AWS",
    "DevOps",
    "CI/CD"
  ],
  "suggestions": [
    "Add Docker and Kubernetes experience",
    "Include AWS/cloud infrastructure knowledge",
    "Highlight CI/CD pipeline experience"
  ]
}
```

**Validation:**
- ✅ matchScore is realistic (low-mid range, not 80+)
- ✅ presentKeywords lists what IS there
- ✅ missingKeywords lists real gaps
- ✅ suggestions are actionable
- ✅ Score matches % of requirements present

---

## Automated Check List

Run these checks after deployment:

### Console Checks
```bash
# Should see logs like:
√ "[AI Analysis] Using Groq API for: Resume Analysis"
√ "Analysis completed, scores normalized"
√ No errors about missing functions
✗ No "[Local Analysis Error]" messages
✗ No "analyzeLocal is not defined" errors
```

### Response Structure Checks
```javascript
const response = await analyzeResumeWithAI(resumeText);

// ✅ Must have these fields
response.skills              // Array
response.atsScore           // Number 0-100
response.atsBreakdown       // Object with 5 numeric fields
response.missingSkills      // Array
response.sugge stions        // Array
response.categorizedSuggestions // Object with highImpact, mediumImpact, lowImpact

// ✅ Each must be valid
response.atsScore >= 0 && response.atsScore <= 100
response.atsBreakdown.formatting >= 0 && <= 100
response.skillProficiency  // Array with proper structure
```

### Job Matching Checks
```javascript
const match = await matchJobDescription(resume, job, title);

// ✅ Must have these fields
match.matchScore           // Number 0-100
match.missingKeywords      // Array
match.presentKeywords      // Array (NEW - verify present)
match.suggestions          // Array

// ✅ Logic checks
match.missingKeywords.length > 0  // Job has requirements not in resume
match.presentKeywords.length > 0  // Resume has relevant skills
```

---

## Troubleshooting Guide

### Issue 1: "analyzeLocal is not defined"
**Cause:** Old code still trying to call removed function
**Solution:** Clear browser cache, restart server, check file was saved

### Issue 2: Scores Always High (80+)
**Cause:** 
- Local analysis still running
- Groq wasn't properly updated
- API not being called
**Solution:**
- Verify GROQ_API_KEY is set
- Check console for "Using Groq API" message
- Verify function updated correctly

### Issue 3: Groq API Not Responding
**Cause:** Invalid key, rate limit, or network error
**Solution:**
- Verify GROQ_API_KEY is correct
- Add GEMINI_API_KEY as backup
- Check Groq dashboard for quota

### Issue 4: Gemini as Primary But Not Working
**Cause:** Only Gemini key set, no Groq
**Solution:** This is fine - should fallback to Gemini
  - Verify logs show Gemini being used
  - Check Gemini API quota

### Issue 5: "No AI APIs configured" Error
**Cause:** Both API keys missing
**Solution:** 
  - Add at least GROQ_API_KEY to .env
  - Or GEMINI_API_KEY if Groq unavailable
  - Restart server

### Issue 6: JSON Parsing Error
**Cause:** AI returned invalid JSON
**Solution:**
- Reduce temperature (set to 0.5)
- Check prompt hasn't changed
- Try different AI model if available
- Add error logging to see actual response

---

## What Successful System Should Show

### Log Output Sample:
```
Server running on port 5000
Database connected
[AI Analysis] Using Groq API for: Resume Analysis
Analysis in progress...
Analyzing ATS score: 58/100
Skills extracted: 12
Suggestions generated: 5
Analysis complete
```

### Score Distribution Sample:
```
100 resumes analyzed:
- 5-10 scored 20-35 (very poor quality)
- 20-30 scored 40-60 (average quality)
- 30-40 scored 65-80 (good quality)
- 15-25 scored 80-95 (excellent quality)
- 1-2 scored 95+ (exceptional quality)

✅ Natural distribution (not all 70-80)
✅ Scores vary realistically
✅ Low, medium, and high scores all present
```

### Database Sample:
```json
{
  "_id": "...",
  "userId": "...",
  "fileName": "resume.pdf",
  "atsScore": 68,
  "atsBreakdown": {
    "formatting": 70,
    "keywordOptimization": 65,
    "structure": 70,
    "length": 70,
    "readability": 65
  },
  "extractedSkills": ["JavaScript", "React", ...],
  "missingSkills": ["TypeScript", "Docker", ...],
  "skillCategories": {...},
  "skillProficiency": [...],
  "categorizedSuggestions": {...},
  "analyzed": true,
  "createdAt": "2024-03-24..."
}
```

---

## Sign-Off Checklist

Before going to production, verify:

- [ ] Server starts without errors
- [ ] Test resume 1 scores 25-40
- [ ] Test resume 2 scores 60-75
- [ ] Test resume 3 scores 82-92
- [ ] API logs show "Using Groq/Gemini API"
- [ ] No "Local Analysis" messages in logs
- [ ] Job matching includes presentKeywords
- [ ] All 5 ATS breakdown components present
- [ ] MongoDB stores complete data
- [ ] Error handling works (both APIs missing)
- [ ] Fallback works (Groq fails → uses Gemini)
- [ ] No syntax errors in console
- [ ] Suggestions are specific and actionable

**Once all checks pass: ✅ READY FOR PRODUCTION**

---

## Next Steps After Verification

1. **Update Frontend:**
   - Display atsBreakdown as radar chart or progress bars
   - Show presentKeywords in job matching
   - Highlight high-impact suggestions

2. **Add Analytics:**
   - Track average scores
   - Monitor API usage
   - Alert on failures

3. **User Communication:**
   - Explain new realistic scoring
   - Show resume improvement tips
   - Celebrate when score increases

4. **Continuous Improvement:**
   - Collect user feedback on accuracy
   - Adjust prompts if needed
   - Monitor for edge cases
