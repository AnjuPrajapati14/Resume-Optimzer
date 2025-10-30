import express from 'express';
import pdf from 'html-pdf';
import JobCard from '../models/JobCard.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const jobs = await JobCard.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs', details: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { clientName, companyName, position, jobDescription, jobLink, baseResume } = req.body;
    
    if (!clientName || !companyName || !position || !jobDescription || !jobLink) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const newJob = new JobCard({
      clientName,
      companyName,
      position,
      jobDescription,
      jobLink,
      baseResume: baseResume || undefined // Include baseResume if provided
    });
    
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job', details: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {};
    
    // Allow updating all job fields including baseResume
    const allowedFields = ['clientName', 'companyName', 'position', 'jobDescription', 'jobLink', 'baseResume'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
    
    const updatedJob = await JobCard.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedJob) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job', details: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedJob = await JobCard.findByIdAndDelete(id);
    
    if (!deletedJob) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json({ message: 'Job deleted successfully', deletedJob });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete job', details: error.message });
  }
});

// Helper function to sanitize filename
const sanitizeFileName = (name) => {
  return name.replace(/[^a-zA-Z0-9\s\-_]/g, '').replace(/\s+/g, '_');
};

// Helper function to escape HTML
const escapeHtml = (text) => {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// PDF Download endpoint
router.get('/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query; // 'base' or 'optimized'
    
    const job = await JobCard.findById(id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    let resumeContent;
    let fileName;
    
    if (type === 'base') {
      resumeContent = job.baseResume || 'No base resume available';
      const safeName = sanitizeFileName(`${job.clientName}_${job.companyName}_Base_Resume`);
      fileName = `${safeName}.pdf`;
    } else if (type === 'optimized') {
      if (!job.optimizedResume) {
        return res.status(400).json({ error: 'Optimized resume not available' });
      }
      resumeContent = job.optimizedResume;
      const safeName = sanitizeFileName(`${job.clientName}_${job.companyName}_Optimized_Resume`);
      fileName = `${safeName}.pdf`;
    } else {
      return res.status(400).json({ error: 'Invalid type. Use "base" or "optimized"' });
    }
    
    // Escape HTML content to prevent injection
    const escapedContent = escapeHtml(resumeContent);
    const escapedClientName = escapeHtml(job.clientName);
    const escapedPosition = escapeHtml(job.position);
    const escapedCompanyName = escapeHtml(job.companyName);
    
    // Create HTML content for the resume (clean, only resume content)
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Resume</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.8;
              margin: 40px 50px;
              color: #333;
              font-size: 16px;
            }
            .resume-content {
              white-space: pre-wrap;
              font-size: 16px;
              line-height: 1.8;
              font-family: Arial, sans-serif;
            }
            h1, h2, h3 {
              margin-top: 0;
              margin-bottom: 0.5em;
            }
            p {
              margin-bottom: 1em;
            }
          </style>
        </head>
        <body>
          <div class="resume-content">${escapedContent}</div>
        </body>
      </html>
    `;
    
    // Configure PDF options
    const options = {
      format: 'A4',
      orientation: 'portrait',
      border: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      },
      type: 'pdf',
      quality: '100'
    };
    
    // Generate PDF using html-pdf
    pdf.create(htmlContent, options).toBuffer((err, buffer) => {
      if (err) {
        console.error('PDF generation error:', err);
        return res.status(500).json({ error: 'Failed to generate PDF', details: err.message });
      }
      
      // Set proper headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Length', buffer.length);
      res.setHeader('Cache-Control', 'no-cache');
      
      res.send(buffer);
    });
    
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
  }
});

export default router;