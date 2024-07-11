import React, { FC } from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LoginIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from 'store/context/authContext';
import { styled } from '@mui/material/styles';

const steps = [
  {
    label: 'Login/Create Account',
    icon: <LoginIcon />,
  },
  {
    label: 'Shipping Details',
    icon: <LocalShippingIcon />,
  },
  {
    label: 'Confirm Order',
    icon: <LibraryAddCheckIcon />,
  },
  {
    label: 'Payment',
    icon: <AccountBalanceIcon />,
  },
];

interface ICheckoutStepsProps {
  activeStep: number;
}

const CustomStepLabel = styled(StepLabel)(({ theme }) => ({
  '&.MuiStepLabel-active': {
    color: theme.palette.secondary.main, // Change to your desired active color
  },
  '&.MuiStepLabel-completed': {
    color: theme.palette.secondary.main, // Change to your desired completed color
  },
}));

const CheckoutSteps: FC<ICheckoutStepsProps> = ({ activeStep }) => {
  const { user } = useAuth();

  return (
    <Stepper alternativeLabel activeStep={user ? activeStep - 1 : activeStep}>
      {(user ? steps.slice(1) : steps).map((step, index) => {
        const isCompleted = user ? activeStep > index : activeStep >= index;
        const isCurrentStep = user
          ? activeStep === index + 1
          : activeStep === index;

        return (
          <Step key={index} completed={isCompleted}>
            <CustomStepLabel
              StepIconComponent={() => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {step.icon}
                </div>
              )}
              className={`${isCurrentStep ? 'MuiStepLabel-active' : ''}`}
            >
              {step.label}
            </CustomStepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
};

export default CheckoutSteps;
