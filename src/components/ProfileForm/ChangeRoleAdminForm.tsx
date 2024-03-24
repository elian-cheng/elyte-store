import {
  Container,
  Avatar,
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
} from '@mui/material';
import React, { FC, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { AxiosError } from 'axios';
import Colors from 'theme/colors';
import { useNavigate } from 'react-router-dom';
import ButtonLoader from 'components/ButtonLoader/ButtonLoader';
import { changeRoleSchema } from 'utils/validation/users';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ROLES, Role, cacheKeys } from 'utils/constants';
import { updateRole } from 'api/users';

export interface IFormData {
  role: string;
}

interface IChangeRoleFormProps {
  handleModal: () => void;
  userId: string | null;
}

const ChangeRoleAdminForm: FC<IChangeRoleFormProps> = ({
  handleModal,
  userId,
}) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [role, setRole] = useState<string>(Role.USER);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>({
    mode: 'onBlur',
    resolver: yupResolver(changeRoleSchema),
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
      await updateRole(userId, data.role as Role);
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
          <ManageAccountsIcon />
        </Avatar>
        <Typography component="h2" variant="h4" sx={{ my: '.5rem' }}>
          Change role
        </Typography>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          style={{ width: '100%' }}
        >
          <TextField
            select
            fullWidth
            required
            {...register('role')}
            id={'role'}
            label={'Role'}
            name={'role'}
            defaultValue=""
            value={role}
            variant="outlined"
            margin="normal"
            error={!!errors?.role}
            helperText={errors?.['role']?.message as string}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setRole(e.target.value)}
            sx={{ mb: '2rem' }}
          >
            {ROLES.map((availableRole) => (
              <MenuItem value={availableRole} key={availableRole}>
                {availableRole}
              </MenuItem>
            ))}
          </TextField>
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
export default ChangeRoleAdminForm;
