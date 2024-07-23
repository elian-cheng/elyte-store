import { Container, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getOrdersAdmin } from 'api/orders';
import Loader from 'components/Loader/Loader';
import { cacheKeys } from 'utils/constants';
import RevenueChart from './RevenueChart/RevenueChart';
import OrdersQuantityChart from './OrdersQuantityChart/OrdersQuantityChart';
import OrderStatusChart from './OrderStatusChart/OrderStatusChart';

const DashboardPage = () => {
  const {
    data: ordersData = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: cacheKeys.orders(),
    queryFn: async () => {
      return await getOrdersAdmin();
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Typography>Something went wrong...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h2" mb={4}>
        Dashboard
      </Typography>
      {ordersData.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        <>
          <OrderStatusChart orders={ordersData} />
          <RevenueChart orders={ordersData} />
          <OrdersQuantityChart orders={ordersData} />
        </>
      )}
    </Container>
  );
};

export default DashboardPage;
