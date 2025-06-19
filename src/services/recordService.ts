
import { Record, CreateRecordData } from '@/types/record';

const API_BASE_URL = 'http://localhost:3000';

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const recordService = {
  async getRecords(query?: string, page = 1, pageSize = 10) {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    const response = await fetch(`${API_BASE_URL}/records?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch records');
    }

    return await response.json();
  },

  async getRecord(id: string): Promise<Record | null> {
    const response = await fetch(`${API_BASE_URL}/records/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch record');
    }

    return await response.json();
  },

  async createRecord(data: CreateRecordData): Promise<Record> {
    const response = await fetch(`${API_BASE_URL}/records`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create record');
    }

    return await response.json();
  },

  async updateRecord(id: string, data: Partial<Record>): Promise<Record> {
    const response = await fetch(`${API_BASE_URL}/records/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update record');
    }

    return await response.json();
  },

  async lockRecord(id: string, userId: string): Promise<Record> {
    const response = await fetch(`${API_BASE_URL}/records/${id}/lock`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to lock record');
    }

    return await response.json();
  },

  async unlockRecord(id: string): Promise<Record> {
    const response = await fetch(`${API_BASE_URL}/records/${id}/unlock`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to unlock record');
    }

    return await response.json();
  },
};
