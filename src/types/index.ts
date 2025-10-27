// ===== CORE TYPES =====

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  files?: File[];
}

export interface Thread {
  id: string;
  title: string;
  updatedAt: string;
  messages: Message[];
}

// ===== API REQUEST TYPES =====

// Health Check
export interface HealthCheckRequest {
  // No body needed for health check
}

export interface HealthCheckResponse {
  ok: boolean;
  timestamp?: string;
  version?: string;
}

// Create Thread
export interface CreateThreadRequest {
  title: string;
}

export interface CreateThreadResponse {
  id: string;
  title: string;
  createdAt: string;
}

// Send Message
export interface SendMessageRequest {
  content: string;
  metadata?: Record<string, any>;
}

export interface SendMessageResponse {
  thread_id: string;
  user_message_id: string;
  assistant_message_id: string;
  assistant: {
    content: string;
    model?: string;
    usage?: {
      prompt_tokens?: number;
      completion_tokens?: number;
      total_tokens?: number;
    };
  };
}

// Get Messages - Backend trả về list[MessageResponse] trực tiếp
export type GetMessagesResponse = Message[];

// Update Thread
export interface UpdateThreadRequest {
  title: string;
}

export interface UpdateThreadResponse {
  ok: boolean;
  thread_id: string;
  updated_at: string;
}

// Get All Threads - Backend trả về List[ThreadResponse] trực tiếp
export type GetAllThreadsResponse = Thread[];

// Delete Thread
export interface DeleteThreadResponse {
  ok: boolean;
  thread_id: string;
  deleted_at: string;
}

// ===== API ERROR TYPES =====

export interface ApiErrorResponse {
  error: string;
  message: string;
  status_code: number;
  details?: Record<string, any>;
}

// ===== UI STATE TYPES =====

export interface AppState {
  threads: Thread[];
  currentThreadId: string | null;
  darkMode: boolean;
  loading: boolean;
  error: string | null;
}

export interface MessageState {
  messages: Message[];
  typing: boolean;
  error: string | null;
}

export interface ThreadState {
  threads: Thread[];
  currentThread: Thread | null;
  loading: boolean;
  error: string | null;
}

// ===== COMPONENT PROPS TYPES =====

export interface ChatContainerProps {
  thread: Thread;
  onThreadUpdate: (threadId: string, updates: Partial<Thread>) => void;
  dark: boolean;
  toggleDarkMode: () => void;
}

export interface MessageListProps {
  messages: Message[];
  typing: boolean;
}

export interface ChatInputProps {
  onSend: (text: string, files?: File[]) => void;
  disabled?: boolean;
}

export interface SidebarProps {
  threads: Thread[];
  currentThreadId: string | null;
  onThreadSelect: (threadId: string) => void;
  onThreadCreate: () => void;
  onThreadDelete: (threadId: string) => void;
  onThreadUpdate: (threadId: string, updates: Partial<Thread>) => void;
  dark: boolean;
  toggleDarkMode: () => void;
}

// ===== UTILITY TYPES =====

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiRequestConfig {
  method: ApiMethod;
  body?: any;
  headers?: Record<string, string>;
  retries?: number;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

// ===== FILE UPLOAD TYPES =====

export interface FileUploadRequest {
  file: File;
  thread_id: string;
  metadata?: Record<string, any>;
}

export interface FileUploadResponse {
  file_id: string;
  filename: string;
  size: number;
  mime_type: string;
  url?: string;
}

// ===== CONFIGURATION TYPES =====

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface AppConfig {
  api: ApiConfig;
  ui: {
    defaultTheme: 'light' | 'dark';
    maxMessageLength: number;
    maxFileSize: number;
    allowedFileTypes: string[];
  };
}