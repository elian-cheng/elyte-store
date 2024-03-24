import { useQueryClient, useMutation } from '@tanstack/react-query';
import { updateUserProfile } from 'api/users';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from 'interfaces/ApiErrorInterface';
import { IUserMutation } from 'interfaces/UserInterface';
import toast from 'react-hot-toast';
import { cacheKeys } from 'utils/constants';

const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, body }: { id: string; body: IUserMutation }) => {
      return await updateUserProfile(id, body);
    },
    onSuccess: ({ _id }) => {
      void queryClient.invalidateQueries({
        queryKey: cacheKeys.userProfile(_id),
      });
      toast.success('User was successfully updated.');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(
        (error?.response?.data?.message as string) || 'Something went wrong...'
      );
    },
  });

  return mutation;
};

export default useUpdateUserProfile;
