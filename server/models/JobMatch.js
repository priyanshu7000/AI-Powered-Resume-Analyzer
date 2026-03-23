import mongoose from 'mongoose';

const jobMatchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    missingKeywords: [
      {
        type: String,
      },
    ],
    suggestions: [
      {
        type: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('JobMatch', jobMatchSchema);
