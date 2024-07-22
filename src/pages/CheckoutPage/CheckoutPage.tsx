import React, { useState, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import CheckoutSteps from './CheckoutSteps/CheckoutSteps';
import { useAuth } from 'store/context/authContext';
import AuthForm from './AuthForm/AuthForm';
import ShippingForm from './ShippingForm/ShippingForm';
import ConfirmOrder from './ConfirmOrder/ConfirmOrder';
import PaymentForm from './PaymentForm/PaymentForm';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useAppSelector } from 'hooks/redux';
import { createPaymentIntent } from 'api/payments';

const stripeApiKey = (import.meta.env.VITE_STRIPE_PUBLIC_KEY as string) || '';
const stripePromise = loadStripe(stripeApiKey);

const CheckoutPage = () => {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [clientSecret, setClientSecret] = useState('');
  const { totalAmount } = useAppSelector((state) => state.cart);

  useEffect(() => {
    const amount = Math.round(totalAmount * 100);

    // Create PaymentIntent as soon as the page loads
    createPaymentIntent(amount).then((response) => {
      if (!response?.clientSecret) {
        return;
      }
      setClientSecret(response.clientSecret);
    });
  }, [totalAmount]);

  useEffect(() => {
    if (user) {
      // If the user is logged in, skip the login step
      setActiveStep(1);
    }
  }, [user]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Container>
      <Box my={4}>
        <CheckoutSteps activeStep={activeStep} />
      </Box>
      <Box>
        {activeStep === 0 && <AuthForm onNext={handleNext} />}
        {activeStep === 1 && <ShippingForm onNext={handleNext} />}
        {activeStep === 2 && (
          <ConfirmOrder onNext={handleNext} onBack={handleBack} />
        )}
        {activeStep === 3 && (
          <>
            {clientSecret && (
              <Elements
                stripe={stripePromise}
                options={{ clientSecret: clientSecret }}
              >
                <PaymentForm onBack={handleBack} clientSecret={clientSecret} />
              </Elements>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default CheckoutPage;
