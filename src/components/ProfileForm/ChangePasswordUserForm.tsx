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
import React, { FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import PasswordIcon from '@mui/icons-material/Password';
import { AxiosError } from 'axios';
import Colors from 'theme/colors';
import { changeUserPassword } from 'api/auth';
import { useNavigate } from 'react-router-dom';
import ButtonLoader from 'components/ButtonLoader/ButtonLoader';
import { changePasswordSchema } from 'utils/validation/users';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { cacheKeys } from 'utils/constants';

export interface IFormData {
  oldPassword: string;
  newPassword: string;
}

interface IChangePasswordFormProps {
  handleModal: () => void;
  userId: string | null;
}

const ChangePasswordUserForm: FC<IChangePasswordFormProps> = ({
  handleModal,
  userId,
}) => {
  const queryClient = useQueryClient();
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const showOldPasswordHandler = () => setShowOldPassword((show) => !show);
  const showNewPasswordHandler = () => setShowNewPassword((show) => !show);

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
    resolver: yupResolver(changePasswordSchema),
    shouldUseNativeValidation: false,
  });

  const onSubmit: SubmitHandler<IFormData> = async (data) => {
    if (!userId) {
      toast.error('User id is missing.');
      navigate('/users');
      return;
    }
    setIsLoading(true);
    try {
      await changeUserPassword(userId, data.oldPassword, data.newPassword);
      toast.success('User was successfully updated.');
      queryClient.invalidateQueries({
        queryKey: cacheKeys.userProfile(userId),
      });
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error?.response?.data?.message || 'Sending request failed.');
    } finally {
      setIsLoading(false);
      handleModal();
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
          backgroundColor: Colors.WHITE,
        }}
      >
        <Avatar
          sx={{ color: Colors.WHITE, backgroundColor: Colors.PRIMARY_DARK }}
        >
          <PasswordIcon />
        </Avatar>
        <Typography component="h2" variant="h4" sx={{ my: '.5rem' }}>
          Change password
        </Typography>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          style={{ width: '100%' }}
        >
          <TextField
            {...register('oldPassword')}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="oldPassword"
            label="Old password"
            id="oldPassword"
            type={showOldPassword ? 'text' : 'password'}
            autoComplete="current-password"
            error={!!errors.oldPassword}
            helperText={errors?.['oldPassword']?.message as string}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={showOldPasswordHandler}
                    onMouseDown={passwordMouseDownHandler}
                  >
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: '2rem' }}
          />
          <TextField
            {...register('newPassword')}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label="New password"
            id="newPassword"
            type={showNewPassword ? 'text' : 'password'}
            autoComplete="new-password"
            error={!!errors.newPassword}
            helperText={errors?.['newPassword']?.message as string}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={showNewPasswordHandler}
                    onMouseDown={passwordMouseDownHandler}
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
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
export default ChangePasswordUserForm;
