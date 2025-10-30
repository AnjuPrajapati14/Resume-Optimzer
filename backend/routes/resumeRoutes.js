import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import JobCard from '../models/JobCard.js';
dotenv.config();

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateOptimizedResume(baseResume, jobDescription) {
  const prompt = `You are a professional resume optimizer. Given the job description and the base resume below, rewrite the resume to match the job description by improving keywords, phrasing, and tone. Make it ATS-friendly and compelling.

Job Description:
${jobDescription}

Base Resume:
${baseResume}

Return only the optimized resume text without any additional commentary.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
      temperature: 0.7
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

function generateChangesSummary(baseResume, optimizedResume) {
  const baseLength = baseResume.length;
  const optimizedLength = optimizedResume.length;
  const lengthChange = optimizedLength - baseLength;
  
  let summary = "Optimized resume with the following improvements: ";
  
  if (lengthChange > 50) {
    summary += "expanded content with relevant details, ";
  } else if (lengthChange < -50) {
    summary += "condensed content for better readability, ";
  }
  
  summary += "enhanced keywords for ATS compatibility, ";
  summary += "improved formatting and professional language, ";
  summary += "tailored experience descriptions to match job requirements.";
  
  return summary;
}

router.post('/optimize/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const job = await JobCard.findById(id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    await JobCard.findByIdAndUpdate(id, { status: 'Optimizing' });
    
    const optimizedResume = await generateOptimizedResume(job.baseResume, job.jobDescription);
    const changesSummary = generateChangesSummary(job.baseResume, optimizedResume);
    
    const updatedJob = await JobCard.findByIdAndUpdate(
      id,
      {
        status: 'Optimized',
        optimizedOn: new Date(),
        optimizedResume,
        changesSummary
      },
      { new: true }
    );
    
    res.json({
      success: true,
      optimizedResume,
      changesSummary,
      job: updatedJob
    });
    
  } catch (error) {
    await JobCard.findByIdAndUpdate(req.params.id, { status: 'Pending Optimization' });
    res.status(500).json({ 
      error: 'Failed to optimize resume', 
      details: error.message 
    });
  }
});

export default router;