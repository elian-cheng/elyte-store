import { useQuery } from '@tanstack/react-query';
import { getOrderById } from 'api/orders';
import { cacheKeys } from 'utils/constants';

const useGetOrder = (id: string) => {
  const query = useQuery({
    queryKey: cacheKeys.orderById(id),
    queryFn: async () => {
      return await getOrderById(id);
    },
    enabled: id !== null && id !== '',
  });

  return query;
};

export default useGetOrder;
