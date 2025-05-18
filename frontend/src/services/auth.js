import { jwtDecode } from 'jwt-decode';

export const getToken = () => localStorage.getItem('token');

export const getUserRole = () => {
  try {
    const token = getToken();
    if (!token) return null;
    const { role } = jwtDecode(token);
    return role;
  } catch {
    return null;
  }
};

export const isTokenExpired = () => {
  try {
    const token = getToken();
    if (!token) return true;
    const { exp } = jwtDecode(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/';
};
