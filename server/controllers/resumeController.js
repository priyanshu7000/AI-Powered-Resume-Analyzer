import {
  uploadResume,
  analyzeResume,
  getUserResumes,
  getResumeById,
  deleteResume,
} from '../services/resumeService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload a PDF file',
    });
  }

  const resume = await uploadResume(req.userId, req.file);

  res.status(201).json({
    success: true,
    message: 'Resume uploaded successfully',
    resume,
  });
});

export const analyzeResumeController = asyncHandler(async (req, res) => {
  const { resumeId } = req.params;

  const resume = await analyzeResume(resumeId, req.userId);

  res.status(200).json({
    success: true,
    message: 'Resume analyzed successfully',
    resume,
  });
});

export const getResumes = asyncHandler(async (req, res) => {
  const resumes = await getUserResumes(req.userId);

  res.status(200).json({
    success: true,
    count: resumes.length,
    resumes,
  });
});

export const getResume = asyncHandler(async (req, res) => {
  const { resumeId } = req.params;

  const resume = await getResumeById(resumeId, req.userId);

  res.status(200).json({
    success: true,
    resume,
  });
});

export const deleteResumeController = asyncHandler(async (req, res) => {
  const { resumeId } = req.params;

  const result = await deleteResume(resumeId, req.userId);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});
