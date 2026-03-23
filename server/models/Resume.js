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
    atsBreakdown: {
      formatting: { type: Number, min: 0, max: 100 },
      keywordOptimization: { type: Number, min: 0, max: 100 },
      structure: { type: Number, min: 0, max: 100 },
      length: { type: Number, min: 0, max: 100 },
      readability: { type: Number, min: 0, max: 100 },
    },
    skillCategories: {
      technical: [String],
      softSkills: [String],
      tools: [String],
      languages: [String],
    },
    skillProficiency: [
      {
        skill: String,
        category: String,
        proficiencyLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] },
        yearsOfExperience: Number,
      },
    ],
    suggestions: [
      {
        type: String,
      },
    ],
    categorizedSuggestions: {
      highImpact: [
        {
          title: String,
          description: String,
          category: String, // formatting, content, skills, structure
        },
      ],
      mediumImpact: [
        {
          title: String,
          description: String,
          category: String,
        },
      ],
      lowImpact: [
        {
          title: String,
          description: String,
          category: String,
        },
      ],
    },
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
