# Onkur. ˙✧˖°🎓 ༘⋆｡ °


<img width="1440" height="900" alt="Screen Shot 2026-11-24 at 9 49 18 PM" src="https://github.com/user-attachments/assets/87628a46-fc93-4415-afe0-6fd4f2af143c" />



<p align="center">An AI-powered student career development platform</p>

<p align="center">Onkur is a student-focused platform designed to help students explore academic opportunities, discover career paths, develop practical skills, and connect with a learning community. Built with a focus on students in Bangladesh, Onkur brings academic exploration, career guidance, personal development, and community interaction together in one place.</p>




> **Current scope:** Onkur is currently built for students. Dedicated features and access for mentors and companies are planned for future releases.


## 1. Key Features 

### 𑣲 Discover
- **University Explorer:** Explore local and international universities, search and filter options, and compare opportunities.
- **AI University Matching:** Get university recommendations based on academic interests, preferred countries, study level, budget, and scholarship preferences.
- **Career Explorer:** Explore different career paths and discover careers that align with your interests, strengths, and work preferences.

### ⋆.˚໑ ݁༝ ۫ ׅ Develop
- **AI Student Profile Analyzer:** Get AI-assisted insights based on your student profile.
- **Personalized Learning Paths:** Explore learning paths, track completed skills, and monitor development progress.
- **Career Exploration:** Understand the skills and learning steps associated with different career paths.

### ⭑.ᐟ Connect
- **Student Community:** Create, view, edit, delete, and interact with community posts.
- **Onkur AI Assistant:** Get AI-powered assistance and guidance through an interactive chat experience.

### Account & Security
- Student registration and login.
- Protected student dashboard and authenticated pages.
- Secure password hashing and JWT-based authentication.
- Resource ownership checks for community posts.
- Audit logging for successful and denied access attempts.



## 2. Technology Stack

| Area | Technologies |
|---|---|
| Frontend Framework | Next.js 16, React 19 |
| Frontend Language | JavaScript |
| Styling | CSS, Tailwind CSS 4 |
| Icons | Lucide React |
| Backend | Node.js, Express.js 5 |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JSON Web Tokens (JWT), HTTP cookies |
| Password Security | bcryptjs |
| AI Integration | Google Gemini API |
| Backend Security | Helmet, CORS, Express Rate Limit |
| API Communication | REST API |
| Version Control | Git and GitHub |



## 3. System Architecture

Onkur follows a full-stack architecture:

- **Frontend:** Next.js and React handle the user interface, navigation, and client-side interactions.
- **Backend:** Express.js provides REST API endpoints and handles application logic, authentication, authorization, and AI requests.
- **Database:** MongoDB Atlas stores student accounts, profile information, community posts, and audit logs.
- **AI Services:** Google Gemini powers the AI Student Profile Analyzer and Onkur AI Assistant.

The frontend communicates with the backend through API requests, while the backend manages database operations and external AI requests.



## 4. Project Structure

```text
Onkur/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   ├── communityController.js
│   │   └── dashboardController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── AuditLog.js
│   │   ├── CommunityPost.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── communityRoutes.js
│   │   └── dashboardRoutes.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── public/
│
├── src/
│   └── app/
│       ├── analyzer/
│       ├── careers/
│       ├── components/
│       ├── connect/
│       ├── dashboard/
│       ├── data/
│       ├── develop/
│       ├── login/
│       ├── signup/
│       ├── universities/
│       ├── AIAssistant.js
│       ├── globals.css
│       ├── layout.js
│       └── page.js
│
├── .gitignore
├── package.json
└── README.md
```


## 5. Getting Started

Follow these instructions to run Onkur locally.

### Prerequisites

Make sure you have installed:

- Node.js (20.9 or later recommended)
- npm
- Git
- A MongoDB Atlas account
- A Google Gemini API key

### Step 1: Clone the repository

```bash
git clone https://github.com/saamiaaa/Onkur.git
cd Onkur
```

### Step 2: Install frontend dependencies

From the project root:

```bash
npm install
```

### Step 3: Install backend dependencies

```bash
cd backend
npm install
```

Return to the project root when needed:

```bash
cd ..
```


## 6. Environment Variables

Onkur requires environment variables for frontend API communication, database connectivity, authentication, and AI integration.

### Frontend configuration

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend configuration

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:3000
```

**Environment variable descriptions:**

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API URL used by the frontend |
| `PORT` | Port used by the Express server |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used to sign and verify authentication tokens |
| `GEMINI_API_KEY` | Google Gemini API key for AI features |
| `CLIENT_URL` | Frontend origin allowed by backend CORS |



## 7. Running the Application

Onkur has two separate development servers. Run them in two terminal windows.

### Terminal 1 — Backend

```bash
cd Onkur/backend
npm run dev
```

The backend runs at:

`http://localhost:5000`

API health check:

`http://localhost:5000/api/health`

### Terminal 2 — Frontend

From the project root:

```bash
npm run dev
```

Open the application at:

`http://localhost:3000`



## 8. API Overview

The backend exposes the following API route groups:

| Route | Responsibility |
|---|---|
| `/api/auth` | Student registration, login, logout, and profile management |
| `/api/dashboard` | Student dashboard and development data |
| `/api/community` | Community posts and interactions |
| `/api/ai` | AI Student Profile Analyzer and AI Assistant |

The backend also provides `/api/health` to check whether the API server is running.



## 9. Advanced Technical Implementations

Onkur implements two advanced technical challenges from the HACK THE VIBE 2026 problem statement.

### A02 — Intelligent Decisions & Optimization

Implemented through Onkur's university matching system.

- Evaluates student preferences and academic interests.
- Uses multiple criteria to calculate university match scores.
- Considers preferred countries, study level, budget, and scholarship preferences.
- Avoids misleading comparisons between incompatible currencies and budget periods.
- Provides match reasons to make recommendations more understandable.

### A03 — Advanced Security & Access Control

Implemented through resource-level authorization and audit logging.

- Authenticated access to protected community operations.
- Ownership verification before editing or deleting posts.
- Prevents users from modifying another student's restricted resources.
- Supports administrative moderation.
- Records successful and denied actions in an audit log.

These implementations are designed to demonstrate actual system behavior, not just interface-level functionality.



## 10. Deployment

The project is structured for separate frontend and backend deployment:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

Live: 



## 11. Future Scope

Onkur is currently focused on building a useful student experience. Future development may expand the platform to include:

- Dedicated mentor accounts and mentorship features.
- Company accounts and student recruitment opportunities.
- Mentor-student interaction and guidance.
- Company-student collaboration and internship opportunities.
- More personalized learning and career development tools.

These features are planned for future releases and are not part of the current student-focused version. The current version is built exclusively for the hackathon.



## 12. Repository

**GitHub:** [https://github.com/saamiaaa/Onkur](https://github.com/saamiaaa/Onkur)


<p align="center">────୨ৎ────</p>


<p align="center">Onkur — helping students discover opportunities, develop their potential, and connect with their future ᥫ᭡.ִֶָ𓂃</p>
