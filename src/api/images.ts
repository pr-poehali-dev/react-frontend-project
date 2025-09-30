import axios from 'axios';

export interface Detection {
  id: string;
  class: string;
  confidence: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  address?: string;
}

export interface ImageMetadata {
  id: string;
  filename: string;
  uploadedAt: string;
  status: 'queued' | 'processing' | 'done' | 'failed';
  source: string;
  detections: Detection[];
  exif?: {
    camera?: string;
    lens?: string;
    iso?: number;
    aperture?: string;
    shutterSpeed?: string;
  };
  gps?: {
    lat: number;
    lng: number;
  };
  url: string;
  thumbnailUrl: string;
}

export interface SearchHistory {
  id: string;
  imageUrl: string;
  timestamp: string;
  results: ImageMetadata[];
}

const mockImages: ImageMetadata[] = [
  {
    id: '1',
    filename: 'sample1.jpg',
    uploadedAt: '2025-09-28T10:30:00Z',
    status: 'done',
    source: 'upload',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200',
    detections: [
      {
        id: 'd1',
        class: 'person',
        confidence: 0.95,
        bbox: { x: 100, y: 150, width: 200, height: 300 },
        address: 'Main St, City',
      },
    ],
    gps: { lat: 55.7558, lng: 37.6173 },
  },
  {
    id: '2',
    filename: 'sample2.jpg',
    uploadedAt: '2025-09-29T14:20:00Z',
    status: 'done',
    source: 'import',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    thumbnailUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200',
    detections: [
      {
        id: 'd2',
        class: 'car',
        confidence: 0.88,
        bbox: { x: 50, y: 100, width: 300, height: 200 },
      },
    ],
    gps: { lat: 59.9343, lng: 30.3351 },
  },
];

let searchHistoryData: SearchHistory[] = [];

export const imagesApi = {
  upload: async (file: File) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: `img_${Date.now()}`,
      status: 'processing' as const,
      filename: file.name,
    };
  },

  importZip: async (file: File, onProgress?: (progress: number) => void) => {
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      onProgress?.(i);
    }
    return {
      success: true,
      imported: 10,
    };
  },

  getImages: async (filters?: { source?: string; status?: string; date?: string }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockImages;
  },

  getImage: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockImages.find(img => img.id === id) || mockImages[0];
  },

  getDetections: async (filters?: { class?: string; minConfidence?: number }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockImages.flatMap(img => 
      img.detections.map(det => ({
        ...det,
        imageId: img.id,
        imageUrl: img.thumbnailUrl,
      }))
    );
  },

  searchByImage: async (file: File) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const searchResult: SearchHistory = {
      id: `search_${Date.now()}`,
      imageUrl: URL.createObjectURL(file),
      timestamp: new Date().toISOString(),
      results: mockImages.slice(0, 2),
    };
    
    searchHistoryData = [searchResult, ...searchHistoryData];
    
    return {
      results: mockImages.slice(0, 2),
      total: 2,
    };
  },

  getSearchHistory: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return searchHistoryData;
  },

  exportData: async (format: 'xlsx' | 'zip', filters?: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return new Blob(['mock data'], { type: 'application/octet-stream' });
  },
};