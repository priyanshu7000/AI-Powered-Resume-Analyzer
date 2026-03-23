import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    resumeText: {
      type: String,
      required: true,
    },
    extractedSkills: [
      {
        type: String,
      },
    ],
    atsScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    suggestions: [
      {
        type: String,
      },
    ],
    missingSkills: [
      {
        type: String,
      },
    ],
    analyzed: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Resume', resumeSchema);
