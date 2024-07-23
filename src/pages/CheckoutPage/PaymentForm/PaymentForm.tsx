import React, { FC, FormEvent, useRef, useState } from 'react';
import { useAppSelector } from 'hooks/redux';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Box, Button, Typography } from '@mui/material';
import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';

interface IPaymentFormProps {
  onBack: () => void;
  clientSecret: string;
}

const REDIRECT_URL =
  process.env.NODE_ENV === 'development'
    ? import.meta.env.VITE_DEVELOPMENT_SITE_URL
    : import.meta.env.VITE_PRODUCTION_SITE_URL;

const PaymentForm: FC<IPaymentFormProps> = ({ onBack, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const { userData, cartItems, totalAmount } = useAppSelector(
    (state) => state.cart
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${REDIRECT_URL}/completed-order?session_id=${clientSecret}`,
      },
    });

    if (error) {
      toast.error(error.message || 'An unexpected error occurred.');
    }

    setIsLoading(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        m: '3rem auto',
        p: '1rem',
        borderRadius: '6px',
        width: '95%',
        maxWidth: '35rem',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
        backgroundColor: '#fff',
      }}
    >
      <Typography component="h2" variant="h4" sx={{ my: '.5rem' }}>
        Payment Details
      </Typography>
      <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />
        <Button
          disabled={isLoading || !stripe || !elements}
          id="submit"
          type="submit"
          fullWidth
          variant="contained"
          color="secondary"
          sx={{
            mt: '1rem',
          }}
        >
          Pay - ${totalAmount}
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={onBack}
          sx={{
            mt: '1rem',
          }}
        >
          Return to Confirm Order
        </Button>
      </form>
    </Box>
  );
};

export default PaymentForm;
