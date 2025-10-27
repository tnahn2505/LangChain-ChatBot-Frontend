# Frontend Types Documentation

## Tổng quan

File `src/types/index.ts` chứa tất cả các type definitions cho Frontend, được tổ chức theo các nhóm chức năng:

## 1. Core Types

### Message
```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  files?: File[];
}
```

### Thread
```typescript
interface Thread {
  id: string;
  title: string;
  updatedAt: string;
  messages: Message[];
}
```

## 2. API Request/Response Types

### Health Check
- **Request**: `HealthCheckRequest` (empty)
- **Response**: `HealthCheckResponse`

### Create Thread
- **Request**: `CreateThreadRequest`
- **Response**: `CreateThreadResponse`

### Send Message
- **Request**: `SendMessageRequest`
- **Response**: `SendMessageResponse`

### Get Messages
- **Response**: `GetMessagesResponse`

### Update Thread
- **Request**: `UpdateThreadRequest`
- **Response**: `UpdateThreadResponse`

### Get All Threads
- **Response**: `GetAllThreadsResponse`

### Delete Thread
- **Response**: `DeleteThreadResponse`

## 3. Error Types

### ApiErrorResponse
```typescript
interface ApiErrorResponse {
  error: string;
  message: string;
  status_code: number;
  details?: Record<string, any>;
}
```

## 4. UI State Types

### AppState
```typescript
interface AppState {
  threads: Thread[];
  currentThreadId: string | null;
  darkMode: boolean;
  loading: boolean;
  error: string | null;
}
```

### MessageState
```typescript
interface MessageState {
  messages: Message[];
  typing: boolean;
  error: string | null;
}
```

### ThreadState
```typescript
interface ThreadState {
  threads: Thread[];
  currentThread: Thread | null;
  loading: boolean;
  error: string | null;
}
```

## 5. Component Props Types

### ChatContainerProps
```typescript
interface ChatContainerProps {
  thread: Thread;
  onThreadUpdate: (threadId: string, updates: Partial<Thread>) => void;
  dark: boolean;
  toggleDarkMode: () => void;
}
```

### MessageListProps
```typescript
interface MessageListProps {
  messages: Message[];
  typing: boolean;
}
```

### ChatInputProps
```typescript
interface ChatInputProps {
  onSend: (text: string, files?: File[]) => void;
  disabled?: boolean;
}
```

### SidebarProps
```typescript
interface SidebarProps {
  threads: Thread[];
  currentThreadId: string | null;
  onThreadSelect: (threadId: string) => void;
  onThreadCreate: () => void;
  onThreadDelete: (threadId: string) => void;
  onThreadUpdate: (threadId: string, updates: Partial<Thread>) => void;
  dark: boolean;
  toggleDarkMode: () => void;
}
```

## 6. Utility Types

### ApiMethod
```typescript
type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
```

### ApiRequestConfig
```typescript
interface ApiRequestConfig {
  method: ApiMethod;
  body?: any;
  headers?: Record<string, string>;
  retries?: number;
}
```

### ApiResponse
```typescript
interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}
```

## 7. File Upload Types

### FileUploadRequest
```typescript
interface FileUploadRequest {
  file: File;
  thread_id: string;
  metadata?: Record<string, any>;
}
```

### FileUploadResponse
```typescript
interface FileUploadResponse {
  file_id: string;
  filename: string;
  size: number;
  mime_type: string;
  url?: string;
}
```

## 8. Configuration Types

### ApiConfig
```typescript
interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}
```

### AppConfig
```typescript
interface AppConfig {
  api: ApiConfig;
  ui: {
    defaultTheme: 'light' | 'dark';
    maxMessageLength: number;
    maxFileSize: number;
    allowedFileTypes: string[];
  };
}
```

## Sử dụng

### Import types
```typescript
import type { Message, Thread, SendMessageRequest } from '../types';
```

### Sử dụng trong API calls
```typescript
const request: SendMessageRequest = {
  content: "Hello",
  metadata: {}
};

const response = await api.sendMessage(threadId, request);
```

### Sử dụng trong components
```typescript
interface MyComponentProps {
  message: Message;
  onUpdate: (updates: Partial<Message>) => void;
}
```

## Lợi ích

1. **Type Safety**: TypeScript sẽ kiểm tra types tại compile time
2. **IntelliSense**: IDE sẽ gợi ý properties và methods
3. **Documentation**: Types serve as documentation
4. **Refactoring**: Dễ dàng refactor khi thay đổi structure
5. **API Contract**: Rõ ràng về input/output của API
6. **Error Prevention**: Giảm lỗi runtime do type mismatch
