import React, { FC } from 'react';
import { Box, TextField, Button } from '@mui/material';

interface IPaymentFormProps {
  onBack: () => void;
}

export const PaymentForm: FC<IPaymentFormProps> = ({ onBack }) => (
  <Box>
    <TextField label="Card Number" fullWidth margin="normal" />
    <TextField label="Expiry Date" fullWidth margin="normal" />
    <TextField label="CVV" fullWidth margin="normal" />
    <Box display="flex" justifyContent="space-between">
      <Button variant="contained" color="secondary" onClick={onBack}>
        Back
      </Button>
      <Button variant="contained" color="primary">
        Pay
      </Button>
    </Box>
  </Box>
);
