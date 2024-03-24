import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout as logoutFn } from 'api/auth';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { cacheKeys } from 'utils/constants';
import { getRefreshToken } from 'utils/helpers';
import { useAuth } from 'store/context/authContext';
import { useNavigate } from 'react-router-dom';
import { ApiErrorResponse } from 'interfaces/ApiErrorInterface';

const useLogout = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logoutMutation = useMutation({
    mutationFn: logoutFn,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cacheKeys.currentUser() });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(
        (error?.response?.data?.message as string) || 'Something went wrong...'
      );
    },
  });

  const logout = useCallback(async () => {
    const token = getRefreshToken();
    if (token) {
      logoutMutation.mutate(token);
    }
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setUser(null);
    navigate('/');
  }, [logoutMutation, navigate, setUser]);

  return logout;
};

export default useLogout;
