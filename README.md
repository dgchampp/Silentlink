# 🚀 SilentLink — Private 1-to-1 Chat (MERN + Socket.IO)  

SilentLink is a modern **MERN-based chat application** with **secure authentication** and **realtime one-to-one messaging** powered by **Socket.IO**.  
The app is designed for **simplicity** — single login takes users straight to the chat home to start conversations instantly.
---
## Demo Link 
This site is hosted on render [Demo Link](https://pages.github.com/)
## ✨ Features

### 👤 User Features

- 🔐 **JWT Authentication** – secure register/login with password hashing
- 💬 **Realtime Chat** – 1-to-1 messaging using Socket.IO
- 📡 **Online Presence** – see who’s online
- ✍️ **Typing Indicators** – know when the other person is typing
- 📩 **Message States** – sent, delivered, read receipts
- 🔍 **Search Users** – find other users to chat with
- 📎 **Media Sharing** – send images/files (optional)
- 📱 **Responsive UI** – optimized for both desktop & mobile

### 🛡️ Security

- Passwords hashed with **bcrypt**
- **JWT access + refresh tokens** for session security
- **CORS, Helmet, Rate Limiting** applied
- Input **validation & sanitization**

---

## 🏗️ Tech Stack

**Frontend**: React, React Router, Axios, Socket.IO Client, Bootstrap/Tailwind  
**Backend**: Node.js, Express.js, MongoDB, Mongoose, Socket.IO  
**Utilities**: JWT, bcrypt, Helmet, express-rate-limit, Validator/Zod

---

## 📁 Project Structure

```text
silentlink/
├── frontend/                      # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── ChatList.jsx
│       │   ├── ChatWindow.jsx
│       │   ├── MessageInput.jsx
│       │   └── Navbar.jsx
│       ├── pages/
│       │   ├── Login.jsx
│       │   └── ChatHome.jsx
│       ├── context/AuthContext.jsx
│       ├── hooks/useSocket.js
│       ├── utils/api.js
│       ├── App.jsx
│       ├── package.json
│       └── README.md
├── backend/                       # Node.js backend
│   ├── models/
│   │   ├── User.js
│   │   ├── Conversation.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── messages.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validate.js
│   ├── sockets/
│   │   └── index.js
│   ├── utils/
│   │   └── logger.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── .gitignore
└── README.md
```

## ⚙️ Environment Setup

Create a `.env` file inside `/backend`:

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

MONGODB_URI=mongodb://localhost:27017/silentlink

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=30d
```

# Getting Started
1. Clone the repository
```bash
git clone https://github.com/dgchampp/Silentlink.git
cd Silentlink
```
3. Install dependencies

Backend
```bash
cd backend
npm install
npm run dev   # starts backend with nodemon
```

Frontend
```bash
cd ../frontend
npm install
npm run dev   # starts frontend (Vite)
```
3. Access the app
```bash
Frontend: http://localhost:5173
Backend API: http://localhost:5000
```
📱 API Overview
```text
🔑 Auth

POST /api/auth/register → Register new user
POST /api/auth/login → Login user
POST /api/auth/refresh → Refresh token
GET /api/auth/me → Get current user

👥 Users

GET /api/users/search?q=term → Search users
GET /api/users/:id → Get user profile

```
💬 Conversations & Messages
```text
POST /api/messages/conversation → Start/find conversation
GET /api/messages/conversations → List conversations
GET /api/messages/:conversationId → Get conversation messages
POST /api/messages → Send message
```
#Socket.IO Events
```text
Client → Server
join → { userId }
message:send → { conversationId, text }
typing → { conversationId, isTyping }
Server → Client
message:new → new message event
message:read → read receipt update
presence:update → user online/offline
typing → typing indicator
```
# Database Models (Mongoose)
```text
User { name, email, passwordHash, avatar?, createdAt }

Conversation { participants: [ObjectId<User>], lastMessage?, createdAt }

Message { conversation: ObjectId<Conversation>, sender: ObjectId<User>, text?, media?, readBy: [userId], createdAt }
```
