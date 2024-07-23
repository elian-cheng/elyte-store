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
import { login, signUp } from 'api/auth';
import { getUserId, getUserRole } from 'utils/helpers';
import ButtonLoader from 'components/ButtonLoader/ButtonLoader';
import { loginUserSchema } from 'utils/validation/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuth } from 'store/context/authContext';

export interface IFormData {
  email: string;
  password: string;
}

interface IAuthFormProps {
  onNext: () => void;
}

const AuthForm: React.FC<IAuthFormProps> = ({ onNext }) => {
  const queryClient = useQueryClient();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { setUser, setUserId } = useAuth();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const signUpMutation = useMutation({
    mutationFn: signUp,
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
      let res;
      if (isLogin) {
        res = await loginMutation.mutateAsync(data);
      } else {
        res = await signUpMutation.mutateAsync(data);
        if (res) {
          res = await loginMutation.mutateAsync(data); // Log in after sign-up
        }
      }

      if (res) {
        localStorage.setItem('access', res.tokens.access.token || '');
        localStorage.setItem('refresh', res.tokens.refresh.token || '');
        setUser(getUserRole());
        setUserId(getUserId());
        onNext();
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(
        error?.response?.data?.message ||
          `${isLogin ? 'Login' : 'Sign Up'} attempt failed.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
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
        backgroundColor: Colors.WHITE,
      }}
    >
      <Avatar
        sx={{ color: Colors.PROMO_WHITE, backgroundColor: Colors.PRIMARY_DARK }}
      >
        <LockOutlined />
      </Avatar>
      <Typography component="h2" variant="h4" sx={{ my: '.5rem' }}>
        {isLogin ? 'Login' : 'Sign Up'}
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
          label="Password"
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
            {isLogin ? 'Sign In' : 'Sign Up'}
          </Button>
        )}

        {isLoading && <ButtonLoader />}

        <Grid
          container
          sx={{ mt: '1rem', justifyContent: 'space-between', rowGap: 2 }}
        >
          <Grid item>
            <Link href="/forgot-password" variant="body2">
              Forgot password? Click here.
            </Link>
          </Grid>
          <Grid item>
            <Link href="#" variant="body2" onClick={switchAuthModeHandler}>
              {isLogin
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Sign In'}
            </Link>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AuthForm;
