import { API_BASE_URL } from '../config';

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterData = LoginCredentials & {
  name: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

export async function login(credentials: LoginCredentials) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
    credentials: 'include',
  });
  
  if (!response.ok) throw new Error('Login failed');
  return response.json() as Promise<{ user: User; token: string }>;
}

export async function register(data: RegisterData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) throw new Error('Registration failed');
  return response.json() as Promise<{ user: User; token: string }>;
}

export async function logout() {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  
  if (!response.ok) throw new Error('Logout failed');
  return response.json();
}

export async function getCurrentUser() {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    credentials: 'include',
  });
  
  if (!response.ok) {
    if (response.status === 401) return null;
    throw new Error('Failed to get current user');
  }
  
  return response.json() as Promise<User>;
}
