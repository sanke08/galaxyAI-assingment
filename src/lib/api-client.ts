/**
 * API Client
 * 
 * Client for interacting with the Next.js API routes.
 */

export interface Workflow {
  id: string;
  name: string;
  thumbnail?: string | null;
  folderId?: string | null;
  createdAt: Date | string; 
  updatedAt: Date | string;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string | null; 
  fileCount?: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.statusText}`);
  }

  // Handle void responses (204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  workflows: {
    list: async (folderId?: string | null): Promise<Workflow[]> => {
      const params = new URLSearchParams();
      if (folderId !== undefined && folderId !== null) {
        params.set('folderId', folderId);
      }
      const query = params.toString() ? `?${params.toString()}` : '';
      const data = await apiRequest<{ workflows: Workflow[] }>(`/api/workflows${query}`);
      return data.workflows || [];
    },

    create: async (data: { name: string; folderId?: string | null }): Promise<Workflow> => {
      const response = await apiRequest<{ workflow: Workflow }>('/api/workflows', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.workflow;
    },

    get: async (id: string): Promise<Workflow> => {
      const response = await apiRequest<{ workflow: Workflow }>(`/api/workflows/${id}`);
      return response.workflow;
    },

    update: async (id: string, data: Partial<Workflow>): Promise<Workflow> => {
      const response = await apiRequest<{ workflow: Workflow }>(`/api/workflows/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return response.workflow;
    },

    delete: async (id: string): Promise<void> => {
      return apiRequest<void>(`/api/workflows/${id}`, {
        method: 'DELETE',
      });
    },
  },

  folders: {
    list: async (parentId?: string | null): Promise<Folder[]> => {
      const params = new URLSearchParams();
      if (parentId !== undefined && parentId !== null) {
        params.set('parentId', parentId);
      }
      const query = params.toString() ? `?${params.toString()}` : '';
      const data = await apiRequest<{ folders: Folder[] }>(`/api/folders${query}`);
      return data.folders || [];
    },

    create: async (data: { name: string; parentId?: string | null }): Promise<Folder> => {
      const response = await apiRequest<{ folder: Folder }>('/api/folders', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.folder;
    },

    get: async (id: string): Promise<Folder> => {
      const response = await apiRequest<{ folder: Folder }>(`/api/folders/${id}`);
      return response.folder;
    },

    update: async (id: string, data: { name: string }): Promise<Folder> => {
      const response = await apiRequest<{ folder: Folder }>(`/api/folders/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return response.folder;
    },

    delete: async (id: string): Promise<void> => {
      return apiRequest<void>(`/api/folders/${id}`, {
        method: 'DELETE',
      });
    },
  },
};

export default api;
