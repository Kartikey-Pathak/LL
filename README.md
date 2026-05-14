# 🚀 LLaMA — Full-Stack AI Chat Application

A production-grade **AI-powered chat application** built using **Next.js, MongoDB, OpenRouter LLMs, and secure authentication**, featuring **persistent chat history, PDF-based AI conversations, context-aware responses, and scalable architecture**.

🔗 **Live Demo:** https://llama-theta.vercel.app/  
💻 **GitHub:** https://github.com/Kartikey-Pathak/LL

---

# 📌 Overview

LLaMA is a full-stack AI chat platform where users can:

- Securely authenticate
- Create and manage multiple chat sessions
- Chat with an AI model using conversation history
- Upload PDFs and ask questions from documents
- Persist chat history across sessions

The project was built to gain hands-on experience with:

- Real-world authentication systems
- AI integration in production apps
- Database schema design
- Stateful chat architectures
- Cost-aware LLM usage
- Deployment & serverless limitations

---

# ✨ Features

## 💬 AI Chat System

- Context-aware AI responses
- Previous messages used as conversation memory
- Multiple chat sessions
- Automatic title handling
- Persistent chat history
- Chat deletion support

## 📄 PDF Chat (Document Q&A)

Users can upload PDFs and ask questions directly from them.

### Current Workflow

- Upload PDF
- Extract text from document
- Store parsed PDF content in MongoDB
- AI answers questions using uploaded document context

### Safeguards

- Daily PDF upload limit
- Duplicate PDF detection
- File size restrictions
- User-specific document storage

⚠️ **Note:** Since the app currently uses a **free LLM model**, responses based on PDFs may occasionally be inaccurate or hallucinated.

---

# 🔐 Authentication & Security

Supports **two authentication systems**:

### Email + Password Auth

- Signup/Login
- OTP email verification
- Password hashing using bcrypt

### OAuth Authentication

- Google Sign-In support via NextAuth

### Security Features

- JWT authentication
- HTTP-only cookies
- Protected API routes
- User-specific data isolation
- Authentication middleware

---

# 🧠 AI Integration

Powered by **OpenRouter API** with:

- Context-aware responses
- Controlled message history for lower token cost
- Cost optimization using limited context window
- Streaming response support

### Current Model

- `meta-llama/llama-3-8b-instruct`
- Knowledge cutoff depends on selected model

---

# ⚛️ Frontend & UX

- Modern responsive UI
- Light/Dark mode
- Smooth chat experience
- Animated input system
- Toast notifications
- Auto-scroll to latest message
- Loading states & upload feedback

---

# 🛠️ Tech Stack

## Frontend

- Next.js (App Router)
- React
- Tailwind CSS
- DaisyUI
- Framer Motion / Motion
- React Hot Toast

## Backend

- Next.js API Routes
- MongoDB
- Mongoose
- JWT Authentication
- NextAuth
- bcrypt

## AI & Document Processing

- OpenRouter API
- LLaMA Models
- PDFReader for PDF parsing

---

# 🗂️ Backend Architecture

Structured with modular architecture for scalability.

## API Routes

```txt
/app
 ├── api
 │   ├── auth
 │   ├── verify
 │   ├── chatai
 │   ├── upload-pdf
 │   └── auth/[...nextauth]
```

## Challenges Solved During Development

Some real-world engineering problems solved while building:

- AI context handling
- Persistent chat memory
- Duplicate chat title handling
- PDF parsing & storage
- Authentication with JWT + OAuth
- Serverless deployment issues on Vercel
- File upload limits (413 Payload Too Large)
- Error-safe API response parsing
- Token cost optimization

## Learning & Development

- This project was built as a deep learning experience in:

- Full-stack development
- Authentication systems
- AI integration
- Backend architecture
- Database modeling
- Production debugging

- Resources used:

- Next.js Documentation
- MongoDB Documentation
- Stack Overflow
- ChatGPT (for debugging, explanations, and learning concepts)

- The core implementation, debugging, architectural decisions, and understanding were done during the development process.

## Author
## Kartikey Pathak
## B.Tech CSE | Full-Stack Developer | Coding Enthusiast