import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createUserProfile } from 'api/users';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from 'interfaces/ApiErrorInterface';
import { IUserMutation } from 'interfaces/UserInterface';
import toast from 'react-hot-toast';
import { cacheKeys } from 'utils/constants';

const useCreateUserProfile = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (body: IUserMutation) => {
      return await createUserProfile(body);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: cacheKeys.users(),
      });
      toast.success('User was successfully created.');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(
        (error?.response?.data?.message as string) || 'Something went wrong...'
      );
    },
  });

  return mutation;
};

export default useCreateUserProfile;
