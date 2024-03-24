import {
  Container,
  Avatar,
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import MailLockIcon from '@mui/icons-material/MailLock';
import { AxiosError } from 'axios';
import Colors from 'theme/colors';
import { forgotPassword } from 'api/auth';
import { useNavigate } from 'react-router-dom';
import ButtonLoader from 'components/ButtonLoader/ButtonLoader';
import { forgotPasswordSchema } from 'utils/validation/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export interface IFormData {
  email: string;
}

const ForgotPasswordPage = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>({
    mode: 'onBlur',
    resolver: yupResolver(forgotPasswordSchema),
    shouldUseNativeValidation: false,
  });

  const onSubmit: SubmitHandler<IFormData> = async (data) => {
    setIsLoading(true);
    try {
      await forgotPasswordMutation.mutateAsync(data.email);
      toast.success('Request was sent. Check your email to proceed.');
      navigate('/');
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error?.response?.data?.message || 'Sending request failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          m: '5rem auto 3rem',
          p: '1rem',
          borderRadius: '6px',
          width: '95%',
          maxWidth: '35rem',
          boxShadow: ' 0 1px 4px rgba(0, 0, 0, 0.2)',
          backgroundColor: Colors.WHITE,
        }}
      >
        <Avatar
          sx={{ color: Colors.WHITE, backgroundColor: Colors.PRIMARY_DARK }}
        >
          <MailLockIcon />
        </Avatar>
        <Typography component="h2" variant="h4" sx={{ my: '.5rem' }}>
          Recover password
        </Typography>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          style={{ width: '100%' }}
        >
          <TextField
            {...register('email')}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            error={!!errors.email}
            helperText={errors?.email?.message}
            sx={{ mb: '2rem' }}
          />
          {!isLoading && (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                py: '.8rem',
                color: 'white',
              }}
            >
              Submit
            </Button>
          )}
          {isLoading && <ButtonLoader />}
        </form>
      </Box>
    </Container>
  );
};
export default ForgotPasswordPage;
