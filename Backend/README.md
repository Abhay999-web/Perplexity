# Perplexity Backend

Node.js and Express-based backend for the Perplexity AI chat application with MongoDB database.

## Features

- 🤖 Multi-AI provider support (Google AI, Mistral AI)
- 🔍 Internet search integration (Tavily API)
- 💳 Credit system with daily refills
- 🔐 JWT-based authentication
- 📧 Email verification
- ⚡ Real-time WebSocket communication
- 📅 Scheduled tasks with node-cron
- 🛡️ Request validation with express-validator

## Technologies

- Node.js & Express 5
- MongoDB & Mongoose
- Socket.io
- LangChain
- JWT Authentication
- Nodemailer
- Node-Cron

## Getting Started

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file in the Backend directory:

```env
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/perplexity
PORT=3000
JWT_SECRET=your-secret-key-here
FRONTEND_URL=http://localhost:5173
GOOGLE_AI_KEY=your-google-ai-key
MISTRAL_API_KEY=your-mistral-api-key
TAVILY_API_KEY=your-tavily-api-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
NODE_ENV=development
```

### Development Server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

### Production Server

```bash
npm start
```

## Project Structure

```
src/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── auth.controller.js    # Auth logic
│   └── chat.controller.js    # Chat logic
├── middleware/
│   └── auth.middleware.js    # JWT verification
├── models/
│   ├── user.model.js
│   ├── chat.model.js
│   └── message.model.js
├── routes/
│   ├── auth.route.js
│   └── chat.route.js
├── services/
│   ├── ai.service.js         # AI integration
│   ├── credit.service.js     # Credit management
│   ├── cron.services.js      # Scheduled tasks
│   ├── internet.service.js   # Web search
│   └── mail.service.js       # Email sending
├── sockets/
│   └── server.socket.js      # WebSocket events
├── validator/
│   └── auth.validator.js     # Input validation
└── app.js                    # Express app setup
```

## API Endpoints

### Authentication
```
POST   /api/auth/register      # Register new user
POST   /api/auth/login         # Login user
GET    /api/auth/me            # Get current user
POST   /api/auth/logout        # Logout user
GET    /api/auth/verify-email  # Verify email
```

### Chat
```
GET    /api/chats              # Get all user chats
POST   /api/chats              # Create new chat
GET    /api/chats/:id          # Get specific chat
DELETE /api/chats/:id          # Delete chat
POST   /api/chats/:id/message  # Send message
GET    /api/chats/:id/messages # Get chat messages
```

## WebSocket Events

### Emit to Server
- `new_message` - Send new message to AI
- `get_chats` - Fetch user chats

### Listen from Server
- `chat_chunk` - Streamed AI response chunks
- `credits_updated` - Credit balance update
- `chat_session_ready` - New chat created
- `chat_error` - Error occurred during chat

## Database Models

### User
```javascript
{
  username: String,
  email: String (unique),
  password: String (hashed),
  credits: Number,
  emailVerified: Boolean,
  createdAt: Date
}
```

### Chat
```javascript
{
  userId: ObjectId (ref: User),
  title: String,
  messages: [ObjectId] (ref: Message),
  createdAt: Date,
  updatedAt: Date
}
```

### Message
```javascript
{
  chatId: ObjectId (ref: Chat),
  userId: ObjectId (ref: User),
  role: String (user/assistant),
  content: String,
  createdAt: Date
}
```

## Key Services

### AI Service (`ai.service.js`)
- Integrates with Google AI and Mistral AI
- Streams responses in chunks
- Handles model selection

### Credit Service (`credit.service.js`)
- Manages user credits
- Deducts credits per message
- Handles daily refills

### Internet Service (`internet.service.js`)
- Tavily API integration
- Web search functionality
- Search result parsing

### Mail Service (`mail.service.js`)
- Email verification
- Account notifications
- Uses Nodemailer + Gmail

### Cron Service (`cron.services.js`)
- Daily credit refill job
- Scheduled at specified time

## Authentication

JWT tokens are used for authentication:
- Tokens included in Authorization header
- Format: `Bearer <token>`
- Verified using `auth.middleware.js`
- Tokens stored in HTTP-only cookies

## Error Handling

All endpoints return consistent error responses:
```javascript
{
  status: "error",
  message: "Error description",
  code: "ERROR_CODE"
}
```

## Validation

Request validation using `express-validator`:
- Email validation
- Password strength checking
- Message content validation
- ID validation

## CORS Configuration

CORS is enabled for frontend URL specified in `FRONTEND_URL` environment variable.

## Rate Limiting

Consider adding rate limiting for production:
- Login attempts
- Message sending
- API endpoints

## Deployment

### Render Deployment
1. Push code to GitHub
2. Create web service on Render
3. Set environment variables
4. Deploy with `npm install && npm start`

See [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) for detailed steps.

## Build Scripts

| Command | Description |
|---------|------------|
| `npm run dev` | Start dev server with nodemon |
| `npm start` | Start production server |

## Debugging

Enable debug logging:
```bash
DEBUG=* npm run dev
```

## Common Issues

**MongoDB Connection Error**
- Check MONGO_URI format
- Verify IP whitelist in MongoDB Atlas
- Ensure network connectivity

**JWT Token Issues**
- Clear cookies
- Re-login user
- Check JWT_SECRET in .env

**Email Verification Failed**
- Use Gmail app-specific password
- Check EMAIL_USER and EMAIL_PASSWORD
- Verify SMTP settings

## Performance Tips

- Use MongoDB indexes
- Implement caching with Redis (optional)
- Optimize AI prompt tokens
- Use connection pooling

## Security

- ✅ Password hashing with bcryptjs
- ✅ JWT token-based auth
- ✅ Environment variable protection
- ✅ CORS configuration
- ✅ Input validation
- ✅ HTTP-only cookies

## Contributing

Follow these guidelines:
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Create pull request

## License

ISC

---

For deployment instructions, see [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md)
