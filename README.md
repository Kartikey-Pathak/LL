# 🚀 LLaMA -- Full-Stack AI Chat Application

A production-grade **AI chat application** built with **Next.js**,
**MongoDB**, and **OpenRouter LLMs**, focusing on **authentication,
secure data modeling, chat persistence, scalability, and clean
architecture**.

🔗 **Live Demo:** https://llama-theta.vercel.app/\
💻 **GitHub:** https://github.com/Kartikey-Pathak/LL

------------------------------------------------------------------------

## 📌 Overview

LLaMA is a full-stack AI chat platform where users can securely
authenticate, create multiple chat sessions, and interact with an AI
model that responds **based on previous chat context**.

The project was built to understand: - Real-world authentication flows -
Schema design for chat applications - Frontend state management for
dynamic chat UIs - Production-style folder structure - AI integration
with cost & latency control

------------------------------------------------------------------------

## 🛠️ Tech Stack

### Frontend

-   Next.js (App Router)
-   React
-   Tailwind CSS + DaisyUI
-   Axios
-   React Hot Toast

### Backend

-   Next.js API Routes
-   MongoDB + Mongoose
-   JWT Authentication
-   bcrypt (password hashing)

### AI

-   OpenRouter API
-   Context-aware LLM responses
-   Model knowledge cutoff: **October 2023**

------------------------------------------------------------------------

## 🔐 Authentication & Security

-   Email + Password authentication
-   OTP-based email verification before account activation
-   Password hashing using bcrypt
-   JWT-based authentication
-   Secure HTTP-only cookies
-   Protected routes using token verification

------------------------------------------------------------------------

## 💬 Chat System (Core Feature)

-   Chats grouped by title
-   Automatic chat creation if title doesn't exist
-   Message appending for existing chats
-   User-specific chat history stored in MongoDB
-   Chat deletion with frontend & backend sync
-   Chat continuity across sessions

------------------------------------------------------------------------

## 🧠 AI Integration

-   Integrated LLM via OpenRouter
-   Uses previous messages as context
-   Controlled message history to manage cost & latency
-   Model knowledge cutoff: **October 2023**

------------------------------------------------------------------------

## ⚛️ Frontend & UX

-   Light / Dark mode
-   Clean chat UI
-   Auto-scroll to latest message
-   Efficient frontend state management
-   Toast notifications
-   Responsive layout

------------------------------------------------------------------------

## 🗂️ Backend & Architecture

-   Modular API routes (auth, verify, chat, AI)
-   Clean schema design
-   Production-style folder structure
-   Proper error handling & status codes

------------------------------------------------------------------------

## 📁 Folder Structure

    /app
     ├─ api
     │   ├─ auth
     │   ├─ verify
     │   └─ chatai
     ├─ chat
     └─ layout.js

    /models
     ├─ User.js
     └─ Message.js

    /helpers
     ├─ gettokeninfo.js
     ├─ Sendotpemail.js
     └─ generateUniqueTitle.js

    /dbconfig
     └─ dbconfig.js

------------------------------------------------------------------------

## 📚 Learning & Resources

Next.js documentation, Stack Overflow, and ChatGPT were used for: -
Debugging - Framework clarification - Architecture understanding -
Frontend state management

Core logic, schema design, authentication flow, and application
structure were fully implemented and understood during development.

------------------------------------------------------------------------

## 🚧 Future Improvements

-   Streaming AI responses
-   Chat search
-   Message regeneration
-   Rate limiting
-   Improved mobile UX

------------------------------------------------------------------------

## 🧑‍💻 Author

**Kartikey Pathak**\
B.Tech CSE | Full-Stack Developer
