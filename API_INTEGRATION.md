# Интеграция с реальным API

Это руководство покажет, как заменить мок-данные на реальные API запросы.

## Конфигурация базового URL

Создайте файл `src/config/api.ts`:

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

Добавьте в `.env`:
```
VITE_API_URL=https://your-backend-url.com/api
```

## Настройка Axios

Обновите `src/api/auth.ts`:

```typescript
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor для добавления токена
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor для обработки refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });
        
        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);
        
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return apiClient(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (email: string, password: string, name: string) => {
    const response = await apiClient.post('/auth/register', { email, password, name });
    return response.data;
  },

  refresh: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh', { refresh_token: refreshToken });
    return response.data;
  },
};
```

## Обновление Images API

Обновите `src/api/images.ts`:

```typescript
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
});

export const imagesApi = {
  // Загрузка изображения
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await axios.post(
      `${API_BASE_URL}/images/upload`,
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  },

  // Импорт ZIP архива
  importZip: async (file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('archive', file);
    
    const response = await axios.post(
      `${API_BASE_URL}/images/import-zip`,
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress?.(progress);
          }
        },
      }
    );
    
    return response.data;
  },

  // Получить список изображений
  getImages: async (filters?: { source?: string; status?: string; date?: string }) => {
    const params = new URLSearchParams();
    if (filters?.source) params.append('source', filters.source);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.date) params.append('date', filters.date);
    
    const response = await axios.get(
      `${API_BASE_URL}/images?${params.toString()}`,
      { headers: getAuthHeaders() }
    );
    
    return response.data;
  },

  // Получить изображение по ID
  getImage: async (id: string) => {
    const response = await axios.get(
      `${API_BASE_URL}/images/${id}`,
      { headers: getAuthHeaders() }
    );
    
    return response.data;
  },

  // Поиск по изображению
  searchByImage: async (file: File) => {
    const formData = new FormData();
    formData.append('query_image', file);
    
    const response = await axios.post(
      `${API_BASE_URL}/images/search`,
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  },

  // Получить историю поиска
  getSearchHistory: async () => {
    const response = await axios.get(
      `${API_BASE_URL}/search/history`,
      { headers: getAuthHeaders() }
    );
    
    return response.data;
  },

  // Получить детекции
  getDetections: async (filters?: { class?: string; minConfidence?: number }) => {
    const params = new URLSearchParams();
    if (filters?.class) params.append('class', filters.class);
    if (filters?.minConfidence) params.append('min_confidence', filters.minConfidence.toString());
    
    const response = await axios.get(
      `${API_BASE_URL}/detections?${params.toString()}`,
      { headers: getAuthHeaders() }
    );
    
    return response.data;
  },

  // Экспорт данных
  exportData: async (format: 'xlsx' | 'zip', filters?: any) => {
    const response = await axios.post(
      `${API_BASE_URL}/export`,
      { format, filters },
      {
        headers: getAuthHeaders(),
        responseType: 'blob',
      }
    );
    
    return response.data;
  },
};
```

## Формат API ответов

Ваш бэкенд должен возвращать данные в следующем формате:

### POST /auth/login
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "admin | user"
  },
  "access_token": "string",
  "refresh_token": "string"
}
```

### GET /images
```json
[
  {
    "id": "string",
    "filename": "string",
    "uploadedAt": "ISO 8601 date",
    "status": "queued | processing | done | failed",
    "source": "string",
    "url": "string",
    "thumbnailUrl": "string",
    "detections": [...],
    "gps": { "lat": number, "lng": number }
  }
]
```

### POST /images/search
```json
{
  "results": [...], // массив ImageMetadata
  "total": number
}
```

## Обработка ошибок

Рекомендуемый формат ошибок от API:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

Обработка в компонентах:

```typescript
try {
  const result = await imagesApi.searchByImage(file);
  // handle success
} catch (error) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.error?.message || 'Произошла ошибка';
    toast.error(message);
  }
}
```

## Переменные окружения

Создайте файл `.env`:

```env
VITE_API_URL=https://your-backend-url.com/api
VITE_MAX_FILE_SIZE=10485760
VITE_SUPPORTED_FORMATS=image/jpeg,image/png,image/gif,image/webp
```

Использование:

```typescript
const MAX_FILE_SIZE = parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '10485760');
const SUPPORTED_FORMATS = import.meta.env.VITE_SUPPORTED_FORMATS?.split(',') || ['image/*'];
```