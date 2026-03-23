import { validateJobMatch } from '../middleware/validation.js';
import {
  createJobMatch,
  getUserJobMatches,
  getJobMatchById,
  deleteJobMatch,
} from '../services/jobMatchService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const matchJob = asyncHandler(async (req, res) => {
  const { error, value } = validateJobMatch(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  const jobMatch = await createJobMatch(
    req.userId,
    value.resumeId,
    value.jobTitle,
    value.jobDescription
  );

  res.status(201).json({
    success: true,
    message: 'Job match created successfully',
    jobMatch,
  });
});

export const getJobMatches = asyncHandler(async (req, res) => {
  const matches = await getUserJobMatches(req.userId);

  res.status(200).json({
    success: true,
    count: matches.length,
    matches,
  });
});

export const getJobMatch = asyncHandler(async (req, res) => {
  const { jobMatchId } = req.params;

  const match = await getJobMatchById(jobMatchId, req.userId);

  res.status(200).json({
    success: true,
    match,
  });
});

export const deleteJobMatchController = asyncHandler(async (req, res) => {
  const { jobMatchId } = req.params;

  const result = await deleteJobMatch(jobMatchId, req.userId);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});
