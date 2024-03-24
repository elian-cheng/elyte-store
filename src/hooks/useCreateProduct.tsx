import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createProduct } from 'api/products';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from 'interfaces/ApiErrorInterface';
import { IProductCreate } from 'interfaces/ProductInterface';
import toast from 'react-hot-toast';
import { cacheKeys } from 'utils/constants';

const useCreateProduct = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (body: IProductCreate) => {
      return await createProduct(body);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: cacheKeys.products(),
      });
      toast.success('Product was successfully created.');
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      toast.error(
        (error?.response?.data?.message as string) || 'Something went wrong...'
      );
    },
  });

  return mutation;
};

export default useCreateProduct;
