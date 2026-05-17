import type { AxiosInstance } from 'axios';
import axios from 'axios';
import type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Conversation,
  Message,
  CreateConversationRequest,
  SendMessageRequest,
  SendMessageResponse,
  UserStats,
  SystemStatistics,
} from '../types/index';
import {
  mockUsers,
  mockConversations,
  mockMessages,
  generateAIResponse,
} from './mockData';

// Simulate network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Create axios instance (will use real API later)
const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock API Class
class MockAPI {
  private users: User[] = JSON.parse(JSON.stringify(mockUsers));
  private conversations: Conversation[] = JSON.parse(
    JSON.stringify(mockConversations)
  );
  private messages: Message[] = JSON.parse(JSON.stringify(mockMessages));
  private nextConversationId = 6;
  private nextMessageId = 9;

  // ===== AUTHENTICATION ENDPOINTS =====

  async register(data: RegisterRequest): Promise<AuthResponse> {
    await delay(1200);

    // Validation
    if (!data.username || !data.email || !data.password) {
      return {
        success: false,
        message: 'All fields are required',
        error: 'VALIDATION_ERROR',
      };
    }

    if (data.password !== data.confirmPassword) {
      return {
        success: false,
        message: 'Passwords do not match',
        error: 'PASSWORD_MISMATCH',
      };
    }

    if (data.password.length < 6) {
      return {
        success: false,
        message: 'Password must be at least 6 characters',
        error: 'PASSWORD_TOO_SHORT',
      };
    }

    // Check if user already exists
    if (
      this.users.some(
        (u) => u.username === data.username || u.email === data.email
      )
    ) {
      return {
        success: false,
        message: 'Username or email already exists',
        error: 'USER_EXISTS',
      };
    }

    // Create new user
    const newUser: User = {
      id: Math.max(...this.users.map((u) => u.id), 0) + 1,
      username: data.username,
      email: data.email,
      role: 'USER',
      chatLimit: 10,
      totalChats: 0,
      totalMessages: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.push(newUser);

    const token = this.generateMockToken(newUser);

    return {
      success: true,
      message: 'Registration successful',
      data: {
        user: newUser,
        token: token,
        refreshToken: token, // In real API, different refresh token
      },
    };
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    await delay(1000);

    if (!data.username || !data.password) {
      return {
        success: false,
        message: 'Username and password are required',
        error: 'VALIDATION_ERROR',
      };
    }

    // Find user
    const user = this.users.find((u) => u.username === data.username);

    if (!user) {
      return {
        success: false,
        message: 'Invalid username or password',
        error: 'AUTH_FAILED',
      };
    }

    // Simple password validation for mock (in real app, would validate hashed password)
    if (data.password !== 'admin123' && data.password !== 'password123') {
      return {
        success: false,
        message: 'Invalid username or password',
        error: 'AUTH_FAILED',
      };
    }

    const token = this.generateMockToken(user);

    return {
      success: true,
      message: 'Login successful',
      data: {
        user: user,
        token: token,
        refreshToken: token,
      },
    };
  }

  async getProfile(token: string): Promise<AuthResponse> {
    await delay(500);

    if (!token) {
      return {
        success: false,
        message: 'Unauthorized',
        error: 'NO_TOKEN',
      };
    }

    // Decode mock token (simplified)
    const decodedUser = this.decodeMockToken(token);

    if (!decodedUser) {
      return {
        success: false,
        message: 'Invalid token',
        error: 'INVALID_TOKEN',
      };
    }

    return {
      success: true,
      message: 'Profile retrieved',
      data: {
        user: decodedUser,
        token: token,
        refreshToken: token,
      },
    };
  }

  async refreshToken(token: string): Promise<AuthResponse> {
    await delay(300);

    if (!token) {
      return {
        success: false,
        message: 'Unauthorized',
        error: 'NO_TOKEN',
      };
    }

    const decodedUser = this.decodeMockToken(token);

    if (!decodedUser) {
      return {
        success: false,
        message: 'Invalid token',
        error: 'INVALID_TOKEN',
      };
    }

    const newToken = this.generateMockToken(decodedUser);

    return {
      success: true,
      message: 'Token refreshed',
      data: {
        user: decodedUser,
        token: newToken,
        refreshToken: newToken,
      },
    };
  }

  // ===== CHAT ENDPOINTS =====

  async createConversation(
    data: CreateConversationRequest,
    userId: number
  ): Promise<{ success: boolean; data?: Conversation; error?: string }> {
    await delay(800);

    if (!data.title) {
      return {
        success: false,
        error: 'Title is required',
      };
    }

    const newConversation: Conversation = {
      id: this.nextConversationId++,
      userId: userId,
      title: data.title,
      messageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.conversations.push(newConversation);

    return {
      success: true,
      data: newConversation,
    };
  }

  async getConversations(userId: number): Promise<{
    success: boolean;
    data?: Conversation[];
    error?: string;
  }> {
    await delay(600);

    const userConversations = this.conversations.filter(
      (c) => c.userId === userId
    );

    return {
      success: true,
      data: userConversations.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ),
    };
  }

  async getConversation(conversationId: number): Promise<{
    success: boolean;
    data?: Conversation;
    error?: string;
  }> {
    await delay(400);

    const conversation = this.conversations.find((c) => c.id === conversationId);

    if (!conversation) {
      return {
        success: false,
        error: 'Conversation not found',
      };
    }

    return {
      success: true,
      data: conversation,
    };
  }

  async updateConversation(
    conversationId: number,
    title: string
  ): Promise<{ success: boolean; data?: Conversation; error?: string }> {
    await delay(500);

    const conversation = this.conversations.find((c) => c.id === conversationId);

    if (!conversation) {
      return {
        success: false,
        error: 'Conversation not found',
      };
    }

    conversation.title = title;
    conversation.updatedAt = new Date().toISOString();

    return {
      success: true,
      data: conversation,
    };
  }

  async sendMessage(
    conversationId: number,
    data: SendMessageRequest
  ): Promise<SendMessageResponse> {
    await delay(1500); // Longer delay to simulate AI processing

    if (!data.message) {
      return {
        success: false,
        error: 'Message cannot be empty',
      };
    }

    const conversation = this.conversations.find((c) => c.id === conversationId);

    if (!conversation) {
      return {
        success: false,
        error: 'Conversation not found',
      };
    }

    // Create user message
    const userMessage: Message = {
      id: this.nextMessageId++,
      conversationId: conversationId,
      sender: 'user',
      content: data.message,
      createdAt: new Date().toISOString(),
    };

    this.messages.push(userMessage);

    // Generate AI response
    const aiResponseText = generateAIResponse(data.message);
    const aiMessage: Message = {
      id: this.nextMessageId++,
      conversationId: conversationId,
      sender: 'ai',
      content: aiResponseText,
      createdAt: new Date().toISOString(),
    };

    this.messages.push(aiMessage);

    // Update conversation
    conversation.messageCount += 2;
    conversation.updatedAt = new Date().toISOString();

    return {
      success: true,
      data: {
        userMessage,
        aiMessage,
      },
    };
  }

  async getMessages(conversationId: number): Promise<{
    success: boolean;
    data?: Message[];
    error?: string;
  }> {
    await delay(500);

    const conversationMessages = this.messages
      .filter((m) => m.conversationId === conversationId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

    return {
      success: true,
      data: conversationMessages,
    };
  }

  async deleteConversation(conversationId: number): Promise<{
    success: boolean;
    error?: string;
  }> {
    await delay(600);

    const index = this.conversations.findIndex((c) => c.id === conversationId);

    if (index === -1) {
      return {
        success: false,
        error: 'Conversation not found',
      };
    }

    this.conversations.splice(index, 1);

    // Also delete messages in this conversation
    this.messages = this.messages.filter(
      (m) => m.conversationId !== conversationId
    );

    return {
      success: true,
    };
  }

  // ===== ADMIN ENDPOINTS =====

  async getAllUsers(userId: number): Promise<{
    success: boolean;
    data?: UserStats[];
    error?: string;
  }> {
    await delay(800);

    // Check if user is admin
    const user = this.users.find((u) => u.id === userId);
    if (!user || user.role !== 'ADMIN') {
      return {
        success: false,
        error: 'Unauthorized - Admin access required',
      };
    }

    const userStats: UserStats[] = this.users.map((u) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      chatLimit: u.chatLimit,
      totalChats: u.totalChats,
      totalMessages: u.totalMessages,
      createdAt: u.createdAt,
    }));

    return {
      success: true,
      data: userStats,
    };
  }

  async getSingleUser(userId: number, targetUserId: number): Promise<{
    success: boolean;
    data?: UserStats;
    error?: string;
  }> {
    await delay(500);

    // Check if requester is admin
    const requester = this.users.find((u) => u.id === userId);
    if (!requester || requester.role !== 'ADMIN') {
      return {
        success: false,
        error: 'Unauthorized - Admin access required',
      };
    }

    const targetUser = this.users.find((u) => u.id === targetUserId);
    if (!targetUser) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    const userStats: UserStats = {
      id: targetUser.id,
      username: targetUser.username,
      email: targetUser.email,
      chatLimit: targetUser.chatLimit,
      totalChats: targetUser.totalChats,
      totalMessages: targetUser.totalMessages,
      createdAt: targetUser.createdAt,
    };

    return {
      success: true,
      data: userStats,
    };
  }

  async updateUserSettings(
    userId: number,
    targetUserId: number,
    chatLimit: number
  ): Promise<{ success: boolean; data?: UserStats; error?: string }> {
    await delay(700);

    // Check if requester is admin
    const requester = this.users.find((u) => u.id === userId);
    if (!requester || requester.role !== 'ADMIN') {
      return {
        success: false,
        error: 'Unauthorized - Admin access required',
      };
    }

    const targetUser = this.users.find((u) => u.id === targetUserId);
    if (!targetUser) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    targetUser.chatLimit = chatLimit;
    targetUser.updatedAt = new Date().toISOString();

    const userStats: UserStats = {
      id: targetUser.id,
      username: targetUser.username,
      email: targetUser.email,
      chatLimit: targetUser.chatLimit,
      totalChats: targetUser.totalChats,
      totalMessages: targetUser.totalMessages,
      createdAt: targetUser.createdAt,
    };

    return {
      success: true,
      data: userStats,
    };
  }

  async getStatistics(userId: number): Promise<{
    success: boolean;
    data?: SystemStatistics;
    error?: string;
  }> {
    await delay(900);

    // Check if user is admin
    const user = this.users.find((u) => u.id === userId);
    if (!user || user.role !== 'ADMIN') {
      return {
        success: false,
        error: 'Unauthorized - Admin access required',
      };
    }

    const stats: SystemStatistics = {
      totalUsers: this.users.length,
      totalConversations: this.conversations.length,
      totalMessages: this.messages.length,
      activeUsers: Math.floor(this.users.length * 0.75),
      averageChatsPerUser:
        this.conversations.length / Math.max(this.users.length, 1),
      averageMessagesPerChat:
        this.messages.length / Math.max(this.conversations.length, 1),
    };

    return {
      success: true,
      data: stats,
    };
  }

  async deleteUser(userId: number, targetUserId: number): Promise<{
    success: boolean;
    error?: string;
  }> {
    await delay(700);

    // Check if requester is admin
    const requester = this.users.find((u) => u.id === userId);
    if (!requester || requester.role !== 'ADMIN') {
      return {
        success: false,
        error: 'Unauthorized - Admin access required',
      };
    }

    // Cannot delete self
    if (userId === targetUserId) {
      return {
        success: false,
        error: 'Cannot delete your own account',
      };
    }

    const index = this.users.findIndex((u) => u.id === targetUserId);
    if (index === -1) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    // Delete user and their conversations/messages
    const userConversations = this.conversations
      .filter((c) => c.userId === targetUserId)
      .map((c) => c.id);

    this.conversations = this.conversations.filter(
      (c) => c.userId !== targetUserId
    );
    this.messages = this.messages.filter(
      (m) => !userConversations.includes(m.conversationId)
    );

    this.users.splice(index, 1);

    return {
      success: true,
    };
  }

  // ===== HELPER METHODS =====

  private generateMockToken(user: User): string {
    // Simple mock token - in real app would be JWT
    const tokenData = {
      userId: user.id,
      username: user.username,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
    };
    return btoa(JSON.stringify(tokenData));
  }

  private decodeMockToken(token: string): User | null {
    try {
      const decoded = JSON.parse(atob(token));
      const user = this.users.find((u) => u.id === decoded.userId);
      return user || null;
    } catch {
      return null;
    }
  }
}

// Export singleton instance
export const mockAPI = new MockAPI();

// Export API client (will use real endpoints later)
export default apiClient;
