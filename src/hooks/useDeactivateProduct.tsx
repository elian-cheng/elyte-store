import { useQueryClient, useMutation } from '@tanstack/react-query';
import { deactivateProduct } from 'api/products';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from 'interfaces/ApiErrorInterface';
import toast from 'react-hot-toast';
import { cacheKeys } from 'utils/constants';

const useDeactivateProduct = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      return await deactivateProduct(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: cacheKeys.products(),
      });
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(
        (error?.response?.data?.message as string) || 'Something went wrong...'
      );
    },
  });

  return mutation;
};

export default useDeactivateProduct;
