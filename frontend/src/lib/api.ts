// API Client for VintageVision
// Self-Hosted Backend Integration
// October 2025

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
      credentials: 'include', // Important for session cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Authentication
  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  // Analysis
  async analyzeImage(imageData: string) {
    return this.request('/analyze', {
      method: 'POST',
      body: JSON.stringify({ image: imageData }),
    });
  }

  async getAnalysis(id: string) {
    return this.request(`/analyze/${id}`);
  }

  // Collection
  async getCollection() {
    return this.request('/collection');
  }

  async saveToCollection(itemAnalysisId: string, notes?: string, location?: string) {
    return this.request('/collection', {
      method: 'POST',
      body: JSON.stringify({ itemAnalysisId, notes, location }),
    });
  }

  async updateCollectionItem(id: string, updates: { notes?: string; location?: string }) {
    return this.request(`/collection/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async removeFromCollection(id: string) {
    return this.request(`/collection/${id}`, {
      method: 'DELETE',
    });
  }

  // Wishlist
  async getWishlist() {
    return this.request('/collection/wishlist');
  }

  // Preferences
  async getPreferences() {
    return this.request('/preferences');
  }

  async updatePreferences(preferences: Record<string, unknown>) {
    return this.request('/preferences', {
      method: 'POST',
      body: JSON.stringify(preferences),
    });
  }

  // Feedback
  async submitFeedback(data: {
    itemAnalysisId: string;
    isCorrect: boolean;
    correctionText?: string;
    feedbackType: 'accuracy' | 'styling' | 'value';
  }) {
    return this.request('/feedback', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
export default api;
