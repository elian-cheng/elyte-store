import React, { useState, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import CheckoutSteps from './CheckoutSteps/CheckoutSteps';
import { PaymentForm } from './PaymentForm/PaymentForm';
import { useAuth } from 'store/context/authContext';
import AuthForm from './AuthForm/AuthForm';
import ShippingForm from './ShippingForm/ShippingForm';
import ConfirmOrder from './ConfirmOrder/ConfirmOrder';

const CheckoutPage = () => {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);

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
        {activeStep === 3 && <PaymentForm onBack={handleBack} />}
      </Box>
    </Container>
  );
};

export default CheckoutPage;
