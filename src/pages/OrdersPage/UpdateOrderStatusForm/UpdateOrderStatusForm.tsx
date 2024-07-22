import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Colors from 'theme/colors';
import { IOrder } from 'interfaces/OrderInterface';
import useGetOrder from 'hooks/useGetOrder';
import useUpdateOrder from 'hooks/useUpdateOrder';

interface IUpdateOrderStatusFormProps {
  handleModal: () => void;
  orderId: string;
}

interface IFormInputs {
  status: string;
}

const UpdateOrderStatusForm: FC<IUpdateOrderStatusFormProps> = ({
  handleModal,
  orderId,
}) => {
  const {
    data: order = {} as IOrder,
    isLoading,
    isError,
  } = useGetOrder(orderId);
  const [orderStatus, setOrderStatus] = useState<string>('');
  const updateOrderStatusMutation = useUpdateOrder();

  const { register, handleSubmit } = useForm<IFormInputs>({
    defaultValues: {
      status: '',
    },
  });

  useEffect(() => {
    if (!isLoading && !isError) {
      setOrderStatus(order.orderStatus);
    }
  }, [order, isLoading, isError]);

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    await updateOrderStatusMutation.mutateAsync({
      id: orderId,
      body: { status: data.status },
    });
    handleModal();
  };

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
        backgroundColor: Colors.WHITE,
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
          Update Order Status
        </Typography>
      </Box>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            id="status"
            {...register('status')}
            label="Status"
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
          >
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
            <MenuItem value="Shipped">Shipped</MenuItem>
            <MenuItem value="Processing">Processing</MenuItem>
          </Select>
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: '2rem',
            py: '0.8rem',
            color: 'white',
          }}
        >
          Update Status
        </Button>
      </form>
    </Box>
  );
};

export default UpdateOrderStatusForm;
