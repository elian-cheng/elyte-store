import { useQueryClient, useMutation } from '@tanstack/react-query';
import { updateProductImages } from 'api/products';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from 'interfaces/ApiErrorInterface';
import { IProductImagesUpdate } from 'interfaces/ProductInterface';
import toast from 'react-hot-toast';
import { cacheKeys } from 'utils/constants';

const useUpdateProductImages = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: string;
      body: IProductImagesUpdate;
    }) => {
      return await updateProductImages(id, body);
    },
    onSuccess: ({ _id }) => {
      void queryClient.invalidateQueries({
        queryKey: cacheKeys.productById(_id),
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

export default useUpdateProductImages;
