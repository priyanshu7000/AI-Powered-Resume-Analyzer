import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  matchJob,
  getJobMatches,
  getJobMatch,
  deleteJobMatchController,
} from '../controllers/jobMatchController.js';

const router = express.Router();

/**
 * @swagger
 * /api/ai/match:
 *   post:
 *     summary: Match resume with job description
 *     tags: [AI]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [resumeId, jobTitle, jobDescription]
 *             properties:
 *               resumeId:
 *                 type: string
 *               jobTitle:
 *                 type: string
 *               jobDescription:
 *                 type: string
 *     responses:
 *       201:
 *         description: Job match created
 *       400:
 *         description: Bad request
 */
router.post('/match', protect, matchJob);

/**
 * @swagger
 * /api/ai/matches:
 *   get:
 *     summary: Get user's job matches
 *     tags: [AI]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of job matches
 */
router.get('/matches', protect, getJobMatches);

/**
 * @swagger
 * /api/ai/matches/{jobMatchId}:
 *   get:
 *     summary: Get specific job match
 *     tags: [AI]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobMatchId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job match details
 */
router.get('/matches/:jobMatchId', protect, getJobMatch);

/**
 * @swagger
 * /api/ai/matches/{jobMatchId}:
 *   delete:
 *     summary: Delete job match
 *     tags: [AI]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobMatchId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job match deleted
 */
router.delete('/matches/:jobMatchId', protect, deleteJobMatchController);

export default router;
