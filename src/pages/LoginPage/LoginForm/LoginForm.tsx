import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LockOutlined } from '@mui/icons-material';
import { AxiosError } from 'axios';
import Colors from 'theme/colors';
import { login } from 'api/auth';
import { getUserId, getUserRole } from 'utils/helpers';
import { useLocation, useNavigate } from 'react-router-dom';
import ButtonLoader from 'components/ButtonLoader/ButtonLoader';
import { loginUserSchema } from 'utils/validation/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuth } from 'store/context/authContext';

export interface IFormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { setUser, setUserId } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const loginMutation = useMutation({
    mutationFn: login,
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
    resolver: yupResolver(loginUserSchema),
    shouldUseNativeValidation: false,
  });

  const onSubmit: SubmitHandler<IFormData> = async (data) => {
    setIsLoading(true);
    try {
      const res = await loginMutation.mutateAsync(data);
      localStorage.setItem('access', res?.tokens?.access?.token || '');
      localStorage.setItem('refresh', res?.tokens?.refresh?.token || '');
      setUser(getUserRole());
      setUserId(getUserId());
      location.pathname === '/login' ? navigate('/') : navigate('/app');
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error?.response?.data?.message || 'Login attempt failed.');
    } finally {
      setIsLoading(false);
    }
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
        boxShadow: ' 0 1px 4px rgba(0, 0, 0, 0.2)',
        backgroundColor: Colors.WHITE,
      }}
    >
      <Avatar
        sx={{ color: Colors.PROMO_WHITE, backgroundColor: Colors.PRIMARY_DARK }}
      >
        <LockOutlined />
      </Avatar>
      <Typography component="h2" variant="h4" sx={{ my: '.5rem' }}>
        Login
      </Typography>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
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
        />
        <TextField
          {...register('password')}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label={'Password'}
          id="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          error={!!errors.password}
          helperText={errors?.password?.message}
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
            {'Sign In'}
          </Button>
        )}

        {isLoading && <ButtonLoader />}

        <Grid container sx={{ mt: '1rem' }}>
          <Grid item>
            <Link href="/forgot-password" variant="body2">
              Forgot password? Click here.
            </Link>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default LoginForm;
