// API service để kết nối với backend
import { config } from '../config/environment';

const API_BASE_URL = config.API_BASE_URL;

// API Error class for better error handling
export class ApiError extends Error {
  public status?: number;
  public response?: Response;

  constructor(message: string, status?: number, response?: Response) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}

// Enhanced fetch wrapper with error handling
async function apiRequest<T>(
  url: string, 
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(
        `HTTP ${response.status}: ${errorText || response.statusText}`,
        response.status,
        response
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export interface Thread {
  id: string;
  title: string;
  updatedAt: string;
  messages: Message[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  files?: File[];
}

// API functions with enhanced error handling
export const api = {
  // Health check with retry mechanism
  async health(retries: number = config.API_RETRY_ATTEMPTS): Promise<{ ok: boolean }> {
    for (let i = 0; i < retries; i++) {
      try {
        return await apiRequest<{ ok: boolean }>(`${API_BASE_URL}/health`);
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    throw new ApiError('Health check failed after retries');
  },

  // Tạo thread mới (local only - backend không có API này)
  async createThread(title: string): Promise<{ id: string }> {
    console.log('Creating thread locally:', title);
    // Tạo thread ID local
    const id = Math.random().toString(36).substr(2, 9);
    return { id };
  },

  // Gửi message và nhận response từ AI với retry mechanism
  async sendMessage(threadId: string, content: string, retries: number = config.API_RETRY_ATTEMPTS): Promise<{
    thread_id: string;
    user_message_id: string;
    assistant_message_id: string;
    assistant: {
      content: string;
      model?: string;
      usage?: any;
    };
  }> {
    console.log('Sending message:', { threadId, content });
    
    for (let i = 0; i < retries; i++) {
      try {
        return await apiRequest<{
          thread_id: string;
          user_message_id: string;
          assistant_message_id: string;
          assistant: {
            content: string;
            model?: string;
            usage?: any;
          };
        }>(`${API_BASE_URL}/threads/${threadId}/messages`, {
          method: 'POST',
          body: JSON.stringify({ 
            content,
            metadata: {}
          }),
        });
      } catch (error) {
        if (i === retries - 1) throw error;
        console.warn(`Message send attempt ${i + 1} failed, retrying...`, error);
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    throw new ApiError('Failed to send message after retries');
  },

  // Lấy messages của thread (local storage - backend không có API này)
  async getMessages(threadId: string): Promise<Message[]> {
    // Lấy từ localStorage
    const stored = localStorage.getItem(`thread_${threadId}_messages`);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  },

  // Lưu messages vào localStorage
  async saveMessages(threadId: string, messages: Message[]): Promise<void> {
    localStorage.setItem(`thread_${threadId}_messages`, JSON.stringify(messages));
  },

  // Cập nhật tên thread (local only)
  async updateThreadTitle(threadId: string, title: string): Promise<{ ok: boolean }> {
    console.log('Updating thread title locally:', { threadId, title });
    // Lưu vào localStorage
    const stored = localStorage.getItem(`thread_${threadId}`);
    if (stored) {
      const thread = JSON.parse(stored);
      thread.title = title;
      thread.updatedAt = new Date().toISOString();
      localStorage.setItem(`thread_${threadId}`, JSON.stringify(thread));
    }
    return { ok: true };
  },

  // Lấy tất cả threads từ localStorage
  async getAllThreads(): Promise<Thread[]> {
    try {
      console.log('Loading threads from localStorage...');
      
      const threads: Thread[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('thread_') && !key.includes('_messages')) {
          const threadId = key.replace('thread_', '');
          const stored = localStorage.getItem(key);
          if (stored) {
            const thread = JSON.parse(stored);
            const messages = await this.getMessages(threadId);
            threads.push({
              ...thread,
              messages
            });
          }
        }
      }
      
      // Sắp xếp theo updatedAt
      threads.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      
      console.log('Threads loaded:', threads);
      return threads;
    } catch (error) {
      console.error('Error loading threads:', error);
      return [];
    }
  },

  // Lưu thread vào localStorage
  async saveThread(thread: Thread): Promise<void> {
    localStorage.setItem(`thread_${thread.id}`, JSON.stringify(thread));
  }
};
