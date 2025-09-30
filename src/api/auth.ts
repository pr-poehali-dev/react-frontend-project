import axios from 'axios';

const API_BASE_URL = '/api';

export const authApi = {
  login: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      user: {
        id: '1',
        email,
        name: 'Test User',
        role: 'user' as const,
      },
      access_token: 'mock_access_token',
      refresh_token: 'mock_refresh_token',
    };
  },

  register: async (email: string, password: string, name: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      user: {
        id: '1',
        email,
        name,
        role: 'user' as const,
      },
      access_token: 'mock_access_token',
      refresh_token: 'mock_refresh_token',
    };
  },

  refresh: async (refreshToken: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      access_token: 'new_mock_access_token',
    };
  },
};