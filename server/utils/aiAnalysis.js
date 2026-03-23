import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Initialize Google Generative AI with API key from environment variables
 */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
 * Analyzes a resume using Google Gemini API and returns structured insights
 * @param {string} resumeText - The resume text to analyze
 * @returns {Promise<Object>} - Object containing skills, missingSkills, atsScore, and suggestions
 */
export const analyzeResumeWithAI = async (resumeText) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Analyze the following resume comprehensively and provide a structured JSON response with EXACTLY these fields:

{
  "skills": ["array of skills found in resume"],
  "missingSkills": ["array of in-demand skills not found"],
  "atsScore": number 0-100,
  "suggestions": ["array of improvement suggestions"],
  "categorizedSuggestions": {
    "highImpact": [{"title": "string", "description": "string", "category": "formatting|content|skills|structure"}],
    "mediumImpact": [{"title": "string", "description": "string", "category": "formatting|content|skills|structure"}],
    "lowImpact": [{"title": "string", "description": "string", "category": "formatting|content|skills|structure"}]
  },
  "atsBreakdown": {
    "formatting": number 0-100,
    "keywordOptimization": number 0-100,
    "structure": number 0-100,
    "length": number 0-100,
    "readability": number 0-100
  },
  "skillCategories": {
    "technical": ["programming languages, frameworks, databases, etc"],
    "softSkills": ["communication, leadership, teamwork, problem-solving, etc"],
    "tools": ["software tools, platforms, IDEs, design tools, etc"],
    "languages": ["spoken languages if mentioned"]
  },
  "skillProficiency": [
    {
      "skill": "skill name",
      "category": "technical|softSkills|tools|languages",
      "proficiencyLevel": "Beginner|Intermediate|Advanced|Expert",
      "yearsOfExperience": number or null
    }
  ]
}

Resume text:
${resumeText}

SUGGESTIONS GUIDELINES:
- HIGH IMPACT (3-5): Formatting fixes, missing sections, critical ATS issues - these will have biggest effect
- MEDIUM IMPACT (3-5): Content improvements, skill descriptions, structure enhancements
- LOW IMPACT (2-3): Minor tweaks, style improvements, formatting polish

IMPORTANT: 
- Return ONLY valid JSON, no markdown, no code blocks, no extra text
- Each suggestion must have title, description, and category
- Descriptions should be specific and actionable
- All numeric scores must be numbers (not strings)`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();
    const analysis = extractAndParseJSON(content);

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
    })

    return analysis;
  } catch (error) {
    throw new Error(`AI analysis failed: ${error.message}`);
  }
};

/**
 * Matches a resume against a job description using Google Gemini API
 * @param {string} resumeText - The resume text
 * @param {string} jobDescription - The job description text
 * @param {string} jobTitle - The job title
 * @returns {Promise<Object>} - Object containing matchScore, missingKeywords, and suggestions
 */
export const matchJobDescription = async (resumeText, jobDescription, jobTitle) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Compare the following resume with the job description and provide a structured JSON response with:
    - matchScore: a score from 0-100 indicating how well the resume matches the job
    - missingKeywords: array of important keywords from the job description not found in the resume
    - suggestions: array of suggestions to improve match
    
    Resume:
    ${resumeText}
    
    Job Title: ${jobTitle}
    Job Description:
    ${jobDescription}
    
    Respond with valid JSON only, no markdown or extra text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();
    const match = extractAndParseJSON(content);

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
      match.missingKeywords = match.missingKeywords.map(k => String(k)).filter(Boolean);
    }

    if (!match.suggestions || !Array.isArray(match.suggestions)) {
      match.suggestions = [];
    } else {
      // Ensure all suggestions are strings
      match.suggestions = match.suggestions.map(s => String(s)).filter(Boolean);
    }

    return match;
  } catch (error) {
    throw new Error(`Job matching failed: ${error.message}`);
  }
};
