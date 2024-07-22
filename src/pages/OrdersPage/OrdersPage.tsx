import OrdersTable from './OrdersTable/OrdersTable';
import { Container, Typography } from '@mui/material';

const OrdersPage = () => {
  return (
    <Container>
      <Typography variant={'h2'} mb={2}>
        Orders
      </Typography>
      <OrdersTable />
    </Container>
  );
};

export default OrdersPage;
