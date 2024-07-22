import {
  Box,
  FormControl,
  FormLabel,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IOrder } from 'interfaces/OrderInterface';
import Loader from 'components/Loader/Loader';
import useGetOrder from 'hooks/useGetOrder';
import { isoCodeToCountryStateName } from 'utils/helpers';

interface IViewOrderDetailsProps {
  orderId: string;
}

interface IFormInputs {
  orderId: string;
  customerName: string;
  orderDate: string;
  totalAmount: string;
  status: string;
  shippingAddress: string;
}

const ViewOrderDetails: FC<IViewOrderDetailsProps> = ({ orderId }) => {
  const {
    data: order = {} as IOrder,
    isLoading,
    isError,
  } = useGetOrder(orderId);

  const { register, reset: resetForm } = useForm({
    defaultValues: {
      orderId: '',
      customerName: '',
      orderDate: '',
      totalAmount: '',
      status: '',
      shippingAddress: '',
    },
  });

  useEffect(() => {
    if (!isLoading && !isError) {
      let address = '';

      const countryState = isoCodeToCountryStateName(
        order.userData?.shippingInfo?.country || '',
        order.userData?.shippingInfo?.state || ''
      );
      if (order.userData && order.userData.shippingInfo) {
        address = `${order.userData?.shippingInfo?.address}, ${order.userData
          ?.shippingInfo?.city}, ${order.userData?.shippingInfo?.zip}, ${
          countryState.country
        }${countryState.state ? `, ${countryState.state}` : ''}`;
      }

      resetForm({
        orderId: order._id || '',
        customerName: order.userData.name || '',
        orderDate: new Date(order.createdAt).toLocaleDateString() || '',
        totalAmount: order.totalPrice.toString() || '',
        status: order.orderStatus || '',
        shippingAddress: address,
      });
    }
  }, [order, isLoading, isError, resetForm]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Typography>Something went wrong...</Typography>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        p: '2rem 2rem 3rem',
        borderRadius: '6px',
        width: '100%',
        backgroundColor: 'white',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          mb: '1rem',
        }}
      >
        <Typography component="h2" variant="h4" sx={{ mt: '.5rem' }}>
          Order Details
        </Typography>
      </Box>
      <form noValidate>
        {[
          { name: 'orderId', label: 'Order ID' },
          { name: 'customerName', label: 'Customer Name' },
          { name: 'orderDate', label: 'Order Date' },
          { name: 'totalAmount', label: 'Total Amount' },
          { name: 'status', label: 'Status' },
          { name: 'shippingAddress', label: 'Shipping Address' },
        ].map(({ name, label }) => (
          <TextField
            {...register(name as keyof IFormInputs)}
            key={name}
            variant="outlined"
            margin="normal"
            rows={name === 'shippingAddress' ? 2 : 1}
            multiline={name === 'shippingAddress'}
            fullWidth
            id={name}
            label={label}
            name={name}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        ))}
        <FormControl sx={{ mt: 2, mb: 1 }}>
          <FormLabel id="items-label" sx={{ fontWeight: 500 }}>
            Items
          </FormLabel>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xxs: 1, md: 2 }}
            justifyContent="flex-start"
          >
            {order.orderItems.map((item) => (
              <Grid item xs={12} key={item.id}>
                <Typography variant="body1">
                  {item.title} - {item.quantity} @ ${item.price} each
                </Typography>
              </Grid>
            ))}
          </Grid>
        </FormControl>
      </form>
    </Box>
  );
};

export default ViewOrderDetails;
