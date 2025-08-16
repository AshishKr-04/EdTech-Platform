# 🎓 Edu Mind – Modern MERN EdTech Platform  

![GitHub repo size](https://img.shields.io/github/repo-size/AshishKr-04/EdTech-Platform?color=blue&style=for-the-badge)  
![GitHub contributors](https://img.shields.io/github/contributors/AshishKr-04/EdTech-Platform?color=green&style=for-the-badge)  
![GitHub last commit](https://img.shields.io/github/last-commit/AshishKr-04/EdTech-Platform?color=red&style=for-the-badge)  


Edu Mind is a **full-stack MERN EdTech platform** designed to revolutionize online learning 🚀.  
It bridges the gap between **students** and **instructors** by providing tools for **course creation, learning, and payments** — all in one modern, responsive platform.  

---

## 🎯 Vision & Motivation  

Traditional learning platforms are often expensive or lack flexibility. **Edu Mind** was built with the goal of:  
- 🌍 Making education more **accessible & affordable**.  
- 🧑‍🏫 Empowering **instructors** to create and monetize content.  
- 📚 Helping **students** learn at their own pace with interactive tools.  

---

## ✨ Features  

- 🔑 **Secure Authentication & Role-based Access** (JWT, bcrypt)  
- 🧑‍🏫 **Instructor Dashboard** to upload, edit, and manage courses  
- 👨‍🎓 **Student Dashboard** with enrolled courses, progress & certificates  
- 🎥 **Video Upload & Streaming** (Cloudinary integration)  
- 💳 **Payment Gateway** (Razorpay/Stripe) for secure transactions  
- 📊 **Analytics & Reports** for course performance  
- 🏆 **Gamification**: badges & certificates  
- 📱 Fully **Responsive Design** with Tailwind CSS  
- 🌐 **API-first architecture** for scalability  

---

## 🛠️ Tech Stack  

**Frontend** ⚡  
![React](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react)  
![Redux](https://img.shields.io/badge/State-Redux-purple?style=for-the-badge&logo=redux)  
![TailwindCSS](https://img.shields.io/badge/UI-TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css)  
![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF?style=for-the-badge&logo=vite)  

**Backend** ⚡  
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=node.js)  
![Express](https://img.shields.io/badge/Framework-Express-lightgrey?style=for-the-badge&logo=express)  

**Database** ⚡  
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?style=for-the-badge&logo=mongodb)  

**Other Tools** ⚡  
![JWT](https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge&logo=jsonwebtokens)  


---

## 🧩 Core Modules  

1. **Authentication & Security**  
   - JWT-based authentication  
   - Password encryption with bcrypt  
   - Role-based access (Student/Instructor/Admin)  

2. **Course Management**  
   - Instructors can create, update, and delete courses  
   - Upload videos, notes, and resources  
   - Course categorization & search  

3. **Payments & Monetization**  
   - Razorpay/Stripe integration  
   - Secure checkout flow  
   - Course purchase history  

4. **Dashboards**  
   - Student: enrolled courses, progress tracker, certificates  
   - Instructor: course analytics, earnings reports  



---

## 📂 Project Structure  

```bash
EdTech-Platform/
│
├── client/                # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI Components
│   │   ├── pages/         # Page-level Components
│   │   ├── redux/         # State Management
│   │   └── App.jsx
│   └── package.json
│
├── server/                # Node.js Backend
│   ├── models/            # Mongoose Models
│   ├── routes/            # Express API Routes
│   ├── controllers/       # Business Logic
│   ├── middleware/        # Authentication, Validation
│   └── server.js
│
├── .gitignore
├── package.json
└── README.md
