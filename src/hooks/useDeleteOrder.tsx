import { useQueryClient, useMutation } from '@tanstack/react-query';
import { deleteOrder } from 'api/orders';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from 'interfaces/ApiErrorInterface';
import toast from 'react-hot-toast';
import { cacheKeys } from 'utils/constants';

const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteOrder(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: cacheKeys.orders(),
      });
      toast.success('Order was successfully deleted.');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(
        (error?.response?.data?.message as string) || 'Something went wrong...'
      );
    },
  });

  return mutation;
};

export default useDeleteOrder;
