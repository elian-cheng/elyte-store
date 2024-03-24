import axios, { AxiosError } from 'axios';
import { IUserLogin } from 'interfaces/UserInterface';
import toast from 'react-hot-toast';
import { getRefreshToken } from 'utils/helpers';

export const login = async (data: object) => {
  const response = await axios.post<IUserLogin>('/auth/login', data);
  return response.data;
};

export const logout = async (token: string) => {
  return await axios.post('/auth/logout', {
    refreshToken: token,
  });
};

export const forgotPassword = async (email: string) => {
  return await axios.post('/auth/forgot-password', {
    email,
  });
};

export const resetPassword = async ({
  token,
  password,
}: {
  token: string;
  password: string;
}) => {
  return await axios.post(`/auth/reset-password?token=${token}`, {
    password,
  });
};

export const adminChangeUserPassword = async (id: string, password: string) => {
  return await axios.patch(`/auth/admin/change-password/${id}`, { password });
};

export const changeUserPassword = async (
  id: string,
  oldPassword: string,
  newPassword: string
) => {
  return await axios.patch(`/auth/change-password/${id}`, {
    oldPassword,
    newPassword,
  });
};

export const refreshTokens = async () => {
  try {
    const response = await axios.post('/auth/refresh-tokens', {
      refreshToken: getRefreshToken(),
    });
    const { access, refresh } = response?.data;
    localStorage.setItem('access', access?.token || '');
    localStorage.setItem('refresh', refresh?.token || '');
    return access?.token;
  } catch (err: unknown) {
    const error = err as AxiosError;

    if (error?.response) {
      const { status } = error.response;
      if (status === 401) {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.replace('/');
        toast.error('Please login again.');
        return Promise.reject({ message: 'Please login again.' });
      } else if (status === 500) {
        toast.error('Server error. Please try again later.');
        return Promise.reject({
          message: 'Server error. Please try again later.',
        });
      }
    }
    return Promise.reject({
      message: 'An error occurred. Please try again later.',
    });
  }
};
