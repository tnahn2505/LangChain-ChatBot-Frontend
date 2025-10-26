# 🤖 LangChain ChatBot Frontend

A modern, responsive chat interface built with React, TypeScript, and Vite. This frontend application provides a ChatGPT-like experience with support for multiple conversation threads, file uploads, and real-time AI interactions.

## ✨ Features

- 💬 **Multi-thread Conversations**: Create and manage multiple chat sessions
- 🎨 **Modern UI**: Clean, responsive design with dark/light mode support
- 📁 **File Upload**: Support for various file types (PDF, DOC, images, etc.)
- 🔄 **Real-time Chat**: Live typing indicators and smooth message flow
- 💾 **Local Storage**: Persistent conversation history
- 🛡️ **Error Handling**: Robust error boundaries and retry mechanisms
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📱 **Responsive**: Works seamlessly on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see Backend Setup)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LangChain-ChatBot-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your configuration
   VITE_API_BASE_URL=http://localhost:8000
   VITE_APP_NAME=My ChatBot
   VITE_API_TIMEOUT=10000
   VITE_API_RETRY_ATTEMPTS=3
   VITE_ENABLE_OFFLINE_MODE=true
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── UI.tsx          # Main application component
│   ├── ChatContainer.tsx
│   ├── MessageList.tsx
│   ├── ChatInput.tsx
│   ├── Sidebar.tsx
│   ├── ErrorScreen.tsx
│   ├── EmptyState.tsx
│   └── ErrorBoundary.tsx
├── hooks/              # Custom React hooks
│   ├── useAppState.ts
│   ├── useThreads.ts
│   ├── useMessages.ts
│   ├── useDarkMode.ts
│   └── useToast.ts
├── services/           # API services
│   └── api.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── config/             # Configuration
│   └── environment.ts
├── utils/              # Utility functions
│   └── index.ts
└── styles/             # CSS styles
    └── UI.css
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://127.0.0.1:8000` |
| `VITE_APP_NAME` | Application name | `ChatGPT` |
| `VITE_API_TIMEOUT` | API request timeout (ms) | `10000` |
| `VITE_API_RETRY_ATTEMPTS` | Number of retry attempts | `3` |
| `VITE_ENABLE_OFFLINE_MODE` | Enable offline functionality | `true` |

### Backend Integration

This frontend is designed to work with a separate Backend API. The backend should provide:

- `GET /health` - Health check
- `POST /threads` - Create new thread
- `GET /threads` - List all threads  
- `POST /threads/{id}/messages` - Send message to AI

**Note:** This is a Frontend-only repository. The Backend API should be implemented separately.

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Type checking
npx tsc --noEmit     # Check TypeScript types
```

### Code Quality

- **ESLint**: Code linting with React and TypeScript rules
- **TypeScript**: Full type safety
- **Error Boundaries**: Comprehensive error handling
- **Custom Hooks**: Reusable state logic

## 🎨 UI Components

### Main Components

- **`UI`**: Main application container
- **`ChatContainer`**: Chat interface with messages and input
- **`Sidebar`**: Thread navigation and management
- **`MessageList`**: Display conversation history
- **`ChatInput`**: Message composition with file upload

### State Management

- **`useAppState`**: Main application state
- **`useThreads`**: Thread management
- **`useMessages`**: Message handling
- **`useDarkMode`**: Theme management
- **`useToast`**: Notification system

## 🔄 API Integration

### Error Handling

- **Retry Mechanism**: Automatic retry on API failures
- **Error Boundaries**: Catch and display React errors
- **Toast Notifications**: User-friendly error messages
- **Offline Mode**: Fallback when API is unavailable

### Data Flow

1. User sends message → `ChatInput`
2. `useMessages` hook processes → API call
3. AI response received → UI update
4. Data persisted to localStorage

## 📱 Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Breakpoints**: Responsive layout for all screen sizes
- **Touch-friendly**: Mobile-optimized interactions
- **Accessibility**: ARIA labels and keyboard navigation

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Environment Setup

1. Set production environment variables
2. Configure your backend API URL
3. Deploy the `dist/` folder to your hosting service

### Recommended Hosting

- **Vercel**: Easy deployment with Vite support
- **Netlify**: Static site hosting
- **AWS S3 + CloudFront**: Scalable hosting
- **GitHub Pages**: Free hosting for open source

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- Powered by [Vite](https://vitejs.dev/)
- Styled with modern CSS
- Type-safe with [TypeScript](https://www.typescriptlang.org/)

---

Made with ❤️ for the AI community