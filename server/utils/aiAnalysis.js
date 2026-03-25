import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Initialize Groq API (Primary)
 */
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Initialize Google Generative AI (Fallback)
 */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Helper to log which API is being used
 */
const logAPIUsage = (api, action) => {
  console.log(`[AI Analysis] Using ${api} API for: ${action}`);
};

/**
 * Helper function to extract and parse JSON from various formats
 * Handles markdown-wrapped JSON (```json...```) and plain JSON
 * @param {string} content - The content to parse
 * @returns {Object} - Parsed JSON object
 */
const extractAndParseJSON = (content) => {
  try {
    // Trim whitespace
    let jsonString = content.trim();

    // Extract JSON from markdown code blocks
    const jsonMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch && jsonMatch[1]) {
      jsonString = jsonMatch[1].trim();
    }

    // Try to parse the JSON
    const parsed = JSON.parse(jsonString);
    return parsed;
  } catch (error) {
    throw new Error(`Failed to parse JSON response: ${error.message}. Content: ${content.substring(0, 100)}...`);
  }
};

/**
 * Analyzes a resume using AI (Groq primary, Gemini fallback)
 * NO LOCAL APPROXIMATIONS - AI only for accurate ATS scores
 * @param {string} resumeText - The resume text to analyze
 * @returns {Promise<Object>} - Object containing skills, missingSkills, atsScore, and suggestions
 */
export const analyzeResumeWithAI = async (resumeText) => {
  const errors = {};
  
  try {
    // Try Groq first - unlimited free tier
    if (process.env.GROQ_API_KEY) {
      try {
        console.log('[AI Analysis] Attempting: Groq API');
        logAPIUsage('Groq', 'Resume Analysis');
        const result = await analyzeWithGroq(resumeText);
        console.log('[AI Analysis] ✓ Groq succeeded');
        return result;
      } catch (groqError) {
        errors.groq = groqError.message;
        console.error('[AI Analysis] ✗ Groq failed:', groqError.message);
        console.error('[AI Analysis] Full Groq error:', groqError);
      }
    } else {
      console.warn('[AI Analysis] Groq API key not configured');
    }

    // Try Gemini as fallback
    if (process.env.GEMINI_API_KEY) {
      try {
        console.log('[AI Analysis] Attempting: Gemini API (fallback)');
        logAPIUsage('Gemini', 'Resume Analysis - Groq failed');
        const result = await analyzeWithGemini(resumeText);
        console.log('[AI Analysis] ✓ Gemini succeeded');
        return result;
      } catch (geminiError) {
        errors.gemini = geminiError.message;
        console.error('[AI Analysis] ✗ Gemini failed:', geminiError.message);
        console.error('[AI Analysis] Full Gemini error:', geminiError);
      }
    } else {
      console.warn('[AI Analysis] Gemini API key not configured');
    }

    // If both failed, provide detailed error info
    const errorDetails = Object.entries(errors)
      .map(([api, msg]) => `${api}: ${msg}`)
      .join(' | ');
    
    throw new Error(`Both Groq and Gemini failed: ${errorDetails || 'No AI APIs configured'}`);
  } catch (error) {
    console.error('[Analysis Fatal Error]', error.message);
    throw error;
  }
};

/**
 * Analyze resume using Groq
 * REAL ATS SCORING - calculates actual ATS compatibility
 */
const analyzeWithGroq = async (resumeText) => {
  const prompt = `You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze this resume exactly like real ATS systems do (LinkedIn Recruiter, Greenhouse, Workday, etc.).

CALCULATE **ACCURATE ATS SCORES** based on:
1. FORMATTING (0-100): Is resume parseable? Clear structure, standard fonts, proper spacing, no graphics/images that break parsing
2. KEYWORD OPTIMIZATION (0-100): Industry-relevant keywords, technical skills, tools, job titles mentioned
3. STRUCTURE (0-100): Has Contact Info → Professional Summary → Experience → Education → Skills sections in logical order
4. LENGTH (0-100): Optimal resume length (0.5-2 pages is ideal, score accordingly)
5. READABILITY (0-100): Easy to scan, bullet points, clear hierarchy, white space usage

Be REALISTIC with scores:
- A resume with NO contact info, scattered format, missing sections = 20-35
- Basic resume with some skills, acceptable format = 45-60  
- Well-structured, complete sections, good formatting = 65-80
- Excellent formatting + strong keywords + complete info = 85-95
- RARELY give 95+ unless truly exceptional

Resume text to analyze:
${resumeText}

Return ONLY valid JSON (no markdown, no code blocks) with these EXACT fields:

{
  "skills": ["list of all skills extracted"],
  "missingSkills": ["industry-relevant skills NOT in resume - predict what hiring managers would want"],
  "atsScore": number between 0-100 (THIS IS YOUR PRIMARY CALCULATION),
  "suggestions": ["array of improvement suggestions"],
  "categorizedSuggestions": {
    "highImpact": [
      {"title": "string", "description": "string with actionable advice", "category": "formatting|content|skills|structure"}
    ],
    "mediumImpact": [
      {"title": "string", "description": "string", "category": "formatting|content|skills|structure"}
    ],
    "lowImpact": [
      {"title": "string", "description": "string", "category": "formatting|content|skills|structure"}
    ]
  },
  "atsBreakdown": {
    "formatting": number 0-100,
    "keywordOptimization": number 0-100,
    "structure": number 0-100,
    "length": number 0-100,
    "readability": number 0-100
  },
  "skillCategories": {
    "technical": [],
    "softSkills": [],
    "tools": [],
    "languages": []
  },
  "skillProficiency": [
    {"skill": "name", "category": "technical|softSkills|tools|languages", "proficiencyLevel": "Beginner|Intermediate|Advanced|Expert", "yearsOfExperience": number or null}
  ]
}

RULES:
- Return ONLY the JSON object
- ALL scores must be numbers (0-100), not strings
- Be honest: low scores if resume quality is poor
- skillProficiency should include top 15 skills with proficiency estimated from resume context
- missingSkills should suggest what the resume is missing for modern roles`;

  try {
    console.log('[Groq] Sending request...');
    const message = await groq.messages.create({
      model: 'mixtral-8x7b-32768',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.5,
    });

    if (!message.content || !message.content[0]) {
      console.error('[Groq] Error: Empty response');
      throw new Error('Empty response from Groq API');
    }

    const content = message.content[0].type === 'text' ? message.content[0].text : '';
    if (!content) {
      console.error('[Groq] Error: No text content');
      throw new Error('No text content in Groq response');
    }

    console.log('[Groq] Response received, parsing...');
    const analysis = extractAndParseJSON(content);
    console.log('[Groq] Analysis parsed successfully');
    return validateAnalysis(analysis);
  } catch (error) {
    console.error('[Groq] Analysis error:', error.message);
    logAPIUsage('Groq', `Error: ${error.message}`);
    throw error;
  }
};

/**
 * Analyze resume using Gemini (fallback)
 */
const analyzeWithGemini = async (resumeText) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze this resume exactly like real ATS systems do (LinkedIn Recruiter, Greenhouse, Workday, etc.).

CALCULATE **ACCURATE ATS SCORES** based on:
1. FORMATTING (0-100): Is resume parseable? Clear structure, standard fonts, proper spacing, no graphics/images that break parsing
2. KEYWORD OPTIMIZATION (0-100): Industry-relevant keywords, technical skills, tools, job titles mentioned
3. STRUCTURE (0-100): Has Contact Info → Professional Summary → Experience → Education → Skills sections in logical order
4. LENGTH (0-100): Optimal resume length (0.5-2 pages is ideal, score accordingly)
5. READABILITY (0-100): Easy to scan, bullet points, clear hierarchy, white space usage

Be REALISTIC with scores:
- A resume with NO contact info, scattered format, missing sections = 20-35
- Basic resume with some skills, acceptable format = 45-60  
- Well-structured, complete sections, good formatting = 65-80
- Excellent formatting + strong keywords + complete info = 85-95
- RARELY give 95+ unless truly exceptional

Resume text to analyze:
${resumeText}

Return ONLY valid JSON (no markdown, no code blocks) with these EXACT fields:

{
  "skills": ["list of all skills extracted"],
  "missingSkills": ["industry-relevant skills NOT in resume - predict what hiring managers would want"],
  "atsScore": number between 0-100 (THIS IS YOUR PRIMARY CALCULATION),
  "suggestions": ["array of improvement suggestions"],
  "categorizedSuggestions": {
    "highImpact": [
      {"title": "string", "description": "string with actionable advice", "category": "formatting|content|skills|structure"}
    ],
    "mediumImpact": [
      {"title": "string", "description": "string", "category": "formatting|content|skills|structure"}
    ],
    "lowImpact": [
      {"title": "string", "description": "string", "category": "formatting|content|skills|structure"}
    ]
  },
  "atsBreakdown": {
    "formatting": number 0-100,
    "keywordOptimization": number 0-100,
    "structure": number 0-100,
    "length": number 0-100,
    "readability": number 0-100
  },
  "skillCategories": {
    "technical": [],
    "softSkills": [],
    "tools": [],
    "languages": []
  },
  "skillProficiency": [
    {"skill": "name", "category": "technical|softSkills|tools|languages", "proficiencyLevel": "Beginner|Intermediate|Advanced|Expert", "yearsOfExperience": number or null}
  ]
}

RULES:
- Return ONLY the JSON object
- ALL scores must be numbers (0-100), not strings
- Be honest: low scores if resume quality is poor
- skillProficiency should include top 15 skills with proficiency estimated from resume context
- missingSkills should suggest what the resume is missing for modern roles`;

  try {
    console.log('[Gemini] Sending request...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    if (!response || !response.text) {
      console.error('[Gemini] Error: Empty response');
      throw new Error('Empty response from Gemini API');
    }
    
    const content = response.text();
    if (!content) {
      console.error('[Gemini] Error: No text content');
      throw new Error('No text content in Gemini response');
    }
    
    console.log('[Gemini] Response received, parsing...');
    const analysis = extractAndParseJSON(content);
    console.log('[Gemini] Analysis parsed successfully');
    return validateAnalysis(analysis);
  } catch (error) {
    console.error('[Gemini] Analysis error:', error.message);
    logAPIUsage('Gemini', `Error: ${error.message}`);
    throw error;
  }
};


/**
 * Validates analysis response - STRICT AI-ONLY, NO LOCAL ANALYSIS
 * Rejects any incomplete or malformed responses
 */
const validateAnalysis = (analysis) => {
  // Validate required fields exist
  if (!analysis || typeof analysis !== 'object') {
    throw new Error('AI analysis returned invalid response');
  }

  // Validate skills array
  if (!Array.isArray(analysis.skills)) {
    throw new Error('AI response missing required field: skills array');
  }
  analysis.skills = analysis.skills.map(s => String(s).trim()).filter(Boolean);

  // Validate missingSkills array
  if (!Array.isArray(analysis.missingSkills)) {
    throw new Error('AI response missing required field: missingSkills array');
  }
  analysis.missingSkills = analysis.missingSkills.map(s => String(s).trim()).filter(Boolean);

  // STRICT: ATS score must be a valid number from AI
  if (typeof analysis.atsScore !== 'number' || isNaN(analysis.atsScore)) {
    throw new Error('AI response missing valid atsScore number');
  }
  // Ensure score is in valid range
  if (analysis.atsScore < 0 || analysis.atsScore > 100) {
    throw new Error(`Invalid ATS score from AI: ${analysis.atsScore} (must be 0-100)`);
  }
  analysis.atsScore = Math.round(analysis.atsScore);

  // STRICT: Require complete ATS breakdown from AI
  if (!analysis.atsBreakdown || typeof analysis.atsBreakdown !== 'object') {
    throw new Error('AI response missing required field: atsBreakdown object');
  }
  
  const breakdownFields = ['formatting', 'keywordOptimization', 'structure', 'length', 'readability'];
  for (const field of breakdownFields) {
    if (typeof analysis.atsBreakdown[field] !== 'number' || isNaN(analysis.atsBreakdown[field])) {
      throw new Error(`AI response missing valid ${field} score in atsBreakdown`);
    }
    if (analysis.atsBreakdown[field] < 0 || analysis.atsBreakdown[field] > 100) {
      throw new Error(`Invalid ${field} score from AI: ${analysis.atsBreakdown[field]} (must be 0-100)`);
    }
    analysis.atsBreakdown[field] = Math.round(analysis.atsBreakdown[field]);
  }

  // STRICT: Require skill categories from AI
  if (!analysis.skillCategories || typeof analysis.skillCategories !== 'object') {
    throw new Error('AI response missing required field: skillCategories object');
  }
  
  const categoryNames = ['technical', 'softSkills', 'tools', 'languages'];
  for (const category of categoryNames) {
    if (!Array.isArray(analysis.skillCategories[category])) {
      throw new Error(`AI response missing skillCategories.${category} array`);
    }
    analysis.skillCategories[category] = analysis.skillCategories[category]
      .map(s => String(s).trim())
      .filter(Boolean);
  }

  // STRICT: Require skill proficiency array from AI
  if (!Array.isArray(analysis.skillProficiency)) {
    throw new Error('AI response missing required field: skillProficiency array');
  }
  
  if (analysis.skillProficiency.length === 0) {
    throw new Error('AI response returned empty skillProficiency (expected at least 1 skill)');
  }

  analysis.skillProficiency = analysis.skillProficiency
    .map(sp => {
      if (!sp.skill || typeof sp.skill !== 'string') {
        throw new Error('Invalid skill in skillProficiency: missing or non-string skill name');
      }
      if (!sp.category || typeof sp.category !== 'string') {
        throw new Error(`Invalid skill "${sp.skill}": missing or non-string category`);
      }
      if (!['Beginner', 'Intermediate', 'Advanced', 'Expert'].includes(sp.proficiencyLevel)) {
        throw new Error(`Invalid skill "${sp.skill}": unknown proficiency level "${sp.proficiencyLevel}"`);
      }
      
      return {
        skill: String(sp.skill).trim(),
        category: String(sp.category),
        proficiencyLevel: sp.proficiencyLevel,
        yearsOfExperience: typeof sp.yearsOfExperience === 'number' ? sp.yearsOfExperience : null,
      };
    })
    .filter(sp => sp.skill);

  // STRICT: Require suggestions from AI
  if (!Array.isArray(analysis.suggestions)) {
    throw new Error('AI response missing required field: suggestions array');
  }
  analysis.suggestions = analysis.suggestions
    .map(s => String(s).trim())
    .filter(Boolean);

  // STRICT: Require categorized suggestions from AI
  if (!analysis.categorizedSuggestions || typeof analysis.categorizedSuggestions !== 'object') {
    throw new Error('AI response missing required field: categorizedSuggestions object');
  }
  
  const suggestionLevels = ['highImpact', 'mediumImpact', 'lowImpact'];
  for (const level of suggestionLevels) {
    if (!Array.isArray(analysis.categorizedSuggestions[level])) {
      throw new Error(`AI response missing categorizedSuggestions.${level} array`);
    }
    analysis.categorizedSuggestions[level] = analysis.categorizedSuggestions[level]
      .map(sug => {
        if (!sug.title || typeof sug.title !== 'string') {
          throw new Error(`Invalid suggestion in ${level}: missing or non-string title`);
        }
        if (!sug.description || typeof sug.description !== 'string') {
          throw new Error(`Invalid suggestion "${sug.title}": missing or non-string description`);
        }
        return {
          title: String(sug.title).trim(),
          description: String(sug.description).trim(),
          category: String(sug.category || 'general'),
        };
      })
      .filter(sug => sug.title && sug.description);
  }

  return analysis;
};

/**
 * Matches a resume against a job description (Groq primary, Gemini fallback)
 * NO LOCAL APPROXIMATIONS - AI only for accurate matching
 * @param {string} resumeText - The resume text
 * @param {string} jobDescription - The job description text
 * @param {string} jobTitle - The job title
 * @returns {Promise<Object>} - Object containing matchScore, missingKeywords, and suggestions
 */
export const matchJobDescription = async (resumeText, jobDescription, jobTitle) => {
  const errors = {};
  
  try {
    // Try Groq first - unlimited free tier
    if (process.env.GROQ_API_KEY) {
      try {
        console.log('[Job Matching] Attempting: Groq API');
        logAPIUsage('Groq', 'Job Matching');
        const result = await matchWithGroq(resumeText, jobDescription, jobTitle);
        console.log('[Job Matching] ✓ Groq succeeded');
        return result;
      } catch (groqError) {
        errors.groq = groqError.message;
        console.error('[Job Matching] ✗ Groq failed:', groqError.message);
        console.error('[Job Matching] Full Groq error:', groqError);
      }
    } else {
      console.warn('[Job Matching] Groq API key not configured');
    }

    // Try Gemini as fallback
    if (process.env.GEMINI_API_KEY) {
      try {
        console.log('[Job Matching] Attempting: Gemini API (fallback)');
        logAPIUsage('Gemini', 'Job Matching - Groq failed');
        const result = await matchWithGemini(resumeText, jobDescription, jobTitle);
        console.log('[Job Matching] ✓ Gemini succeeded');
        return result;
      } catch (geminiError) {
        errors.gemini = geminiError.message;
        console.error('[Job Matching] ✗ Gemini failed:', geminiError.message);
        console.error('[Job Matching] Full Gemini error:', geminiError);
      }
    } else {
      console.warn('[Job Matching] Gemini API key not configured');
    }

    // If both failed, provide detailed error info
    const errorDetails = Object.entries(errors)
      .map(([api, msg]) => `${api}: ${msg}`)
      .join(' | ');
    
    throw new Error(`Both Groq and Gemini failed: ${errorDetails || 'No AI APIs configured'}`);
  } catch (error) {
    console.error('[Job Matching Fatal Error]', error.message);
    throw error;
  }
};

/**
 * Match job using Groq
 */
const matchWithGroq = async (resumeText, jobDescription, jobTitle) => {
  const prompt = `You are an expert resume-to-job matcher. Analyze how well this resume matches the job requirements.

CALCULATE **ACCURATE MATCHING SCORE** (0-100):
- Extract all KEY REQUIREMENTS from the job description (skills, experience level, certifications, tools, years of experience)
- Check what percentage of key requirements are found in the resume
- Consider relevance and exact matches vs. partial/similar skills
- Be realistic: Random matches don't count, only genuine skill/experience matches

Matching Scoring Guide:
- 0-20: No relevant experience or skills match
- 20-40: Very few relevant skills/experience
- 40-60: Some skills match but missing important requirements
- 60-75: Most requirements covered but gaps remain
- 75-90: Strong match with minor gaps
- 90-100: Excellent match, nearly all requirements present

Resume:
${resumeText}

Job Title: ${jobTitle}
Job Description:
${jobDescription}

Return ONLY valid JSON (no markdown):
{
  "matchScore": number 0-100,
  "missingKeywords": ["top 15 important keywords/skills NOT found in resume"],
  "presentKeywords": ["important keywords/skills that ARE in the resume"],
  "suggestions": ["actionable ways to improve resume for this job"]
}

RULES:
- matchScore must be honest (not inflated)
- missingKeywords: Extract from job description, focus on skills, tools, technologies, certifications
- Return ONLY JSON, no extra text`;

  try {
    console.log('[Groq - Matching] Sending request...');
    const message = await groq.messages.create({
      model: 'mixtral-8x7b-32768',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.5,
    });

    if (!message.content || !message.content[0]) {
      console.error('[Groq - Matching] Error: Empty response');
      throw new Error('Empty response from Groq API');
    }

    const content = message.content[0].type === 'text' ? message.content[0].text : '';
    if (!content) {
      console.error('[Groq - Matching] Error: No text content');
      throw new Error('No text content in Groq response');
    }

    console.log('[Groq - Matching] Response received, parsing...');
    const match = extractAndParseJSON(content);
    console.log('[Groq - Matching] Match parsed successfully');
    return validateMatch(match);
  } catch (error) {
    console.error('[Groq - Matching] Error:', error.message);
    logAPIUsage('Groq', `Matching Error: ${error.message}`);
    throw error;
  }
};

/**
 * Match job using Gemini (fallback)
 */
const matchWithGemini = async (resumeText, jobDescription, jobTitle) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are an expert resume-to-job matcher. Analyze how well this resume matches the job requirements.

CALCULATE **ACCURATE MATCHING SCORE** (0-100):
- Extract all KEY REQUIREMENTS from the job description (skills, experience level, certifications, tools, years of experience)
- Check what percentage of key requirements are found in the resume
- Consider relevance and exact matches vs. partial/similar skills
- Be realistic: Random matches don't count, only genuine skill/experience matches

Matching Scoring Guide:
- 0-20: No relevant experience or skills match
- 20-40: Very few relevant skills/experience
- 40-60: Some skills match but missing important requirements
- 60-75: Most requirements covered but gaps remain
- 75-90: Strong match with minor gaps
- 90-100: Excellent match, nearly all requirements present

Resume:
${resumeText}

Job Title: ${jobTitle}
Job Description:
${jobDescription}

Return ONLY valid JSON (no markdown):
{
  "matchScore": number 0-100,
  "missingKeywords": ["top 15 important keywords/skills NOT found in resume"],
  "presentKeywords": ["important keywords/skills that ARE in the resume"],
  "suggestions": ["actionable ways to improve resume for this job"]
}

RULES:
- matchScore must be honest (not inflated)
- missingKeywords: Extract from job description, focus on skills, tools, technologies, certifications
- Return ONLY JSON, no extra text`;

  try {
    console.log('[Gemini - Matching] Sending request...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    if (!response || !response.text) {
      console.error('[Gemini - Matching] Error: Empty response');
      throw new Error('Empty response from Gemini API');
    }
    
    const content = response.text();
    if (!content) {
      console.error('[Gemini - Matching] Error: No text content');
      throw new Error('No text content in Gemini response');
    }
    
    console.log('[Gemini - Matching] Response received, parsing...');
    const match = extractAndParseJSON(content);
    console.log('[Gemini - Matching] Match parsed successfully');
    return validateMatch(match);
  } catch (error) {
    console.error('[Gemini - Matching] Error:', error.message);
    logAPIUsage('Gemini', `Matching Error: ${error.message}`);
    throw error;
  }
};

/**
 * Validates match response - STRICT AI-ONLY, NO LOCAL ANALYSIS
 * Rejects any incomplete or malformed responses
 */
const validateMatch = (match) => {
  // Validate required fields exist
  if (!match || typeof match !== 'object') {
    throw new Error('AI matching returned invalid response');
  }

  // STRICT: Match score must be a valid number from AI
  if (typeof match.matchScore !== 'number' || isNaN(match.matchScore)) {
    throw new Error('AI response missing valid matchScore number');
  }
  if (match.matchScore < 0 || match.matchScore > 100) {
    throw new Error(`Invalid match score from AI: ${match.matchScore} (must be 0-100)`);
  }
  match.matchScore = Math.round(match.matchScore);

  // STRICT: Require missing keywords array from AI
  if (!Array.isArray(match.missingKeywords)) {
    throw new Error('AI response missing required field: missingKeywords array');
  }
  if (match.missingKeywords.length === 0) {
    throw new Error('AI response returned empty missingKeywords (expected at least keywords analysis)');
  }
  match.missingKeywords = match.missingKeywords
    .map(k => {
      if (typeof k === 'string') return k.trim();
      if (typeof k === 'object' && k !== null && k.keyword) return String(k.keyword).trim();
      if (typeof k === 'object' && k !== null && k.value) return String(k.value).trim();
      const str = String(k).trim();
      if (str && str !== '[object Object]') return str;
      throw new Error(`Invalid keyword format in missingKeywords: ${JSON.stringify(k)}`);
    })
    .filter(Boolean);

  // STRICT: Require present keywords array from AI
  if (!Array.isArray(match.presentKeywords)) {
    throw new Error('AI response missing required field: presentKeywords array');
  }
  match.presentKeywords = match.presentKeywords
    .map(k => {
      if (typeof k === 'string') return k.trim();
      if (typeof k === 'object' && k !== null && k.keyword) return String(k.keyword).trim();
      if (typeof k === 'object' && k !== null && k.value) return String(k.value).trim();
      const str = String(k).trim();
      if (str && str !== '[object Object]') return str;
      return null;
    })
    .filter(Boolean);

  // STRICT: Require suggestions array from AI
  if (!Array.isArray(match.suggestions)) {
    throw new Error('AI response missing required field: suggestions array');
  }
  if (match.suggestions.length === 0) {
    throw new Error('AI response returned empty suggestions (expected actionable improvement suggestions)');
  }
  match.suggestions = match.suggestions
    .map(s => {
      if (typeof s === 'string') return s.trim();
      if (typeof s === 'object' && s !== null) {
        const suggestion = s.suggestion || s.text || s.title || s.description;
        if (suggestion) return String(suggestion).trim();
      }
      throw new Error(`Invalid suggestion format: ${JSON.stringify(s)}`);
    })
    .filter(s => s && s.length > 0);

  return match;
};
