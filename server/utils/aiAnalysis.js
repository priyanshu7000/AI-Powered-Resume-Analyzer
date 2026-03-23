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

    const prompt = `Analyze the following resume and provide a structured JSON response with the following fields:
    - skills: array of identified skills
    - missingSkills: array of common in-demand skills not found
    - atsScore: score from 0-100 indicating how ATS-friendly the resume is
    - suggestions: array of improvement suggestions
    
    Resume text:
    ${resumeText}
    
    Respond with valid JSON only, no markdown or extra text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();
    const analysis = extractAndParseJSON(content);

    // Validate and normalize response structure
    if (!analysis.skills || !Array.isArray(analysis.skills)) {
      analysis.skills = [];
    } else {
      // Ensure all skills are strings
      analysis.skills = analysis.skills.map(s => String(s)).filter(Boolean);
    }

    if (!analysis.missingSkills || !Array.isArray(analysis.missingSkills)) {
      analysis.missingSkills = [];
    } else {
      // Ensure all missing skills are strings
      analysis.missingSkills = analysis.missingSkills.map(s => String(s)).filter(Boolean);
    }

    // Validate ATS score is a number between 0-100
    if (typeof analysis.atsScore !== 'number') {
      const score = parseInt(analysis.atsScore);
      analysis.atsScore = isNaN(score) ? 50 : score;
    }
    analysis.atsScore = Math.min(100, Math.max(0, analysis.atsScore));

    if (!analysis.suggestions || !Array.isArray(analysis.suggestions)) {
      analysis.suggestions = [];
    } else {
      // Ensure all suggestions are strings
      analysis.suggestions = analysis.suggestions.map(s => String(s)).filter(Boolean);
    }

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
