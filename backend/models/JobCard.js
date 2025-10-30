import mongoose from 'mongoose';

const jobCardSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  jobLink: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending Optimization', 'Optimizing', 'Optimized'],
    default: 'Pending Optimization'
  },
  optimizedOn: {
    type: Date,
    default: null
  },
  baseResume: {
    type: String,
    default: `John Doe
Software Engineer
Email: john.doe@email.com | Phone: (555) 123-4567

EXPERIENCE
Software Developer at Tech Corp (2022-Present)
- Developed web applications using React and Node.js
- Collaborated with cross-functional teams
- Maintained code quality and documentation

Junior Developer at StartupXYZ (2020-2022)
- Built responsive websites
- Worked with databases and APIs
- Participated in agile development processes

EDUCATION
Bachelor of Science in Computer Science
University of Technology (2016-2020)

SKILLS
- JavaScript, React, Node.js
- HTML, CSS, MongoDB
- Git, Agile methodologies`
  },
  optimizedResume: {
    type: String,
    default: null
  },
  changesSummary: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model('JobCard', jobCardSchema);