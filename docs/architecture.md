# 🏗️ Architecture Documentation

## 📋 **Kiến trúc 2 Repo (Frontend + Backend)**

### **Frontend Repository (LangChain-ChatBot-Frontend)**
```
src/
├── services/
│   └── api.ts          # API Client - chỉ gọi Backend APIs
├── hooks/              # State management
├── components/         # UI Components
└── types/             # TypeScript types
```

### **Backend Repository (LangChain-ChatBot-Backend)**
```
backend/
├── routes/
│   ├── health.py       # GET /health
│   ├── threads.py      # POST /threads, GET /threads
│   └── messages.py     # POST /threads/{id}/messages
├── models/             # Database models
├── services/           # Business logic
└── main.py            # FastAPI app
```

## 🔄 **API Flow**

### **1. Health Check**
```
Frontend → GET /health → Backend
```

### **2. Create Thread**
```
Frontend → POST /threads → Backend → Database
```

### **3. Send Message**
```
Frontend → POST /threads/{id}/messages → Backend → AI Service → Database
```

## 📡 **API Endpoints (Backend)**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/threads` | Create new thread |
| `GET` | `/threads` | List all threads |
| `POST` | `/threads/{id}/messages` | Send message to AI |

## 🎯 **Frontend API Client**

### **Responsibilities:**
- ✅ HTTP requests to Backend
- ✅ Error handling & retry logic
- ✅ Data transformation
- ✅ Local storage (cache)
- ❌ Business logic
- ❌ Database operations
- ❌ AI processing

### **Example Usage:**
```typescript
// Frontend chỉ gọi Backend APIs
const response = await api.sendMessage(threadId, content);
const threads = await api.getAllThreads();
```

## 🚀 **Development Setup**

### **Backend (Port 8000)**
```bash
cd LangChain-ChatBot-Backend
python -m uvicorn main:app --reload --port 8000
```

### **Frontend (Port 5173)**
```bash
cd LangChain-ChatBot-Frontend
npm run dev
```

### **Environment Variables**
```env
# Frontend (.env)
VITE_API_BASE_URL=http://localhost:8000

# Backend (.env)
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
```

## 🔧 **API Client Features**

### **Error Handling:**
- Retry mechanism (3 attempts)
- Network error handling
- HTTP status error handling
- Fallback to local storage

### **Caching:**
- Local storage for offline mode
- Thread persistence
- Message history

### **Type Safety:**
- TypeScript interfaces
- API response types
- Error types

## 📊 **Data Flow**

```
User Action → Frontend Hook → API Client → Backend API → Database/AI
     ↓              ↓              ↓           ↓
UI Update ← State Update ← Response ← Business Logic
```

## 🛡️ **Security**

### **Frontend:**
- No sensitive data storage
- API key không expose
- CORS configuration

### **Backend:**
- API key management
- Authentication
- Rate limiting
- Input validation

## 🚀 **Deployment**

### **Frontend:**
- Static hosting (Vercel, Netlify)
- Environment variables
- Build optimization

### **Backend:**
- Cloud hosting (Railway, Heroku, AWS)
- Database connection
- Environment variables

## 📝 **Best Practices**

### **Frontend:**
- Keep API client thin
- Handle errors gracefully
- Use TypeScript
- Cache appropriately

### **Backend:**
- RESTful API design
- Proper error responses
- Input validation
- Documentation (OpenAPI)

## 🔍 **Debugging**

### **Frontend:**
```typescript
// Enable API logging
console.log('API Request:', { url, method, body });
console.log('API Response:', response);
```

### **Backend:**
```python
# Enable request logging
import logging
logging.basicConfig(level=logging.INFO)
```

## 📚 **Documentation**

- [Frontend README](../README.md)
- [Backend README](../../LangChain-ChatBot-Backend/README.md)
- [API Documentation](../../LangChain-ChatBot-Backend/docs/api.md)
