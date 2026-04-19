# CrowdFlow AI – Smart Stadium Experience Platform

> **Smarter Stadium Experiences Powered by AI**

A full-stack production-ready web application that improves physical event experiences at large-scale sporting venues using real-time AI, crowd intelligence, and smart navigation.

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🚪 Smart Gate Entry | AI-powered gate routing to minimize wait times |
| 📊 Live Queue Monitoring | Real-time queue tracking across all facilities |
| 🗺️ Seat Navigation | Turn-by-turn indoor navigation |
| 🔥 Crowd Heatmap | Visual occupancy maps to avoid crowded zones |
| 🆘 Emergency SOS | One-tap alert to stadium security & medical |
| 🤖 AI Assistant | Gemini-powered chatbot for instant answers |
| 📈 Analytics Dashboard | Recharts-powered insights for operators |
| 👨‍💼 Admin Dashboard | Full operational overview for stadium managers |

---

## 🏗️ Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS
- Framer Motion (animations)
- Recharts (analytics charts)
- Lucide React (icons)
- React Router v6
- Firebase Auth + Firestore

**Backend**
- Python FastAPI
- Google Gemini API (AI chat)
- Mock real-time data simulation
- CORS-enabled REST API

**Infrastructure**
- Frontend → Vercel / Firebase Hosting
- Backend → Google Cloud Run
- Database → Firebase Firestore
- Auth → Firebase Auth

---

## 📁 Project Structure

```
crowdflow-ai/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx        # Landing page nav
│   │   │   │   ├── Sidebar.jsx       # App sidebar
│   │   │   │   └── AppLayout.jsx     # Authenticated layout wrapper
│   │   │   ├── charts/
│   │   │   │   ├── CrowdHeatmap.jsx  # Live heatmap grid
│   │   │   │   └── GateWaitTimes.jsx # Gate wait bar charts
│   │   │   └── ui/
│   │   │       ├── StatCard.jsx      # KPI stat card
│   │   │       └── AlertFeed.jsx     # Live alert list
│   │   ├── hooks/
│   │   │   └── useLiveData.js        # Real-time data simulation (5s interval)
│   │   ├── lib/
│   │   │   ├── firebase.js           # Firebase config
│   │   │   └── AuthContext.jsx       # Auth provider + demo mode
│   │   ├── pages/
│   │   │   ├── Landing.jsx           # Public landing page
│   │   │   ├── Login.jsx             # Split-screen login
│   │   │   ├── Signup.jsx            # Signup with validation
│   │   │   ├── Home.jsx              # Welcome + quick cards
│   │   │   ├── UserDashboard.jsx     # Full user dashboard
│   │   │   ├── AdminDashboard.jsx    # Admin operations view
│   │   │   ├── AIAssistant.jsx       # Gemini chatbot UI
│   │   │   └── Analytics.jsx        # Recharts analytics
│   │   ├── App.jsx                   # Router config
│   │   ├── main.jsx                  # Entry point
│   │   └── index.css                 # Tailwind + custom styles
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── vercel.json
└── backend/
    ├── main.py                       # FastAPI app
    ├── requirements.txt
    ├── Dockerfile
    └── .env.example
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Firebase project 

### Frontend

```bash
cd frontend
cp .env.example .env
# Fill in your Firebase credentials 
npm install
npm run dev
# Opens at http://localhost:3000
```

### Backend

```bash
cd backend
cp .env.example .env
# Add your GEMINI_API_KEY 
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# API at http://localhost:8000
```

---

## 🔐 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** → Email/Password
4. Enable **Firestore Database**
5. Copy config to `frontend/.env`:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

> **Note:** The app works without Firebase using **Demo Mode** — click "Continue as Demo User" on the login page.

---

## 🤖 Gemini API Setup

1. Get API key from [Google AI Studio](https://makersuite.google.com)
2. Add to `backend/.env`:
```env
GEMINI_API_KEY=your_key_here
```

> Without a key, the AI assistant uses built-in smart demo responses.

---

## 🚢 Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build
# Deploy via Vercel CLI or connect GitHub repo
vercel --prod
```

### Backend → Google Cloud Run

```bash
cd backend
gcloud builds submit --tag gcr.io/YOUR_PROJECT/crowdflow-api
gcloud run deploy crowdflow-api \
  --image gcr.io/YOUR_PROJECT/crowdflow-api \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key
```

---

## 🎯 API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/` | Health check |
| GET | `/api/live-data` | All live stadium data |
| GET | `/api/gates` | Gate wait times |
| GET | `/api/zones` | Zone occupancy |
| GET | `/api/food-stalls` | Food stall queues |
| GET | `/api/alerts` | Live alerts |
| GET | `/api/restrooms` | Restroom availability |
| GET | `/api/analytics` | Chart data |
| POST | `/api/chat` | AI assistant (Gemini) |

---

## 📱 Pages

| Route | Page | Auth Required |
|---|---|---|
| `/` | Landing | No |
| `/login` | Login | No |
| `/signup` | Signup | No |
| `/home` | Home | Yes |
| `/dashboard` | User Dashboard | Yes |
| `/admin` | Admin Dashboard | Yes |
| `/assistant` | AI Assistant | Yes |
| `/analytics` | Analytics | Yes |

---

## 🎨 Design System

- **Font**: Sora (display) + DM Sans (body)
- **Primary**: Blue (#3b82f6)
- **Background**: White + Gray-50
- **Cards**: Rounded-2xl, shadow-card
- **Animations**: Framer Motion throughout
- **Theme**: Light, minimal, Apple-inspired

---

## ✅ Testing

This project includes automated frontend testing using Vitest, React Testing Library, and jsdom.

Tests cover:

* App rendering
* UI/component load checks
* Basic route validation

Run tests locally:

```bash
npm run test
```

---

## ♿ Accessibility

CrowdFlow AI follows accessibility best practices:

* Semantic HTML (`header`, `main`, `nav`, `section`)
* ARIA labels on buttons and inputs
* Keyboard-friendly navigation
* Responsive mobile-friendly UI
* Readable layout and contrast

---

## 🔒 Security

Security features implemented:

* Environment variables for Firebase/API keys
* `.env` excluded using `.gitignore`
* Firebase Authentication
* Protected routes
* Input validation
* Backend CORS configuration

---

## ⚡ Efficiency & Performance

Built for performance and scalability:

* Vite for fast builds
* Reusable React components
* Optimized frontend bundle
* FastAPI async backend
* Cloud Run autoscaling deployment

---

## ☁️ Google Services Used

* Google Cloud Run
* Google Cloud Build
* Firebase Authentication
* Firebase Firestore
* Gemini API

---

## 🚀 Deployment Links

* Backend: https://crowdflow-api-310680027900.asia-south1.run.app
* GitHub Repo: https://github.com/Tejal1211/crowdflow-ai


## 📄 License

MIT © 2025 CrowdFlow AI
