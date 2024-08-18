// src/services/authService.ts
import api from './api';

export const loginUser = async (email: string, password: string) => {
    const response = await api.post('/users/login', { email, password });
    return response.data; // Expect { token, user }
};

export const signupUser = async (name: string, email: string, password: string) => {
    const response = await api.post('/users/register', { name, email, password });
    return response.data; // Expect { token, user }
};

export const loginAdmin = async (email: string, password: string) => {
    const response = await api.post('/users/login', { email, password });
    return response.data; // Expect { token, user }
};

export const signupAdmin = async (name: string, email: string, password: string) => {
    const response = await api.post('/users/register', { name, email, password });
    return response.data; // Expect { token, user }
};
// Fetch user cart data
export const fetchUserProfile = async (token:any) => {
    // const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const response = await api.get('users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); // Token is automatically added by interceptor
    return response.data; // Expect user object
  };