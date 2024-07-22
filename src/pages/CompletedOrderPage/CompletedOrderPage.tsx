import React, { useEffect, useState } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { loadStripe } from '@stripe/stripe-js';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { createOrder } from 'api/orders';
import toast from 'react-hot-toast';
import { replaceCart } from 'store/redux/cartSlice';

const stripeApiKey = (import.meta.env.VITE_STRIPE_PUBLIC_KEY as string) || '';
const stripePromise = loadStripe(stripeApiKey);

const CompletedOrderPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clientSecret = queryParams.get('session_id');
  const dispatch = useAppDispatch();

  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [orderCreated, setOrderCreated] = useState<boolean>(false);

  const { userData, cartItems, totalAmount } = useAppSelector(
    (state) => state.cart
  );

  useEffect(() => {
    if (clientSecret && !orderCreated) {
      const checkPaymentStatus = async () => {
        try {
          const stripe = await stripePromise;
          const { paymentIntent } =
            await stripe!.retrievePaymentIntent(clientSecret);

          switch (paymentIntent?.status) {
            case 'succeeded':
              setPaymentStatus('success');
              if (userData && cartItems && totalAmount) {
                const order = {
                  userData: userData,
                  orderItems: cartItems,
                  totalPrice: totalAmount,
                  paymentInfo: {
                    stripeId: paymentIntent.id,
                    status: paymentIntent.status,
                  },
                  orderStatus: 'Paid',
                  paidAt: new Date(),
                };
                try {
                  await createOrder(order);
                  setOrderCreated(true); // Set orderCreated to true
                  dispatch(replaceCart());
                } catch (error) {
                  toast.error('Failed to create order');
                }
              }
              break;
            case 'processing':
              setPaymentStatus('processing');
              break;
            case 'requires_payment_method':
              setPaymentStatus('requires_payment_method');
              break;
            default:
              setPaymentStatus('failed');
              break;
          }
        } catch (error) {
          setPaymentStatus('failed');
        }
      };

      checkPaymentStatus();
    } else if (!clientSecret) {
      setPaymentStatus('failed');
    }
  }, [clientSecret, userData, cartItems, totalAmount, dispatch, orderCreated]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      {paymentStatus === 'success' ? (
        <>
          <CheckCircleIcon sx={{ fontSize: '5rem', color: 'green' }} />
          <Typography variant="h4" sx={{ mt: 2 }}>
            Your Order has been Placed successfully
          </Typography>
        </>
      ) : paymentStatus === 'processing' ? (
        <>
          <Typography variant="h4" sx={{ mt: 2 }}>
            Your payment is processing.
          </Typography>
        </>
      ) : paymentStatus === 'requires_payment_method' ? (
        <>
          <ErrorIcon sx={{ fontSize: '5rem', color: 'red' }} />
          <Typography variant="h4" sx={{ mt: 2 }}>
            Your payment was not successful, please try again.
          </Typography>
        </>
      ) : (
        <>
          {paymentStatus !== null && (
            <>
              <ErrorIcon sx={{ fontSize: '5rem', color: 'red' }} />
              <Typography variant="h4" sx={{ mt: 2 }}>
                There was an issue with your order
              </Typography>
            </>
          )}
        </>
      )}
      <Button
        component={RouterLink}
        to="/my-orders"
        variant="contained"
        color="primary"
        sx={{ mt: 4 }}
      >
        View Orders
      </Button>
    </Box>
  );
};

export default CompletedOrderPage;
