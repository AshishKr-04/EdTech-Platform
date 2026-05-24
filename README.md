# 🎓 EduMind – Premium Full-Stack MERN EdTech Platform  

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Demo-646CFF?style=for-the-badge&logo=vercel&logoColor=white)](https://ed-tech-platform-livid.vercel.app/)
[![Render Backend](https://img.shields.io/badge/Render-Active%20API-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://edtech-platform-w9sg.onrender.com)
[![Testing Coverage](https://img.shields.io/badge/Tests-23%20Passed-emerald?style=for-the-badge&logo=vitest&logoColor=white)](#-running-automated-tests)
[![Production Hardened](https://img.shields.io/badge/Security-Hardened-rose?style=for-the-badge&logo=express&logoColor=white)](#-enterprise-grade-security-suite)

---

### 🌐 Live Deployments

> [!TIP]
> Click any of the interactive deployment links below to inspect the production gates instantly:
> * 💻 **Frontend Live App:** [https://ed-tech-platform-livid.vercel.app/](https://ed-tech-platform-livid.vercel.app/)
> * ⚙️ **Backend API Service:** [https://edtech-platform-w9sg.onrender.com](https://edtech-platform-w9sg.onrender.com)

---

EduMind is an **industry-grade, full-stack MERN EdTech platform** engineered to deliver secure, interactive, and high-fidelity online learning. 

Featuring **production-grade security suites**, **Zod-backed request validations**, **automated cryptographic digital certificates**, a **context-aware AI Study Partner (Gemini API)**, **flexible Stripe & sandbox payment gateways**, and a **23-case automated integration testing suite**, this codebase stands as a premier software engineering benchmark.

---

## 🎨 Premium Key Features  

### 🔒 Enterprise-Grade Security Suite
* **Production Hardening:** Integrated `helmet` to manage HTTP security headers and guard against common vulnerabilities.
* **Rate Limiters:** Deployed centralized IP-based rate limiting via `express-rate-limit` protecting authentication routes (`/api/auth`) from brute force and global endpoints from DDoS attacks.
* **Strict CORS Constraints:** Deployed dynamic, environment-driven CORS configurations allowing only authorized client origins in production while supporting local testing environments.
* **Zero Password Leaks:** Enforced `select: false` on Mongoose password fields, equipped with explicit model overrides to ensure password hashes never leak into JSON registers, logins, or user updates.
* **Centralized Operational Error Model:** Deployed standard operational error handling (`AppError.js` and `errorHandler.js`) that safely masks stack traces in production while providing informative, structured JSON error responses.

### 💳 Stripe & Sandbox Payment Gateways
* **Stripe Integration:** Active Checkout Sessions constructing billing intents, backed by a **cryptographic Stripe Webhook listener** (`stripe.webhooks.constructEvent`) supporting secure server-to-server transaction callbacks.
* **Resilient Sandbox Simulator:** Automatically activates a visual billing simulator page if Stripe keys are inactive, supporting mock credit card validation checks and processing spinners.
* **Anti-Piracy Content Lock:** Public endpoints (`GET /api/courses/:id`) return only syllabus outlines, stripping out all private videos and lecture notes. Full courses are unlocked exclusively for enrolled students via a secure learning pathway.

### 🤖 Context-Aware AI Study Partner (Gemini API)
* Integrated a togglable chat interface inside the learning player.
* Employs Gemini models to act as a context-aware classroom tutor, referencing the active lesson outline, video details, and lecture notes to answer questions, compile quizzes, and explain complex topics.
* Operates a resilient mock fallback system in local sandbox testing if API keys are missing.

### 🏆 Cryptographic Digital Certificates
* Automatically issues verifiable digital certificates when a student completes **100% of the lessons** in a course.
* Generates a unique **SHA-256 HMAC signature** using a server-side cryptographic salt, ensuring credentials are completely tamper-proof, verifiable, and secure.
* Displays certified signatures and copyable verification hashes on the user's dashboard.

### 🧪 Robust 23-Case Integration Testing Suite
* Deployed **23 comprehensive integration tests** using `vitest` and `supertest` executing on an isolated local `mongodb-memory-server` database instance, achieving 100% pass rates across:
  * Register & Login flows (guaranteeing zero password hash leaks)
  * Course creations, updates, and unauthorized access rejections
  * Idempotent manual/stripe enrollments and `studentsCount` tracking
  * Completed lesson progress saves and out-of-bounds validations
  * Cryptographic certificate automated generations and secure retrievals

---

## 🛠️ Technology Stack  

| Layer | Technology | Icons |
| :--- | :--- | :--- |
| **Frontend** | React (v19), Vite, TailwindCSS (v3), Lucide React, Axios, Framer Motion | ![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css) ![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite) |
| **Backend** | Node.js (v22), Express, Helmet, Express Rate Limit, BcryptJS, JWT | ![Node.js](https://img.shields.io/badge/Node-22-green?style=flat-square&logo=node.js) ![Express](https://img.shields.io/badge/Express-5-grey?style=flat-square&logo=express) |
| **Database** | MongoDB Atlas, Mongoose ODM, MongoDB Memory Server (Tests) | ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?style=flat-square&logo=mongodb) |
| **Testing** | Vitest, Supertest, Jest Globals | ![Vitest](https://img.shields.io/badge/Vitest-4-yellow?style=flat-square&logo=vitest) |

---

## 📂 Project Structure  

```bash
EdTech-Platform/
│
├── client-vite/              # Modern React Frontend (Vite)
│   ├── src/
│   │   ├── components/       # Premium Navigation, Footer & Protected Guards
│   │   ├── context/          # Auth Context & Stacking Global Toast Alerts
│   │   ├── pages/            # Syllabus Catalog, Profile Dashboards, checkout simulator, player
│   │   ├── utils/            # Axios API intercepts
│   │   └── main.jsx          # Entry point mounting global Providers
│   ├── .env                  # Client-side endpoints configuration
│   └── package.json
│
├── server-new/               # Production-grade Node.js Backend
│   ├── middleware/           # JWT authentications, Zod validations, centralized errors
│   ├── models/               # Enriched Course, User, and Order Mongoose Schemas
│   ├── routes/               # Secured Authentication, payments, progress, upload endpoints
│   ├── tests/                # 23-case automated integration suite (Vitest)
│   ├── utils/                # Sanitized Zod validation schemas
│   ├── .env                  # Cryptographic salts and MongoDB URIs
│   └── server.js             # Server constructor capturing raw buffers for Webhooks
```

---

## 🚀 Step-by-Step Local Setup & Execution

### Prerequisites
* **Node.js:** Ensure Node.js (v18 or higher) is installed on your system.
* **MongoDB:** You will need an active MongoDB Atlas cluster or a running local MongoDB daemon.

---

### Backend Setup (`server-new`)

1. Navigate to the backend directory:
   ```bash
   cd server-new
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your environment. Create a `.env` file inside `server-new/`:
   ```env
   MONGO_URI="your_mongodb_atlas_connection_string"
   JWT_SECRET="your_cryptographic_jwt_signing_key"
   CERTIFICATE_SALT="your_secure_hash_certificate_salt"
   
   # Optional Stripe Credentials:
   # STRIPE_SECRET_KEY="sk_test_..."
   # STRIPE_WEBHOOK_SECRET="whsec_..."
   ```
4. Start the backend developer server:
   ```bash
   npm run dev
   ```
   *The API will run locally on **`http://localhost:5000/api`***

---

### Frontend Setup (`client-vite`)

1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd client-vite
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your local client-side environment. Create a `.env` file inside `client-vite/`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Launch the local dev server:
   ```bash
   npm run dev
   ```
   *The client interface will run locally on **`http://localhost:5173`***

---

## 🧪 Running Automated Tests

To run the complete **23-case integration test suite** inside a local memory-sandboxed MongoDB context:

1. Navigate to the backend folder:
   ```bash
   cd server-new
   ```
2. Run the tests:
   ```bash
   npm test
   ```
3. To run in interactive watch mode:
   ```bash
   npm run test:watch
   ```
