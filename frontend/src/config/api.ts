import { Startup } from '@/types/startup';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export const API_ROUTES = {
  AUTH: {
    SIGNUP: `${API_BASE_URL}/auth/signup`,
    SIGNIN: `${API_BASE_URL}/auth/signin`,
    SIGNOUT: `${API_BASE_URL}/auth/signout`,
    UPDATE_PASSWORD: `${API_BASE_URL}/auth/password/update`
  },
  PROFILE: {
    GET: `${API_BASE_URL}/profile`,
    UPDATE: `${API_BASE_URL}/profile`,
    DELETE: `${API_BASE_URL}/profile`,
    UPLOAD_PROFILE_PICTURE: `${API_BASE_URL}/profile/upload-profile-picture`
  },
  STARTUPS: {
    BASE: `${API_BASE_URL}/entrepreneur/startups`,
    DETAIL: (id: string) => `${API_BASE_URL}/entrepreneur/startups/${id}`,
    UPLOAD_LOGO: `${API_BASE_URL}/entrepreneur/upload-startup-logo` // Add this new route
  },
  INVESTOR_PROFILE: {
    GET: `${API_BASE_URL}/investor/profile`,
    UPDATE: `${API_BASE_URL}/investor/profile`,
    UPLOAD_PROFILE_PICTURE: `${API_BASE_URL}/investor/profile/upload-profile-picture`,
    GET_ALL: `${API_BASE_URL}/investor/profile/all`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/investor/profile/${id}` // Fixed to include ID parameter
  },
  INVESTOR: {
    STARTUPS: {
      GET_ALL: `${API_BASE_URL}/investor/startups/all`
    },
    UPDATE_PASSWORD: `${API_BASE_URL}/investor/settings/update-password`,
    DELETE_ACCOUNT: `${API_BASE_URL}/investor/settings/delete-account`
  }
};

interface ApiResponse<T> {
  data?: T;
  message?: string;
  success: boolean;
}

// API functions for Startups
export const startupApi = {
  // Get all startups for the logged-in entrepreneur
  fetchStartups: async (): Promise<Startup[]> => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(API_ROUTES.STARTUPS.BASE, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch startups');
    }

    return response.json();
  },

  // Get startup by ID
  fetchStartup: async (id: string): Promise<Startup> => {
    console.log(`Fetching startup with ID: ${id}`);
    console.log('Request URL:', API_ROUTES.STARTUPS.DETAIL(id));
    const response = await fetch(API_ROUTES.STARTUPS.DETAIL(id));
    console.log('Response Status:', response.status);
    if (!response.ok) {
      const error = await response.json();
      console.error('Error details:', error);
      throw new Error(error.message || 'Failed to fetch startup');
    }
    return response.json();
  },

  // Create new startup
  createStartup: async (data: Omit<Startup, '_id'>): Promise<Startup> => {
    try {
      const response = await fetch(API_ROUTES.STARTUPS.BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create startup');
      }

      return result;
    } catch (error) {
      console.error('Create startup error:', error);
      throw error;
    }
  },

  // Update startup
  updateStartup: async (id: string, startup: Startup) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please sign in.');
    }

    try {
      const response = await fetch(`${API_ROUTES.STARTUPS.DETAIL(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...startup,
          user: undefined
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Session expired. Please sign in again.');
      }

      if (response.status === 403) {
        throw new Error('You are not authorized to update this startup');
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Update failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Update error:', error);
      throw new Error(`Update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Delete startup
  deleteStartup: async (id: string): Promise<ApiResponse<null>> => {
    const response = await fetch(API_ROUTES.STARTUPS.DETAIL(id), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete startup');
    }
    return response.json();
  },
};

export default API_BASE_URL;