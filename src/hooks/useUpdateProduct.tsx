import { useQueryClient, useMutation } from '@tanstack/react-query';
import { updateProduct } from 'api/products';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from 'interfaces/ApiErrorInterface';
import { IProductUpdate } from 'interfaces/ProductInterface';
import toast from 'react-hot-toast';
import { cacheKeys } from 'utils/constants';

const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, body }: { id: string; body: IProductUpdate }) => {
      return await updateProduct(id, body);
    },
    onSuccess: ({ _id }) => {
      void queryClient.invalidateQueries({
        queryKey: cacheKeys.productById(_id),
      });
      void queryClient.invalidateQueries({
        queryKey: cacheKeys.products(),
      });
      toast.success('Product was successfully updated.');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(
        (error?.response?.data?.message as string) || 'Something went wrong...'
      );
    },
  });

  return mutation;
};

export default useUpdateProduct;
