// Frontend API Client - chỉ gọi Backend APIs
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

// Frontend API Client - chỉ gọi Backend APIs
export const api = {
  // Health check - gọi Backend API
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

  // Tạo thread mới - gọi Backend API
  async createThread(title: string): Promise<{ id: string }> {
    try {
      return await apiRequest<{ id: string }>(`${API_BASE_URL}/threads`, {
        method: 'POST',
        body: JSON.stringify({ title })
      });
    } catch (error) {
      // Fallback: tạo local thread nếu Backend không có API
      console.warn('Backend API not available, creating local thread:', error);
      const id = Math.random().toString(36).substr(2, 9);
      return { id };
    }
  },

  // Gửi message - gọi Backend API
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
    console.log('Sending message to Backend:', { threadId, content });
    
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

  // Lấy messages của thread từ Backend API
  async getMessages(threadId: string): Promise<Message[]> {
    console.log('Loading messages from Backend API for thread:', threadId);
    return await apiRequest<Message[]>(`${API_BASE_URL}/threads/${threadId}/messages`);
  },

  // Cập nhật tên thread - gọi Backend API
  async updateThreadTitle(threadId: string, title: string): Promise<{ ok: boolean }> {
    console.log('Updating thread title via API:', { threadId, title });
    const response = await apiRequest<{ ok: boolean }>(`${API_BASE_URL}/threads/${threadId}`, {
      method: 'PUT',
      body: JSON.stringify({ title })
    });
    return response;
  },

  // Lấy tất cả threads từ Backend API
  async getAllThreads(): Promise<Thread[]> {
    console.log('Loading threads from Backend API...');
    return await apiRequest<Thread[]>(`${API_BASE_URL}/threads`);
  },

  // Xóa thread - gọi Backend API
  async deleteThread(threadId: string): Promise<{ ok: boolean }> {
    console.log('API deleteThread called with:', threadId);
    const response = await apiRequest<{ ok: boolean }>(`${API_BASE_URL}/threads/${threadId}`, {
      method: 'DELETE'
    });
    console.log('API deleteThread response:', response);
    return response;
  }
};
