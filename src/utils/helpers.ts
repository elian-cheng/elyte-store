import { jwtDecode } from 'jwt-decode';
import { Role } from './constants';
import { refreshTokens } from 'api/auth';

interface IPayload {
  exp: number;
  iat: number;
  role: Role;
  sub: string;
}

export const getUserId = () => {
  const token = localStorage.getItem('access');

  if (!token) return null;

  let id: string | null = null;

  try {
    const decoded = jwtDecode(token) as IPayload;
    id = decoded?.sub;
  } catch (error) {
    console.error('Error parsing token data:', error);
  }

  return id;
};

export const getUserRole = () => {
  const token = localStorage.getItem('access');

  if (!token) return null;

  let role: Role | null = null;

  try {
    const decoded = jwtDecode(token) as IPayload;
    role = decoded?.role;
  } catch (error) {
    console.error('Error parsing token data:', error);
  }

  return role;
};

export const getAccessToken = () => {
  const token = localStorage.getItem('access');
  return token ? token : null;
};

export const getRefreshToken = () => {
  const token = localStorage.getItem('refresh');
  return token ? token : null;
};

let refreshInterval: NodeJS.Timeout;

export const startTokenRefresh = () => {
  const jwtRefreshTime = +import.meta.env.JWT_ACCESS_EXPIRATION_MINUTES || 30;
  console.log('Token refresh started.');

  refreshInterval = setInterval(
    async () => {
      try {
        const token = await refreshTokens();
        console.log('Token refreshed successfully:', token);
      } catch (error) {
        console.error('Error refreshing token:', error);
      }
    },
    jwtRefreshTime * 60 * 1000
  );
};

export const stopTokenRefresh = () => {
  console.log('Token refresh stopped.');
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
};
