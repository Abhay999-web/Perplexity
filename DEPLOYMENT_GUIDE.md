# Perplexity - Full Stack AI Chat Application

A modern, full-stack AI chat application built with React, Node.js, Express, and MongoDB.

## Features

- 🤖 AI-powered chat with multiple AI providers (Google AI, Mistral AI)
- 🔍 Internet search integration (Tavily API)
- 💳 Credit-based system with automatic daily refills
- 🔐 User authentication with JWT
- 📧 Email verification
- ⚡ Real-time chat with WebSockets (Socket.io)
- 📱 Responsive design with Tailwind CSS
- 🎨 Modern UI with React and Vite

## Tech Stack

### Frontend
- React 19
- Vite
- Redux Toolkit (State Management)
- Socket.io Client
- React Router v7
- Tailwind CSS
- Axios

### Backend
- Node.js & Express
- MongoDB & Mongoose
- Socket.io (WebSockets)
- LangChain
- JWT Authentication
- Nodemailer
- Node-Cron (scheduled tasks)

## Project Structure

```
Perplexity/
├── Frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   └── chat/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── Backend/
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── models/
    │   ├── routes/
    │   ├── services/
    │   ├── sockets/
    │   └── validator/
    ├── server.js
    ├── package.json
    └── .env.example
```

## Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- API keys for:
  - Google AI (or Mistral AI)
  - Tavily API (for search)
  - Gmail account (for email verification)

### Local Development

#### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Perplexity
```

#### 2. Backend Setup
```bash
cd Backend
npm install

# Create .env file
cp .env.example .env

# Configure your .env with actual credentials
# Edit .env and add:
# - MONGO_URI
# - JWT_SECRET
# - API keys (GOOGLE_AI_KEY, MISTRAL_API_KEY, TAVILY_API_KEY)
# - Email credentials
# - FRONTEND_URL

# Run development server
npm run dev
```

Server will be available at `http://localhost:3000`

#### 3. Frontend Setup
```bash
cd Frontend
npm install

# Run development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

## Deployment on Render

### Prerequisites
- Render account (https://render.com)
- MongoDB Atlas database
- All API keys configured

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### Step 2: Deploy Backend on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** perplexity-backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free or Paid (based on needs)

5. Add Environment Variables:
   - `MONGO_URI` - Your MongoDB Atlas connection string
   - `FRONTEND_URL` - Your frontend domain (e.g., https://perplexity-frontend.onrender.com)
   - `JWT_SECRET` - Any secure random string
   - `GOOGLE_AI_KEY` - Your Google AI API key
   - `MISTRAL_API_KEY` - Your Mistral API key
   - `TAVILY_API_KEY` - Your Tavily API key
   - `EMAIL_USER` - Gmail address for sending verification emails
   - `EMAIL_PASSWORD` - Gmail app-specific password
   - `NODE_ENV` - production

6. Click "Create Web Service"

### Step 3: Deploy Frontend on Render

1. Create a new Static Site
2. Connect your GitHub repository
3. Configure:
   - **Name:** perplexity-frontend
   - **Build Command:** `cd Frontend && npm install && npm run build`
   - **Publish Directory:** `Frontend/dist`
   - **Root Directory:** (leave blank or use /)

4. Click "Create Static Site"

### Step 4: Update CORS and URLs

After deployment:
1. Get your frontend URL from Render (e.g., perplexity-frontend.onrender.com)
2. Get your backend URL from Render (e.g., perplexity-backend.onrender.com)
3. Update backend environment variable `FRONTEND_URL` with your frontend domain

### Step 5: Build Frontend for Production

Before final deployment, build the frontend:
```bash
cd Frontend
npm run build
```

The build files will be in `Frontend/dist/`

## Environment Variables

Create a `.env` file in the Backend folder with these variables:

```env
# Database
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/perplexity

# Server
PORT=3000
NODE_ENV=production

# Frontend
FRONTEND_URL=https://your-frontend-domain.com

# Authentication
JWT_SECRET=your-secret-key-min-32-characters

# AI Services
GOOGLE_AI_KEY=your-google-ai-key
MISTRAL_API_KEY=your-mistral-api-key
TAVILY_API_KEY=your-tavily-api-key

# Email Service
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Chat
- `GET /api/chats` - Get all chats
- `POST /api/chats` - Create new chat
- `GET /api/chats/:id` - Get specific chat
- `DELETE /api/chats/:id` - Delete chat
- `POST /api/chats/:id/messages` - Send message

## WebSocket Events

### Client → Server
- `new_message` - Send new message
- `get_chats` - Fetch all chats

### Server → Client
- `chat_chunk` - Incoming AI response chunks
- `credits_updated` - Credit balance updates
- `chat_session_ready` - Chat created successfully
- `chat_error` - Error occurred

## Troubleshooting

### Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`

### MongoDB Connection Issues
- Verify MONGO_URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database name is correct

### CORS Issues
- Update FRONTEND_URL environment variable
- Verify CORS middleware in backend

### Email Verification Issues
- Use Gmail app-specific password (not regular password)
- Enable "Less secure app access" if needed
- Check EMAIL_USER and EMAIL_PASSWORD

## Performance Notes

- Frontend build size: ~600KB (minified)
- Use Render's Redis for caching (optional)
- Consider code splitting for large app size warning

## Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] API keys are not exposed in code
- [ ] CORS is properly configured
- [ ] MongoDB has IP whitelist
- [ ] HTTPS is enabled
- [ ] Environment variables are set on Render
- [ ] No sensitive data in git history

## Support & Documentation

- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.mongodb.com/manual/)
- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)

## License

This project is open source and available under the ISC License.

---

**Ready to Deploy?** Follow the Deployment on Render section above! 🚀
