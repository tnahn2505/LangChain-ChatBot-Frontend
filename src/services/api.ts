// Frontend API Client - chỉ gọi Backend APIs
import { config } from '../config/environment';
import type {
  HealthCheckResponse,
  CreateThreadRequest,
  CreateThreadResponse,
  SendMessageRequest,
  SendMessageResponse,
  UpdateThreadRequest,
  UpdateThreadResponse,
  DeleteThreadResponse,
  ApiErrorResponse,
  Message,
  Thread
} from '../types';

const API_BASE_URL = config.API_BASE_URL;

// API Error class for better error handling
export class ApiError extends Error {
  public status?: number;
  public response?: Response;
  public details?: ApiErrorResponse;

  constructor(message: string, status?: number, response?: Response, details?: ApiErrorResponse) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
    this.details = details;
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
      let errorDetails: ApiErrorResponse | undefined;
      try {
        errorDetails = await response.json();
      } catch {
        // If response is not JSON, use text
      }
      
      const errorText = errorDetails?.message || await response.text() || response.statusText;
      throw new ApiError(
        `HTTP ${response.status}: ${errorText}`,
        response.status,
        response,
        errorDetails
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

// Frontend API Client - chỉ gọi Backend APIs
export const api = {
  // Health check - gọi Backend API
  async health(retries: number = config.API_RETRY_ATTEMPTS): Promise<HealthCheckResponse> {
    for (let i = 0; i < retries; i++) {
      try {
        return await apiRequest<HealthCheckResponse>(`${API_BASE_URL}/health`);
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    throw new ApiError('Health check failed after retries');
  },

  // Tạo thread mới - gọi Backend API
  async createThread(request: CreateThreadRequest): Promise<CreateThreadResponse> {
    try {
      return await apiRequest<CreateThreadResponse>(`${API_BASE_URL}/threads`, {
        method: 'POST',
        body: JSON.stringify(request)
      });
    } catch (error) {
      // Fallback: tạo local thread nếu Backend không có API
      console.warn('Backend API not available, creating local thread:', error);
      const id = Math.random().toString(36).substr(2, 9);
      return { 
        id, 
        title: request.title,
        createdAt: new Date().toISOString()
      };
    }
  },

  // Gửi message - gọi Backend API
  async sendMessage(
    threadId: string, 
    request: SendMessageRequest, 
    retries: number = config.API_RETRY_ATTEMPTS
  ): Promise<SendMessageResponse> {
    console.log('Sending message to Backend:', { threadId, request });
    
    for (let i = 0; i < retries; i++) {
      try {
        return await apiRequest<SendMessageResponse>(`${API_BASE_URL}/threads/${threadId}/messages`, {
          method: 'POST',
          body: JSON.stringify(request),
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
    const response = await apiRequest<Message[]>(`${API_BASE_URL}/threads/${threadId}/messages`);
    return response;
  },

  // Cập nhật tên thread - gọi Backend API
  async updateThreadTitle(threadId: string, request: UpdateThreadRequest): Promise<UpdateThreadResponse> {
    console.log('Updating thread title via API:', { threadId, request });
    return await apiRequest<UpdateThreadResponse>(`${API_BASE_URL}/threads/${threadId}`, {
      method: 'PUT',
      body: JSON.stringify(request)
    });
  },

  // Lấy tất cả threads từ Backend API
  async getAllThreads(): Promise<Thread[]> {
    console.log('Loading threads from Backend API...');
    const response = await apiRequest<Thread[]>(`${API_BASE_URL}/threads`);
    return response;
  },

  // Xóa thread - gọi Backend API
  async deleteThread(threadId: string): Promise<DeleteThreadResponse> {
    console.log('=== API DELETE THREAD DEBUG ===');
    console.log('API deleteThread called with:', threadId);
    console.log('Thread ID type:', typeof threadId);
    console.log('API URL:', `${API_BASE_URL}/threads/${threadId}`);
    
    try {
      const response = await apiRequest<DeleteThreadResponse>(`${API_BASE_URL}/threads/${threadId}`, {
        method: 'DELETE'
      });
      console.log('API deleteThread response:', response);
      console.log('=== API DELETE THREAD SUCCESS ===');
      return response;
    } catch (error) {
      console.error('=== API DELETE THREAD ERROR ===');
      console.error('API delete error:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }
};
