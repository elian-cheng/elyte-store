import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserHistory } from 'history';
import { AuthProvider } from 'store/context/authContext';
import theme from 'theme/theme';
import store from 'store/redux';
import axios from 'axios';
import './index.css';
import App from './App';
import { getAccessToken } from 'utils/helpers';
import { refreshTokens } from 'api/auth';
import toast from 'react-hot-toast';

const history = createBrowserHistory();
const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
});

if (
  !import.meta.env.VITE_DEVELOPMENT_API_URL ||
  !import.meta.env.VITE_PRODUCTION_API_URL
) {
  throw new Error('Missing server API URL. Please check .env file.');
}

export const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? import.meta.env.VITE_DEVELOPMENT_API_URL
    : import.meta.env.VITE_PRODUCTION_API_URL;

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common['Authorization'] = `Bearer ${getAccessToken()}`;

axios.interceptors.request.use(
  (request) => {
    const token = getAccessToken();
    if (token) {
      request.headers['Authorization'] = `Bearer ${token}`;
    }

    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      error.response.data.message === 'Please authenticate.' &&
      !isRefreshing
    ) {
      isRefreshing = true;

      try {
        const token = await refreshTokens();
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        toast.error('User authentication failed. Please login again.');
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.replace('/');
        console.error('Error refreshing token:', refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response.status === 403) {
      toast.error('Forbidden action. Access denied.');
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      window.location.replace('/');
    }

    return Promise.reject(error);
  }
);

const app = document.getElementById('root');
if (app) {
  const path = (/#!(\/.*)$/.exec(location.hash) || [])[1];
  if (path) {
    history.replace(path);
  }

  ReactDOM.createRoot(app!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </ThemeProvider>
          </Provider>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}
