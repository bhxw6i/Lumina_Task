<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 📋 Lumina Task - AI-Powered Task Management

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v16%2B-green?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite)](https://vitejs.dev)
[![Google Gemini API](https://img.shields.io/badge/Google%20Gemini-API-red?logo=google)](https://ai.google.dev/)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen)](https://github.com)

---

An elegant, modern task management application powered by Google's Gemini AI. Organize, prioritize, and manage your tasks with intelligent AI assistance in a beautiful, responsive interface.
</div>

## ✨ Features

### 🎯 Task Management
- ✅ Create, edit, delete, and organize tasks with intuitive controls
- 🏷️ Smart task labeling and categorization system
- 📌 Pin important tasks for quick access
- 🗑️ Soft delete with task recovery option

### 🤖 AI-Powered Assistance
- 🧠 Leverage Google Gemini AI for intelligent task suggestions
- 💡 Auto-generate task descriptions and subtasks
- 📝 AI-powered task prioritization recommendations
- 🎨 Smart task categorization suggestions

### 📊 Views & Organization
- 📥 **Inbox**: Manage all your tasks in one place
- 📅 **Today**: Focus on today's priorities
- 🗓️ **Calendar**: Visual task calendar for time management
- ✔️ **Completed**: Review finished tasks

### 🎨 User Experience
- 🌓 Dark/Light Mode with seamless theme switching
- 📱 Responsive Design that works on desktop and mobile
- 🔍 Advanced Search & Filter capabilities
- ⚡ Fast, smooth, and intuitive interface

### 🔒 Data Management
- 💾 Local Storage of all tasks and preferences
- 👤 Authentication with user profiles
- 🔐 Secure credential handling
- 📊 Data persistence across sessions

## 🛠 Tech Stack

| Category | Technologies |
|----------|---------------|
| **Frontend Framework** | ![React](https://img.shields.io/badge/React-19-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript) |
| **Build & Bundling** | ![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite) |
| **Routing** | ![React Router](https://img.shields.io/badge/React%20Router-7-red?logo=react-router) |
| **Styling** | ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue?logo=tailwindcss) |
| **UI Components** | ![Lucide React](https://img.shields.io/badge/Lucide%20React-Icons-orange) |
| **AI Integration** | ![Google Gemini](https://img.shields.io/badge/Google%20Gemini-API-red?logo=google) |
| **State Management** | ![React Hooks](https://img.shields.io/badge/React-Hooks-blue) |
| **Storage** | ![LocalStorage](https://img.shields.io/badge/Browser-LocalStorage-yellow) |

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- ✅ **Node.js** v16 or higher ([Download](https://nodejs.org/))
- ✅ **npm** or **yarn** package manager
- ✅ **Git** for version control
- ✅ **Google Gemini API Key** ([Get Free Key](https://ai.google.dev/))

## 🚀 Quick Start

### Step 1️⃣ Clone or Download Repository
```bash
git clone https://github.com/yourusername/lumina-task.git
cd lumina-task
```

### Step 2️⃣ Install Dependencies
```bash
npm install
```

### Step 3️⃣ Configure API Key
Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**Get your API key:** Visit [Google AI Studio](https://ai.google.dev/)

### Step 4️⃣ Run Development Server
```bash
npm run dev
```

Access the app at: **http://localhost:3000**

### Step 5️⃣ Build for Production
```bash
npm run build
```

### Step 6️⃣ Preview Production Build
```bash
npm run preview
```

## 📂 Project Structure

```
lumina-task/
│
├── 📁 components/                 # React Components
│   ├── Dashboard.tsx             # Main dashboard & task management hub
│   ├── TaskList.tsx              # Task list view component
│   ├── TaskCalendar.tsx          # Calendar view component
│   ├── TaskModal.tsx             # Task creation/edit modal
│   ├── Login.tsx                 # Authentication login component
│   ├── Sidebar.tsx               # Navigation sidebar component
│   └── LoadingScreen.tsx         # Loading animation component
│
├── 📁 services/                   # Business Logic & APIs
│   ├── geminiService.ts          # Google Gemini API integration
│   └── storageService.ts         # LocalStorage data management
│
├── 📄 App.tsx                    # Root application component
├── 📄 types.ts                   # TypeScript type definitions
├── 📄 constants.tsx              # App constants & configurations
├── 📄 index.tsx                  # Application entry point
├── 📄 vite.config.ts             # Vite configuration
├── 📄 tsconfig.json              # TypeScript configuration
├── 📄 package.json               # Project dependencies
├── 📄 index.html                 # HTML template
└── 📄 README.md                  # This file
```

## 🎯 Key Components

### 📊 **Dashboard** (`Dashboard.tsx`)
The main application hub featuring:
- 📈 Task management and organization
- 🔄 Multi-view support (Inbox, Today, Calendar, Completed)
- 🔍 Advanced filtering and search
- 🎨 Theme switching interface

### ➕ **TaskModal** (`TaskModal.tsx`)
Modal dialog for task operations:
- ➕ Create new tasks with AI assistance
- ✏️ Edit existing task details
- 🤖 AI-powered task suggestions
- 📝 Rich text description support

### 📋 **TaskList** & 📅 **TaskCalendar**
Multiple visualization modes:
- **TaskList**: Traditional list view with sorting options
- **TaskCalendar**: Visual calendar representation of tasks

### 🧭 **Sidebar** (`Sidebar.tsx`)
Navigation component providing:
- 🔗 Quick access to different views
- 🏷️ Task filtering by priority and status
- ⚙️ Settings and preferences
- 👤 User profile management

### 🔑 **Login** (`Login.tsx`)
Authentication interface:
- 👤 User account management
- 🔐 Secure login system
- 📝 User profile creation

### 🎁 **Services**

#### **geminiService.ts** 🤖
Google Gemini API integration:
- 💬 AI task suggestions
- 📝 Description generation
- 🏷️ Smart categorization
- 🎯 Priority recommendations

#### **storageService.ts** 💾
Data persistence layer:
- 📦 Task storage & retrieval
- 👤 User session management
- 🎨 Theme preferences
- 🔒 Secure local storage

## 🔐 Security Notes

- 🔑 **API Keys**: Stored in `.env.local` (excluded from version control via `.gitignore`)
- 📦 **Local Storage**: User data stored securely in browser's LocalStorage
- 🚀 **External Calls**: Only Gemini API calls sent to external servers
- 🛡️ **No Sensitive Data**: Personal information never logged or transmitted
- ✅ **Privacy First**: Full control of your data remains in your browser

**Environment Variables to Keep Secret:**
```env
✋ GEMINI_API_KEY=your_secret_key_here  # Never commit this!
```

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Production
npm run build        # Build optimized bundle for production
npm run preview      # Preview the production build locally
```

### Script Details

| Command | Purpose | Output |
|---------|---------|--------|
| `npm run dev` | Start Vite dev server with hot reload | Serves at `http://localhost:3000` |
| `npm run build` | Create optimized production bundle | Generates `dist/` folder |
| `npm run preview` | Preview production build locally | Serves optimized build for testing |

## 🎨 Theme Support

Lumina Task features intelligent theme management:

- 🌓 **Auto Detection**: Automatically detects your system theme preference
- 🎨 **Manual Toggle**: Easy switch between light and dark modes
- 💾 **Persistence**: Your theme preference is saved to localStorage
- 🌙 **Dark Mode**: Comfortable viewing in low-light environments
- ☀️ **Light Mode**: Optimal for daytime use

**Theme Behavior:**
```
System Preference: Yes → Auto Dark Mode
Manual Toggle: Override system preference
localStorage: Persist across sessions
```

## 🔄 Data Persistence

All user data is stored locally in the browser with no external synchronization:

### What Gets Saved
- ✅ Tasks and task details (title, description, priority, dates)
- ✅ User preferences (theme, view settings, filters)
- ✅ User login information and profiles
- ✅ Task completion status and history

### Storage Details
```
Location: Browser LocalStorage
Scope: Per-domain/per-origin
Persistence: Across browser sessions
Backup: None (local only)
```

**Important:** Data is not synced across devices or browsers. Clear your browser data at your own risk!

## 🐛 Troubleshooting

### ❌ Port 3000 Already in Use
**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Try a different port
npm run dev -- --port 3001

# Or kill the process using port 3000
npx kill-port 3000
```

### ❌ API Key Not Working
**Error:** `API key is invalid or missing`

**Checklist:**
- ✅ Verify `.env.local` exists in project root
- ✅ Confirm `GEMINI_API_KEY=` is set correctly (no spaces)
- ✅ Check API key is valid at [Google AI Studio](https://ai.google.dev/)
- ✅ Ensure Gemini API is enabled in Google Cloud Console
- ✅ Restart dev server after updating `.env.local`

### ❌ Dependencies Installation Fails
**Error:** `npm ERR! ...`

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### ❌ Build Fails
**Error:** `vite build` fails with TypeScript errors

**Solution:**
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Fix TypeScript issues and rebuild
npm run build
```

### ❌ Dark Mode Not Working
**Solution:**
- Clear browser cache and localStorage
- Check browser supports CSS variables
- Verify Tailwind CSS is properly configured in `vite.config.ts`

### ❌ Tasks Not Persisting
**Solution:**
- Check if localStorage is enabled in browser settings
- Verify private/incognito mode is not being used
- Check browser console for errors (F12 → Console tab)

## 📄 License

This project is created with Google AI Studio.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

- View your app: [Google AI Studio](https://ai.studio/apps/temp/1)
- Licensed under the MIT License - see [LICENSE](LICENSE) file for details

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Report Issues
- 🐛 Found a bug? [Open an issue](../../issues)
- 💡 Have a suggestion? [Start a discussion](../../discussions)

### Submit Changes
1. 🍴 Fork the repository
2. 🌱 Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. 📝 Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. 🚀 Push to the branch (`git push origin feature/AmazingFeature`)
5. 📬 Open a Pull Request

### Development Guidelines
- Write clean, readable code
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed
- Follow existing code style

---

## 📞 Support & Contact

- 📧 Email: [your-email@example.com]
- 💬 GitHub Issues: [Report bugs or request features](../../issues)
- 🌐 Website: [Your website/portfolio]

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [Google Gemini API](https://ai.google.dev/)

---

<div align="center">

### Made with ❤️ and powered by AI

[⬆ Back to Top](#-lumina-task---ai-powered-task-management)

![GitHub Stars](https://img.shields.io/github/stars/yourusername/lumina-task?style=social)
![GitHub Forks](https://img.shields.io/github/forks/yourusername/lumina-task?style=social)
![GitHub Issues](https://img.shields.io/github/issues/yourusername/lumina-task?style=social)

</div>
