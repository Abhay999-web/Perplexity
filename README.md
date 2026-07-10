# 🚀 Perplexity - Advanced AI Chat Platform

A full-stack web application for interactive AI conversations with multiple AI providers, real-time updates, and credit-based system.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-ISC-blue)
![Node](https://img.shields.io/badge/node-v16%2B-green)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

Perplexity is a modern AI chat platform that enables users to:
- Chat with multiple AI models (Google AI, Mistral AI)
- Search the internet in real-time
- Manage credits with automatic daily refills
- Access chat history
- Verify email and secure authentication

## ✨ Features

### User Experience
- 🎨 Clean, modern dark-themed UI
- 📱 Fully responsive design (mobile, tablet, desktop)
- ⚡ Real-time chat with streaming responses
- 🔄 Auto-save chat history
- 📊 Credit badge showing available credits

### AI & Search
- 🤖 Multiple AI provider support
- 🔍 Real-time internet search integration
- 💭 Intelligent response streaming
- 🎯 Context-aware conversations

### Authentication & Security
- 🔐 Secure JWT authentication
- 📧 Email verification system
- 🛡️ Password hashing with bcryptjs
- 🚫 CORS protection

### Backend Features
- ⚙️ Automatic daily credit refill (cron job)
- 💾 MongoDB persistence
- 🔌 WebSocket real-time updates
- 📬 Email notifications
- ✅ Input validation & error handling

## 💻 Tech Stack

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS
- **State:** Redux Toolkit
- **API Client:** Axios
- **Real-time:** Socket.io Client
- **Routing:** React Router v7

### Backend
- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcryptjs
- **Real-time:** Socket.io
- **AI Integration:** LangChain
- **Email:** Nodemailer
- **Scheduling:** Node-Cron

### External APIs
- Google AI (Gemini)
- Mistral AI
- Tavily (Search)

## 🚀 Quick Start

### Prerequisites
- Node.js v16 or higher
- npm or yarn
- MongoDB Atlas account
- API keys for AI services

### Installation & Development

#### 1. Clone Repository
```bash
git clone <your-repo-url>
cd Perplexity
```

#### 2. Backend Setup
```bash
cd Backend
npm install
cp .env.example .env

# Edit .env with your credentials
nano .env

npm run dev
```

Backend: `http://localhost:3000`

#### 3. Frontend Setup (new terminal)
```bash
cd Frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

### Environment Variables

See `Backend/.env.example` for required variables:

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
GOOGLE_AI_KEY=your-key
MISTRAL_API_KEY=your-key
TAVILY_API_KEY=your-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173
PORT=3000
```

## 📁 Project Structure

```
Perplexity/
├── Frontend/                          # React + Vite application
│   ├── src/
│   │   ├── app/                       # Main app setup & routing
│   │   ├── components/                # Reusable UI components
│   │   │   └── Dashboard/             # Main chat interface
│   │   ├── features/                  # Feature modules
│   │   │   ├── auth/                  # Authentication
│   │   │   └── chat/                  # Chat functionality
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── Backend/                           # Node.js + Express server
│   ├── src/
│   │   ├── app.js                     # Express app
│   │   ├── config/                    # Configuration
│   │   ├── controllers/               # Request handlers
│   │   ├── middleware/                # Express middleware
│   │   ├── models/                    # Database schemas
│   │   ├── routes/                    # API routes
│   │   ├── services/                  # Business logic
│   │   ├── sockets/                   # WebSocket handlers
│   │   └── validator/                 # Input validation
│   ├── server.js                      # Entry point
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── DEPLOYMENT_GUIDE.md                # Detailed deployment instructions
├── .gitignore
└── README.md                          # This file
```

## 📡 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get user info
- `POST /api/auth/logout` - Logout

### Chat Endpoints
- `GET /api/chats` - List user chats
- `POST /api/chats` - Create new chat
- `GET /api/chats/:id` - Get specific chat
- `DELETE /api/chats/:id` - Delete chat

### WebSocket Events
| Event | Direction | Purpose |
|-------|-----------|---------|
| `new_message` | ↑ | Send message to AI |
| `chat_chunk` | ↓ | Receive response chunks |
| `credits_updated` | ↓ | Credit balance update |
| `chat_session_ready` | ↓ | Chat created |
| `chat_error` | ↓ | Error notification |

## 🌍 Deployment

### Deploy to Render

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy Backend:**
   - Create Web Service on Render
   - Connect GitHub repo
   - Build: `npm install`
   - Start: `npm start`
   - Add environment variables

3. **Deploy Frontend:**
   - Create Static Site on Render
   - Build: `cd Frontend && npm install && npm run build`
   - Publish: `Frontend/dist`

**See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.**

### Alternative Deployments
- **Backend:** Heroku, Railway, DigitalOcean
- **Frontend:** Vercel, Netlify
- **Database:** MongoDB Atlas, AWS, Azure

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | Complete deployment instructions |
| [Frontend/README.md](./Frontend/README.md) | Frontend setup & commands |
| [Backend/README.md](./Backend/README.md) | Backend API & services |

## 🔧 Build & Development Commands

### Frontend
```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview build
npm run lint       # Run ESLint
```

### Backend
```bash
npm run dev        # Start with nodemon
npm start          # Production start
```

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### MongoDB Connection
- ✅ Check MONGO_URI format
- ✅ Whitelist IP in MongoDB Atlas
- ✅ Verify credentials

### CORS Issues
- ✅ Update FRONTEND_URL in .env
- ✅ Check CORS middleware
- ✅ Verify backend running

### Email Not Sending
- ✅ Use Gmail app-specific password
- ✅ Verify EMAIL_USER and EMAIL_PASSWORD
- ✅ Check SMTP settings

### WebSocket Connection
- ✅ Verify backend WebSocket enabled
- ✅ Check FRONTEND_URL matches
- ✅ Verify network connectivity

## 🔐 Security Checklist

Before production deployment:

- [ ] JWT_SECRET is strong and unique
- [ ] API keys are in .env (not in code)
- [ ] CORS configured for production domain
- [ ] HTTPS enabled
- [ ] MongoDB has IP whitelist
- [ ] Passwords properly hashed
- [ ] No sensitive data in git history
- [ ] Environment variables set on hosting

## 📊 Performance Optimization

### Frontend
- Vite code splitting
- CSS minification
- Asset optimization
- Lazy loading of routes

### Backend
- MongoDB indexes
- Request validation
- Error handling
- Connection pooling

### Recommendations
- Add Redis caching
- Implement rate limiting
- Use CDN for assets
- Monitor API performance

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes and commit
3. Push to branch: `git push origin feature/name`
4. Create Pull Request

## 📄 License

This project is licensed under the ISC License - see package.json for details.

## 📞 Support

For issues and questions:
1. Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
2. Review [Troubleshooting](#troubleshooting) section
3. Check individual README files in Frontend/ and Backend/

## 🎓 Learning Resources

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Render Deployment](https://render.com/docs)

---

## 📈 Project Status

✅ **Ready for Production** - All features implemented and tested.

**Last Updated:** 2025-01-10  
**Version:** 1.0.0

---

**Made with ❤️ for AI enthusiasts**
