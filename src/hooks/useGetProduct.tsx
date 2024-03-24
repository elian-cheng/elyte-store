import { useQuery } from '@tanstack/react-query';
import { getProductById } from 'api/products';
import { cacheKeys } from 'utils/constants';

const useGetProduct = (id: string) => {
  const query = useQuery({
    queryKey: cacheKeys.productById(id),
    queryFn: async () => {
      return await getProductById(id);
    },
    enabled: id !== null && id !== '',
  });

  return query;
};

export default useGetProduct;
