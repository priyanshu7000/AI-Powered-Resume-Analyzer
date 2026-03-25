import Resume from '../models/Resume.js';
import { extractTextFromPDF, validatePDFBuffer } from '../utils/pdfParser.js';
import { analyzeResumeWithAI } from '../utils/aiAnalysis.js';

export const uploadResume = async (userId, file) => {
  validatePDFBuffer(file.buffer);

  // Extract text from PDF
  const resumeText = await extractTextFromPDF(file.buffer);
  if (!resumeText || resumeText.trim().length === 0) {
    throw new Error('Failed to extract text from PDF');
  }

  // Create resume record
  const resume = await Resume.create({
    userId,
    fileName: file.originalname,
    resumeText: resumeText.substring(0, 50000), // Limit to 50k chars for DB
    analyzed: false,
  });

  return resume;
};

export const analyzeResume = async (resumeId, userId) => {
  console.log(`[Resume Service] Starting analysis for resume: ${resumeId}`);
  
  const resume = await Resume.findById(resumeId);
  if (!resume) {
    throw new Error('Resume not found');
  }

  if (resume.userId.toString() !== userId.toString()) {
    throw new Error('Not authorized to analyze this resume');
  }

  console.log(`[Resume Service] Resume text length: ${resume.resumeText.length} chars`);
  console.log(`[Resume Service] Calling AI analysis...`);

  try {
    // Call AI analysis - with detailed timing
    const startTime = Date.now();
    const analysis = await analyzeResumeWithAI(resume.resumeText);
    const analysisDuration = Date.now() - startTime;
    
    console.log(`[Resume Service] ✓ AI analysis completed in ${analysisDuration}ms`);
    console.log(`[Resume Service] ATS Score: ${analysis.atsScore}`);

    // Update resume with analysis - STRICT: Use ONLY AI provided data
    resume.extractedSkills = analysis.skills;
    resume.missingSkills = analysis.missingSkills;
    resume.atsScore = analysis.atsScore;
    resume.atsBreakdown = analysis.atsBreakdown;
    resume.skillCategories = analysis.skillCategories;
    resume.skillProficiency = analysis.skillProficiency;
    resume.suggestions = analysis.suggestions;
    resume.categorizedSuggestions = analysis.categorizedSuggestions;
    resume.analyzed = true;

    await resume.save();
    console.log(`[Resume Service] ✓ Resume saved to database`);
    
    return resume;
  } catch (error) {
    console.error(`[Resume Service] ✗ Analysis failed:`, error.message);
    console.error(`[Resume Service] Error details:`, error);
    throw new Error(`Resume analysis failed: ${error.message}`);
  }
};

export const getUserResumes = async (userId) => {
  const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });
  return resumes;
};

export const getResumeById = async (resumeId, userId) => {
  const resume = await Resume.findById(resumeId);
  if (!resume) {
    throw new Error('Resume not found');
  }

  if (resume.userId.toString() !== userId.toString()) {
    throw new Error('Not authorized to access this resume');
  }

  return resume;
};

export const deleteResume = async (resumeId, userId) => {
  const resume = await Resume.findById(resumeId);
  if (!resume) {
    throw new Error('Resume not found');
  }

  if (resume.userId.toString() !== userId.toString()) {
    throw new Error('Not authorized to delete this resume');
  }

  await Resume.findByIdAndDelete(resumeId);
  return { message: 'Resume deleted successfully' };
};
