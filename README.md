# ✨ Lumina Task - Full-Stack Task Management

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite)](https://vitejs.dev)

An elegant, full-stack task management application built with the **MERN** stack (MongoDB, Express, React 19, Node.js) and TypeScript. Organize, prioritize, and track your tasks in a modern, responsive interface featuring dynamic dark mode, cloud synchronization, and offline fallback.

---

## 🌟 Architecture Overview

```
                      ┌─────────────────────────────────────────┐
                      │            Frontend (Netlify)           │
                      │  React 19 + TypeScript + Vite + Tailwind │
                      └────────────────────┬────────────────────┘
                                           │
                        REST API Requests  │  (JWT Authentication)
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │             Backend (Render)            │
                      │          Node.js + Express API          │
                      └────────────────────┬────────────────────┘
                                           │
                        Mongoose Driver    │  (TLS / SSL)
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │          Database (MongoDB Atlas)       │
                      │             Free M0 Cluster             │
                      └─────────────────────────────────────────┘
```

- **Frontend**: Hosted on **Netlify** with instant client-side routing, optimistic UI updates, and an in-app backend URL switcher.
- **Backend**: Hosted on **Render** (Free Web Service) with automated CORS handling, bcrypt password hashing, and JWT tokens.
- **Database**: **MongoDB Atlas** (Free M0 tier) cloud database.
- **Offline / Local Fallback**: When the cloud backend is sleeping or offline, Lumina seamlessly saves data to browser `localStorage` and reconnects automatically.

---

## ✨ Features

- **🔐 Secure Authentication**: Register and login with hashed passwords (bcrypt) and signed JSON Web Tokens (JWT).
- **📋 Full Task Lifecycle**: Create, edit, toggle completion, set priorities (`LOW`, `MEDIUM`, `HIGH`), and categorize (`Work`, `Personal`, `Study`, `Health`, `General`).
- **📊 Productivity Analytics**: Live statistics showing Total, Completed, Due Today, High Priority, and Completion Rate percentage.
- **🗓️ Interactive Calendar**: Monthly calendar view with task scheduling and priority indicators.
- **🔍 Instant Search & Filters**: Real-time task search with safe regex matching and category pill filters.
- **🌓 Adaptive Theme**: Automatic system theme detection with manual light/dark toggle and smooth transitions.
- **🔌 In-App Backend Switcher**: Click the status indicator at any time to view, test, or update your live Render backend URL with zero redeployment required.

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript 5.8 |
| **Build & Tooling** | Vite 6 |
| **Routing** | React Router DOM v7 (HashRouter for SPA hosting) |
| **Icons & Styling** | Lucide React, Tailwind CSS |
| **Backend Framework** | Node.js, Express.js (ES Modules) |
| **Database & ODM** | MongoDB Atlas, Mongoose 8 |
| **Authentication & Security** | JWT (`jsonwebtoken`), `bcryptjs`, CORS middleware |
| **Deployment Targets** | Frontend on **Netlify**, Backend on **Render** |

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Node.js** v18+ ([Download](https://nodejs.org/))
- **MongoDB** (Local instance or MongoDB Atlas free connection URI)

### 2. Clone Repository
```bash
git clone https://github.com/yourusername/Lumina_Task.git
cd Lumina_Task
```

### 3. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/lumina_tasks
JWT_SECRET=your_development_secret_key_12345
FRONTEND_URL=http://localhost:3000
```

Start the backend:
```bash
npm run dev
# Server runs on http://localhost:5000
```

### 4. Setup Frontend
In the root project directory:
```bash
cd ..
npm install
```

Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
# Frontend runs on http://localhost:3000
```

---

## ☁️ Free Cloud Hosting Guide

### Step 1: Create Free Database (MongoDB Atlas)
1. Sign up for a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new database deployment selecting the **M0 (Free)** tier.
3. Under **Security**:
   - **Database Access**: Create a username and password (e.g., `lumina_user` and your password).
   - **Network Access**: Add `0.0.0.0/0` (Allow access from anywhere) so Render can reach the database.
4. Click **Connect** → **Drivers** (Node.js) and copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/lumina_tasks?retryWrites=true&w=majority
   ```

---

### Step 2: Deploy Backend for Free (Render)
1. Push your repository to GitHub.
2. Sign in to [render.com](https://render.com) using your GitHub account.
3. Click **New +** → **Web Service** and choose your repository.
4. Fill in the service configuration:
   - **Name**: `lumina-task-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: **Free**
5. Add the following **Environment Variables**:
   | Variable | Value | Description |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Production mode |
   | `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection URI |
   | `JWT_SECRET` | *(Click Generate or enter secret)* | Secret key for JWT auth |
   | `FRONTEND_URL` | `https://<your-netlify-site>.netlify.app` | Netlify frontend URL |
6. Click **Deploy Web Service**.
7. Once deployed, Render provides your public backend URL:
   ```
   https://lumina-task-backend-xxxx.onrender.com
   ```
   Test it in your browser: `https://<your-render-url>/api/health` should return `{"status":"OK", "database":{"connected":true}}`.

> [!NOTE]
> **Render Free Tier Spin-Down**: Free instances on Render spin down after 15 minutes of inactivity. When you open the app after idle time, the backend takes ~35–50 seconds to wake up. The frontend includes a built-in 60s timeout and a waking-up indicator to handle this smoothly.

---

### Step 3: Connect Netlify Frontend to Render Backend

You have two ways to link your hosted Netlify frontend:

#### Method A: Netlify Environment Variable (Recommended)
1. In your [Netlify Dashboard](https://app.netlify.com), navigate to your site.
2. Go to **Site configuration** → **Environment variables**.
3. Add a variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://<your-render-service>.onrender.com/api`
4. Go to **Deploys** → **Trigger deploy** → **Deploy site** to rebuild with the new endpoint.

#### Method B: Instant In-App Connector (No Rebuild Required)
1. Open your live Netlify app in the browser.
2. Click the status badge in the **Login page** or **Dashboard header** (`Local Mode • Click to Config API`).
3. Paste your Render backend URL (e.g. `https://lumina-task-backend-xxxx.onrender.com`).
4. Click **Save & Test Connection**. The app tests connection health, syncs your tasks, and stores the endpoint in your browser.

---

## 📡 API Reference

Base URL: `/api` (or `https://<your-backend>.onrender.com/api`)

### Health
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service status, uptime, and MongoDB status | No |
| `GET` | `/api` | API directory and available routes | No |

### Authentication
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account (`name`, `email`, `password`) | No |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (Bearer) |

### Tasks
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Fetch tasks (Supports `?view=`, `?priority=`, `?search=`) | Yes (Bearer) |
| `POST` | `/api/tasks` | Create task (`title`, `description`, `dueDate`, `priority`, `category`) | Yes (Bearer) |
| `PUT` | `/api/tasks/:id` | Update existing task | Yes (Bearer) |
| `PATCH` | `/api/tasks/:id/toggle` | Toggle task completion status | Yes (Bearer) |
| `DELETE` | `/api/tasks/:id` | Delete task by ID | Yes (Bearer) |
| `GET` | `/api/tasks/stats` | Aggregate task metrics (total, completed, due today) | Yes (Bearer) |

---

## 📂 Project Directory Structure

```
Lumina_Task/
├── components/                 # React UI Components
│   ├── Dashboard.tsx           # Main workspace & analytics hub
│   ├── Login.tsx               # Auth form with in-app backend switcher
│   ├── Sidebar.tsx             # Navigation & filter sidebar
│   ├── TaskCalendar.tsx        # Month grid calendar view
│   ├── TaskList.tsx            # Interactive task list with priority badges
│   ├── TaskModal.tsx           # Create / Edit task dialog
│   └── LoadingScreen.tsx       # Initial loading view
├── public/
│   └── _redirects              # Netlify SPA redirect rules (/* -> /index.html)
├── server/                     # Node.js Express Backend
│   ├── middleware/
│   │   └── auth.js             # JWT bearer verification middleware
│   ├── models/
│   │   ├── Task.js             # Mongoose Task schema
│   │   └── User.js             # Mongoose User schema & password hashing
│   ├── routes/
│   │   ├── auth.js             # Auth endpoints (/api/auth)
│   │   └── tasks.js            # Task CRUD endpoints (/api/tasks)
│   ├── .env.example            # Sample backend environment configuration
│   ├── package.json            # Backend dependencies
│   └── server.js               # Express entrypoint & MongoDB connection
├── services/
│   ├── api.ts                  # Fetch API client with 60s Render timeout
│   └── storageService.ts       # Hybrid Cloud API + LocalStorage cache
├── App.tsx                     # Application route controller
├── index.html                  # HTML template with Tailwind config
├── index.css                   # Custom scrollbars, animations, color tokens
├── render.yaml                 # Render Blueprint specification
├── types.ts                    # TypeScript interfaces & enums
├── vite-env.d.ts               # Vite environment type declarations
├── vite.config.ts              # Vite bundler config
└── package.json                # Frontend dependencies
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
