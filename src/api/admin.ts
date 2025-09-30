export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  active: boolean;
  createdAt: string;
}

export interface AdminLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  details: string;
  status: 'success' | 'error';
}

const mockUsers: AdminUser[] = [
  {
    id: '1',
    email: 'user1@example.com',
    name: 'John Doe',
    role: 'user',
    active: true,
    createdAt: '2025-09-01T10:00:00Z',
  },
  {
    id: '2',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    active: true,
    createdAt: '2025-08-15T09:00:00Z',
  },
];

const mockLogs: AdminLog[] = [
  {
    id: '1',
    timestamp: '2025-09-30T10:30:00Z',
    userId: '1',
    action: 'image_upload',
    details: 'Uploaded 5 images',
    status: 'success',
  },
  {
    id: '2',
    timestamp: '2025-09-30T09:15:00Z',
    userId: '2',
    action: 'user_login',
    details: 'Admin login',
    status: 'success',
  },
];

export const adminApi = {
  getUsers: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUsers;
  },

  updateUser: async (id: string, updates: Partial<AdminUser>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },

  getLogs: async (filters?: { userId?: string; action?: string; status?: string }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockLogs;
  },
};