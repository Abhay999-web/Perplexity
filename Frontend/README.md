# Perplexity Frontend

Modern React-based frontend for the Perplexity AI chat application, built with Vite and Tailwind CSS.

## Features

- ⚡ Lightning-fast development with Vite
- 🎨 Responsive design with Tailwind CSS
- 🔐 Secure authentication with JWT
- 💬 Real-time WebSocket chat
- 📱 Mobile-optimized UI
- 🎯 Redux state management
- 🚀 Production-ready build

## Technologies

- React 19
- Vite 7
- Redux Toolkit
- Tailwind CSS
- Socket.io Client
- React Router v7
- Axios

## Getting Started

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Server runs on `http://localhost:5173`

### Production Build

```bash
npm run build
```

Build output: `dist/` directory

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── app/
│   ├── App.jsx
│   ├── app.routes.jsx
│   ├── app.store.js
│   └── index.css
├── components/
│   └── Dashboard/
│       ├── chatArea.jsx
│       ├── chatInput.jsx
│       ├── CreditBadge.jsx
│       ├── message.list.jsx
│       ├── messageBubble.jsx
│       └── sidebar.jsx
├── features/
│   ├── auth/
│   │   ├── auth.slice.js
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── service/
│   └── chat/
│       ├── chat.slice.js
│       ├── hooks/
│       ├── pages/
│       └── service/
└── main.jsx
```

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

## Build Scripts

| Command | Description |
|---------|------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Linting

```bash
npm run lint
```

## Performance Optimization

The application is optimized for production:
- Code splitting with Vite
- CSS minification
- Asset optimization
- Gzipped bundle

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC

