# Flashfire Resume Optimizer Dashboard

A full-stack application that automates resume optimization using OpenAI's GPT-4o-mini API. Built with React + TailwindCSS frontend and Express.js + MongoDB backend.

## 🚀 Features

- **Job Card Management**: Add, edit, and delete job applications
- **AI-Powered Resume Optimization**: Uses OpenAI GPT-4o-mini to tailor resumes to specific job descriptions
- **Real-time Status Updates**: Track optimization progress and view results
- **Side-by-Side Comparison**: Compare original and optimized resumes
- **Responsive Design**: Clean, modern UI built with TailwindCSS

## 🛠 Tech Stack

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **OpenAI API** (gpt-4o-mini model)
- **CORS** enabled for cross-origin requests

### Frontend  
- **React 18** with **Vite**
- **TailwindCSS** for styling
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Lucide React** for icons

## 📁 Project Structure

```
flashfire-assignment/
├── backend/
│   ├── server.js              # Main server file
│   ├── routes/
│   │   ├── jobRoutes.js       # CRUD operations for job cards
│   │   └── resumeRoutes.js    # Resume optimization endpoint
│   ├── models/
│   │   └── JobCard.js         # MongoDB schema
│   ├── .env                   # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main app component
│   │   ├── pages/Dashboard.jsx # Main dashboard page
│   │   ├── components/
│   │   │   ├── JobCard.jsx           # Individual job card
│   │   │   ├── AddJobModal.jsx       # Add/edit job modal
│   │   │   └── ResumeChangesModal.jsx # View changes modal
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas account (or local MongoDB)
- OpenAI API key

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd flashfire-assignment

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install
```

### 2. Environment Configuration

Create `.env` file in the `backend` directory:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/flashfire-assignment
OPENAI_API_KEY=sk-your-openai-api-key-here
PORT=7500
```

**Get your API keys:**
- **MongoDB**: Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
- **OpenAI**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

### 3. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Server runs on http://localhost:7500
```

**Terminal 2 - Frontend:**
```bash
cd frontend  
npm start
# App runs on http://localhost:3000
```

## 📚 API Endpoints

### Job Management
- `GET /api/jobs` - List all job cards
- `POST /api/jobs` - Create new job card
- `PUT /api/jobs/:id` - Update job card
- `DELETE /api/jobs/:id` - Delete job card

### Resume Optimization
- `POST /api/optimize/:id` - Optimize resume for specific job

### Health Check
- `GET /api/health` - Server status

## 🔄 How It Works

1. **Add Job Card**: Fill in client details, company, position, job description, and application link
2. **Optimize Resume**: Click "Optimize Resume" to trigger AI processing
3. **AI Processing**: OpenAI analyzes the job description and optimizes the base resume
4. **Auto-Update**: Job status changes to "Optimized" with timestamp and changes summary
5. **View Changes**: Compare original vs optimized resume side-by-side

## 🎯 Core Features Breakdown

### Dashboard Component (`Dashboard.jsx`)
- Fetches and displays all job cards
- Manages state for modals and optimization status
- Handles CRUD operations and API calls

### Job Card Component (`JobCard.jsx`)  
- Displays individual job information in table format
- Shows status badges with appropriate colors and icons
- Action buttons for optimize, edit, delete, and view changes

### Add Job Modal (`AddJobModal.jsx`)
- Form for creating new job cards
- Supports editing existing job cards
- Form validation and submission handling

### Resume Changes Modal (`ResumeChangesModal.jsx`)
- Side-by-side comparison of original and optimized resumes
- Displays AI-generated changes summary
- Scrollable content areas for long resumes

## 🤖 AI Integration Details

The resume optimization uses OpenAI's `gpt-4o-mini` model with this prompt strategy:

```javascript
const prompt = `You are a professional resume optimizer. Given the job description and the base resume below, rewrite the resume to match the job description by improving keywords, phrasing, and tone. Make it ATS-friendly and compelling.

Job Description: ${jobDescription}
Base Resume: ${baseResume}

Return only the optimized resume text without any additional commentary.`;
```

## 🚦 Status Flow

1. **Pending Optimization** → Default state for new jobs
2. **Optimizing** → Temporary state during AI processing  
3. **Optimized** → Final state with optimized resume and changes summary

## 🔧 Development Notes

- Frontend uses Vite for fast development builds
- Backend uses ES modules (type: "module")
- CORS is configured for local development
- Error handling with user-friendly toast notifications
- Responsive design works on desktop and mobile

## 🚀 Production Deployment

### Backend (Render/Railway)
1. Create new web service
2. Connect GitHub repository  
3. Set environment variables
4. Deploy from `backend` folder

### Frontend (Vercel/Netlify)
1. Create new project
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Update API URL in Dashboard.jsx

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Open pull request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using React, Express, MongoDB, and OpenAI