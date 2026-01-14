# SkillConnect Kerala

<div align="center">

![SkillConnect](https://img.shields.io/badge/SkillConnect-Kerala-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

**A production-ready platform connecting verified skilled workers with employers in Kerala's Tier 2 & 3 cities.**

[Live Demo](#) • [Documentation](#api-endpoints) • [Report Bug](#support) • [Request Feature](#support)

</div>

---

## 🚀 Overview

**SkillConnect Kerala** bridges the gap between skilled workers and employers by providing a transparent, AI-powered platform that eliminates middlemen and ensures fair opportunities for all.

### ✨ Key Features

| For Workers | For Employers | AI-Powered |
|-------------|---------------|------------|
| ✅ Create verified profiles | ✅ Post jobs & find workers | 🎯 Smart job-worker matching |
| ✅ Get AI job recommendations | ✅ AI-powered candidate matching | 📊 Skill gap analysis |
| ✅ Track applications | ✅ Real-time messaging | 💰 Salary intelligence |
| ✅ Build reputation via reviews | ✅ Review & rating system | ✍️ Content enhancement |
| ✅ Certificate verification | ✅ Application management | 💬 24/7 AI assistant |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Zustand |
| **Backend** | Node.js, Express, MongoDB Atlas, Socket.io |
| **AI** | Groq (Llama 3.3 70B) for intelligent recommendations |
| **Real-time** | Socket.io for chat and notifications |
| **Security** | JWT, bcrypt, Helmet, CORS, Rate Limiting |

---

## 📁 Project Structure

```
skillconnect/
├── backend/                 # Node.js/Express API
│   ├── controllers/        # Route controllers
│   ├── models/            # Mongoose models (User, Worker, Job, etc.)
│   ├── routes/            # API routes
│   ├── middleware/        # Auth, error handling, uploads
│   ├── services/          # Business logic (AI service)
│   ├── utils/             # Utility functions (sanitization)
│   └── server.js          # Entry point
│
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── layouts/       # Layout components (Main, Dashboard)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   └── store/         # Zustand state management
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Groq API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd proto
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb+srv://your_connection_string
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=http://localhost:5173
   GROQ_API_KEY=your_groq_api_key
   ```

4. **Start Backend Server**
   ```bash
   npm start
   ```

5. **Setup Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

---

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | User login | Public |
| GET | `/api/auth/me` | Get current user | Protected |
| PUT | `/api/auth/update-profile` | Update profile | Protected |
| PUT | `/api/auth/update-password` | Change password | Protected |

### Workers
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/workers` | List all workers | Public |
| GET | `/api/workers/search` | Search workers | Public |
| GET | `/api/workers/:id` | Get worker profile | Public |
| PUT | `/api/workers/profile` | Update worker profile | Worker |
| POST | `/api/workers/certificate` | Upload certificate | Worker |
| POST | `/api/workers/portfolio` | Add portfolio item | Worker |

### Jobs
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/jobs` | List all jobs | Public |
| GET | `/api/jobs/search` | Search jobs | Public |
| GET | `/api/jobs/:id` | Get job details | Public |
| POST | `/api/jobs` | Create new job | Employer |
| PUT | `/api/jobs/:id` | Update job | Employer |
| POST | `/api/jobs/:id/apply` | Apply to job | Worker |

### AI Features
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/ai/recommendations/jobs` | Get job recommendations | Protected |
| POST | `/api/ai/recommendations/workers` | Get worker recommendations | Protected |
| POST | `/api/ai/enhance` | Enhance text content | Protected |
| POST | `/api/ai/chat` | AI assistant chat | Protected |
| POST | `/api/ai/analyze-skills` | Skill gap analysis | Protected |
| POST | `/api/ai/salary-estimate` | Get salary estimate | Protected |

---

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Rate Limiting** - API request throttling
- **Input Sanitization** - NoSQL injection prevention
- **Helmet Headers** - Security HTTP headers
- **CORS Configuration** - Cross-origin protection

---

## 🧪 Test Credentials

For testing the application:

| Role | Email | Password |
|------|-------|----------|
| Employer | 00kailas000@gmail.com | password |
| Worker | kailas62827@gmail.com | password |
| Test User | test@example.com | password123 |

---

## 📧 Support

For questions or issues:

- **Email**: kailas62827@gmail.com
- **Phone**: +91 6282766374
- **Location**: Kottayam, Kerala

---

## 📄 License

MIT License - feel free to use this project for your own purposes.

---

<div align="center">

**Made with ❤️ in Kerala for Kerala's skilled workers and employers**

</div>
