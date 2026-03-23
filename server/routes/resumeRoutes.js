import express from 'express';
import upload from '../middleware/fileUpload.js';
import { protect } from '../middleware/auth.js';
import {
  createResume,
  analyzeResumeController,
  getResumes,
  getResume,
  deleteResumeController,
} from '../controllers/resumeController.js';

const router = express.Router();

/**
 * @swagger
 * /api/resume/upload:
 *   post:
 *     summary: Upload a resume PDF
 *     tags: [Resume]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Resume uploaded successfully
 *       400:
 *         description: Invalid file
 */
router.post('/upload', protect, upload.single('file'), createResume);

/**
 * @swagger
 * /api/resume/analyze/{resumeId}:
 *   post:
 *     summary: Analyze resume with AI
 *     tags: [Resume]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resumeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resume analyzed successfully
 *       404:
 *         description: Resume not found
 */
router.post('/analyze/:resumeId', protect, analyzeResumeController);

/**
 * @swagger
 * /api/resume:
 *   get:
 *     summary: Get all resumes for user
 *     tags: [Resume]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of resumes
 */
router.get('/', protect, getResumes);

/**
 * @swagger
 * /api/resume/{resumeId}:
 *   get:
 *     summary: Get specific resume
 *     tags: [Resume]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resumeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resume details
 *       404:
 *         description: Resume not found
 */
router.get('/:resumeId', protect, getResume);

/**
 * @swagger
 * /api/resume/{resumeId}:
 *   delete:
 *     summary: Delete resume
 *     tags: [Resume]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resumeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resume deleted
 *       404:
 *         description: Resume not found
 */
router.delete('/:resumeId', protect, deleteResumeController);

export default router;
