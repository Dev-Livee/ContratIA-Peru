import api from './api';

export const projectsService = {
  list: (params?: Record<string, string>) => api.get('/projects', { params }),
  get: (id: string) => api.get(`/projects/${id}`),
  create: (data: Record<string, unknown>) => api.post('/projects', data),
  update: (id: string, data: Record<string, unknown>) => api.patch(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
  uploadFile: (id: string, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post(`/projects/${id}/files`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
};

export const providersService = {
  list: (params?: Record<string, string>) => api.get('/providers', { params }),
  get: (id: string) => api.get(`/providers/${id}`),
  compare: (ids: string[]) => api.post('/providers/compare', { ids }),
  getRecommendation: (projectId: string) => api.get(`/projects/${projectId}/recommendations`),
};
