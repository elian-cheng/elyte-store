import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Collapse,
  IconButton,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getOrders } from 'api/orders';
import Loader from 'components/Loader/Loader';
import { cacheKeys } from 'utils/constants';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { IOrder } from 'interfaces/OrderInterface';
import { isoCodeToCountryStateName } from 'utils/helpers';

const MyOrdersPage = () => {
  const {
    data: ordersData = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: cacheKeys.myOrders(),
    queryFn: async () => {
      return await getOrders();
    },
  });

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Typography>Something went wrong...</Typography>;
  }

  const handleExpandClick = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <Container>
      <Typography variant="h2" mb={4}>
        My Orders
      </Typography>
      {ordersData.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        ordersData.map((order: IOrder) => {
          const countryState = isoCodeToCountryStateName(
            order.userData.shippingInfo.country || '',
            order.userData.shippingInfo.state || ''
          );
          return (
            <Card key={order._id} sx={{ mb: 3 }}>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Order ID: {order._id}</Typography>
                  <Typography variant="h6" color="text.secondary">
                    {order.orderStatus}
                  </Typography>
                </Box>
                <Typography variant="body1">
                  Total Price: ${order.totalPrice}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Paid At: {new Date(order.paidAt).toLocaleDateString()}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <IconButton
                    onClick={() => handleExpandClick(order._id)}
                    aria-expanded={expandedOrderId === order._id}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                  <Typography variant="body2" ml={1}>
                    Show Details
                  </Typography>
                </Box>
                <Collapse in={expandedOrderId === order._id}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6">Order Items:</Typography>
                    <Grid container spacing={2}>
                      {order.orderItems.map((item) => {
                        return (
                          <Grid item xs={12} sm={6} md={4} key={item.id}>
                            <Card>
                              <CardMedia
                                component="img"
                                height="140"
                                image={item.image}
                                alt={item.title}
                                sx={{ objectFit: 'contain' }}
                              />
                              <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h6">
                                  {item.title}
                                </Typography>
                                <Typography variant="body2">
                                  Quantity: {item.quantity}
                                </Typography>
                                <Typography variant="body2">
                                  Price: ${item.price.toFixed(2)}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h6">
                        Shipping Information:
                      </Typography>
                      <Typography variant="body2">
                        Address: {order.userData.shippingInfo.address}
                      </Typography>
                      <Typography variant="body2">
                        City: {order.userData.shippingInfo.city}
                      </Typography>
                      {countryState.state && (
                        <Typography variant="body2">
                          State: {countryState.state}
                        </Typography>
                      )}
                      <Typography variant="body2">
                        Country: {countryState.country}
                      </Typography>
                      <Typography variant="body2">
                        Zip: {order.userData.shippingInfo.zip}
                      </Typography>
                    </Box>
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          );
        })
      )}
    </Container>
  );
};

export default MyOrdersPage;
