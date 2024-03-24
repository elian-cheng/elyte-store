import {
  Container,
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import PasswordIcon from '@mui/icons-material/Password';
import { AxiosError } from 'axios';
import Colors from 'theme/colors';
import { resetPassword } from 'api/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import ButtonLoader from 'components/ButtonLoader/ButtonLoader';
import { createNewPasswordSchema } from 'utils/validation/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export interface IFormData {
  password: string;
}

const ResetPasswordPage = () => {
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const token = new URLSearchParams(useLocation().search).get('token') || null;
  const navigate = useNavigate();

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const showPasswordHandler = () => setShowPassword((show) => !show);

  const passwordMouseDownHandler = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>({
    mode: 'onBlur',
    resolver: yupResolver(createNewPasswordSchema),
    shouldUseNativeValidation: false,
  });

  const onSubmit: SubmitHandler<IFormData> = async (data) => {
    if (!token) {
      toast.error('Token is missing.');
      navigate('/');
      return;
    }
    setIsLoading(true);
    try {
      await resetPasswordMutation.mutateAsync({
        token: token as string,
        password: data.password,
      });
      toast.success('Request was sent. Login with your new password.');
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
          <PasswordIcon />
        </Avatar>
        <Typography component="h2" variant="h4" sx={{ my: '.5rem' }}>
          Reset password
        </Typography>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          style={{ width: '100%' }}
        >
          <TextField
            {...register('password')}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label={'New password'}
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            error={!!errors.password}
            helperText={errors?.['password']?.message as string}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={showPasswordHandler}
                    onMouseDown={passwordMouseDownHandler}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
export default ResetPasswordPage;
