import { useQueryClient, useMutation } from '@tanstack/react-query';
import { updateOrderStatus } from 'api/orders';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from 'interfaces/ApiErrorInterface';
import { IOrderUpdate } from 'interfaces/OrderInterface';
import toast from 'react-hot-toast';
import { cacheKeys } from 'utils/constants';

const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, body }: { id: string; body: IOrderUpdate }) => {
      return await updateOrderStatus(id, body);
    },
    onSuccess: ({ _id }) => {
      void queryClient.invalidateQueries({
        queryKey: cacheKeys.orderById(_id),
      });
      void queryClient.invalidateQueries({
        queryKey: cacheKeys.orders(),
      });
      toast.success('Order was successfully updated.');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(
        (error?.response?.data?.message as string) || 'Something went wrong...'
      );
    },
  });

  return mutation;
};

export default useUpdateOrder;
