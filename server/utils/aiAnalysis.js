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
  try {
    // Try Groq first - unlimited free tier
    if (process.env.GROQ_API_KEY) {
      try {
        logAPIUsage('Groq', 'Resume Analysis');
        return await analyzeWithGroq(resumeText);
      } catch (groqError) {
        console.error('[Groq Error - Falling back to Gemini]', groqError.message);
        
        // Try Gemini as fallback
        if (process.env.GEMINI_API_KEY) {
          try {
            logAPIUsage('Gemini', 'Resume Analysis - Groq failed');
            return await analyzeWithGemini(resumeText);
          } catch (geminiError) {
            console.error('[Gemini Error]', geminiError.message);
            throw new Error(`Both Groq and Gemini failed: ${geminiError.message}`);
          }
        }
        
        throw new Error(`Groq failed and no Gemini API key available: ${groqError.message}`);
      }
    }

    // Try Gemini if Groq not available
    if (process.env.GEMINI_API_KEY) {
      try {
        logAPIUsage('Gemini', 'Resume Analysis - No Groq API key');
        return await analyzeWithGemini(resumeText);
      } catch (geminiError) {
        throw new Error(`Gemini analysis failed: ${geminiError.message}`);
      }
    }

    throw new Error('No AI APIs configured: Please set GROQ_API_KEY or GEMINI_API_KEY');
  } catch (error) {
    console.error('[Analysis Fatal Error]', error.message);
    throw new Error(`AI analysis failed: ${error.message}`);
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
      throw new Error('Empty response from Groq API');
    }

    const content = message.content[0].type === 'text' ? message.content[0].text : '';
    if (!content) {
      throw new Error('No text content in Groq response');
    }

    const analysis = extractAndParseJSON(content);
    return validateAnalysis(analysis);
  } catch (error) {
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
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    if (!response || !response.text) {
      throw new Error('Empty response from Gemini API');
    }
    
    const content = response.text();
    if (!content) {
      throw new Error('No text content in Gemini response');
    }
    
    const analysis = extractAndParseJSON(content);
    return validateAnalysis(analysis);
  } catch (error) {
    logAPIUsage('Gemini', `Error: ${error.message}`);
    throw error;
  }
};


/**
 * Validates and normalizes analysis response
 */
const validateAnalysis = (analysis) => {
  // Validate and normalize response structure
  if (!analysis.skills || !Array.isArray(analysis.skills)) {
    analysis.skills = [];
  } else {
    analysis.skills = analysis.skills.map(s => String(s)).filter(Boolean);
  }

  if (!analysis.missingSkills || !Array.isArray(analysis.missingSkills)) {
    analysis.missingSkills = [];
  } else {
    analysis.missingSkills = analysis.missingSkills.map(s => String(s)).filter(Boolean);
  }

  // Validate ATS score
  if (typeof analysis.atsScore !== 'number') {
    const score = parseInt(analysis.atsScore);
    analysis.atsScore = isNaN(score) ? 50 : score;
  }
  analysis.atsScore = Math.min(100, Math.max(0, analysis.atsScore));

  // Validate ATS Breakdown
  if (!analysis.atsBreakdown || typeof analysis.atsBreakdown !== 'object') {
    analysis.atsBreakdown = {};
  }
  const breakdownFields = ['formatting', 'keywordOptimization', 'structure', 'length', 'readability'];
  breakdownFields.forEach(field => {
    if (typeof analysis.atsBreakdown[field] !== 'number') {
      const score = parseInt(analysis.atsBreakdown[field]);
      analysis.atsBreakdown[field] = isNaN(score) ? 50 : Math.min(100, Math.max(0, score));
    }
  });

  // Validate Skill Categories
  if (!analysis.skillCategories || typeof analysis.skillCategories !== 'object') {
    analysis.skillCategories = { technical: [], softSkills: [], tools: [], languages: [] };
  }
  ['technical', 'softSkills', 'tools', 'languages'].forEach(category => {
    if (!Array.isArray(analysis.skillCategories[category])) {
      analysis.skillCategories[category] = [];
    } else {
      analysis.skillCategories[category] = analysis.skillCategories[category]
        .map(s => String(s)).filter(Boolean);
    }
  });

  // Validate Skill Proficiency
  if (!Array.isArray(analysis.skillProficiency)) {
    analysis.skillProficiency = [];
  } else {
    analysis.skillProficiency = analysis.skillProficiency.map(sp => ({
      skill: String(sp.skill || '').trim(),
      category: String(sp.category || 'technical'),
      proficiencyLevel: ['Beginner', 'Intermediate', 'Advanced', 'Expert'].includes(sp.proficiencyLevel)
        ? sp.proficiencyLevel
        : 'Intermediate',
      yearsOfExperience: typeof sp.yearsOfExperience === 'number' ? sp.yearsOfExperience : null,
    })).filter(sp => sp.skill);
  }

  if (!analysis.suggestions || !Array.isArray(analysis.suggestions)) {
    analysis.suggestions = [];
  } else {
    analysis.suggestions = analysis.suggestions.map(s => String(s)).filter(Boolean);
  }

  // Validate categorized suggestions
  if (!analysis.categorizedSuggestions || typeof analysis.categorizedSuggestions !== 'object') {
    analysis.categorizedSuggestions = { highImpact: [], mediumImpact: [], lowImpact: [] };
  }
  ['highImpact', 'mediumImpact', 'lowImpact'].forEach(level => {
    if (!Array.isArray(analysis.categorizedSuggestions[level])) {
      analysis.categorizedSuggestions[level] = [];
    } else {
      analysis.categorizedSuggestions[level] = analysis.categorizedSuggestions[level]
        .map(sug => ({
          title: String(sug.title || '').trim(),
          description: String(sug.description || '').trim(),
          category: String(sug.category || 'general'),
        }))
        .filter(sug => sug.title && sug.description);
    }
  });

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
  try {
    // Try Groq first - unlimited free tier
    if (process.env.GROQ_API_KEY) {
      try {
        logAPIUsage('Groq', 'Job Matching');
        return await matchWithGroq(resumeText, jobDescription, jobTitle);
      } catch (groqError) {
        console.error('[Groq Matching Error - Falling back to Gemini]', groqError.message);
        
        // Try Gemini as fallback
        if (process.env.GEMINI_API_KEY) {
          try {
            logAPIUsage('Gemini', 'Job Matching - Groq failed');
            return await matchWithGemini(resumeText, jobDescription, jobTitle);
          } catch (geminiError) {
            console.error('[Gemini Matching Error]', geminiError.message);
            throw new Error(`Both Groq and Gemini failed: ${geminiError.message}`);
          }
        }
        
        throw new Error(`Groq failed and no Gemini API key available: ${groqError.message}`);
      }
    }

    // Try Gemini if Groq not available
    if (process.env.GEMINI_API_KEY) {
      try {
        logAPIUsage('Gemini', 'Job Matching - No Groq API key');
        return await matchWithGemini(resumeText, jobDescription, jobTitle);
      } catch (geminiError) {
        throw new Error(`Gemini matching failed: ${geminiError.message}`);
      }
    }

    throw new Error('No AI APIs configured: Please set GROQ_API_KEY or GEMINI_API_KEY');
  } catch (error) {
    console.error('[Job Matching Fatal Error]', error.message);
    throw new Error(`Job matching failed: ${error.message}`);
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
      throw new Error('Empty response from Groq API');
    }

    const content = message.content[0].type === 'text' ? message.content[0].text : '';
    if (!content) {
      throw new Error('No text content in Groq response');
    }

    const match = extractAndParseJSON(content);
    return validateMatch(match);
  } catch (error) {
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
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    if (!response || !response.text) {
      throw new Error('Empty response from Gemini API');
    }
    
    const content = response.text();
    if (!content) {
      throw new Error('No text content in Gemini response');
    }
    
    const match = extractAndParseJSON(content);
    return validateMatch(match);
  } catch (error) {
    logAPIUsage('Gemini', `Matching Error: ${error.message}`);
    throw error;
  }
};

/**
 * Validates and normalizes match response
 */
const validateMatch = (match) => {
  // Validate and normalize response structure
  if (typeof match.matchScore !== 'number') {
    const score = parseInt(match.matchScore);
    match.matchScore = isNaN(score) ? 50 : score;
  }
  match.matchScore = Math.min(100, Math.max(0, match.matchScore));

  if (!match.missingKeywords || !Array.isArray(match.missingKeywords)) {
    match.missingKeywords = [];
  } else {
    // Ensure all keywords are strings
    match.missingKeywords = match.missingKeywords.map(k => {
      if (typeof k === 'string') return k;
      if (typeof k === 'object' && k !== null) return k.keyword || k.value || JSON.stringify(k);
      return String(k);
    }).filter(Boolean);
  }

  // Validate presentKeywords (optional, but good to have)
  if (!match.presentKeywords || !Array.isArray(match.presentKeywords)) {
    match.presentKeywords = [];
  } else {
    match.presentKeywords = match.presentKeywords.map(k => {
      if (typeof k === 'string') return k;
      if (typeof k === 'object' && k !== null) return k.keyword || k.value || JSON.stringify(k);
      return String(k);
    }).filter(Boolean);
  }

  if (!match.suggestions || !Array.isArray(match.suggestions)) {
    match.suggestions = [];
  } else {
    // Ensure all suggestions are strings
    match.suggestions = match.suggestions.map(s => {
      if (typeof s === 'string') return s;
      if (typeof s === 'object' && s !== null) {
        return s.suggestion || s.text || s.title || s.description || JSON.stringify(s);
      }
      return String(s).trim();
    }).filter(s => s && s !== '[object Object]' && s.length > 0);
  }

  return match;
};
