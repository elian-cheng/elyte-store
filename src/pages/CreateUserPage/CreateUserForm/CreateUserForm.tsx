import { Box, Button, Divider, Typography, useTheme } from '@mui/material';

import Loader from 'components/Loader/Loader';
import useGetUserProfile from 'hooks/useGetUserProfile';
import { getUserId } from 'utils/helpers';
import { Resolver, SubmitHandler, useForm } from 'react-hook-form';
import { createUserProfileSchema } from 'utils/validation/users';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import UserInfoForm from 'components/ProfileForm/UserInfoForm';
import useCreateUserProfile from 'hooks/useCreateUserProfile';
import SecurityInfoForm from 'components/ProfileForm/SecurityInfoForm';
import { Role } from 'utils/constants';
import { useNavigate } from 'react-router-dom';

export interface IUserCreateForm {
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  state: string;
}

const CreateUserForm = () => {
  const userId = getUserId();
  const { data: currentUser, isLoading, isError } = useGetUserProfile(userId);
  const theme = useTheme();
  const [role, setRole] = useState<Role>(Role.USER);
  const createUserMutation = useCreateUserProfile();
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IUserCreateForm>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: Role.USER,
      phone: '',
      address: '',
      city: '',
      zip: '',
      country: '',
      state: '',
    },
    mode: 'onBlur',
    resolver: yupResolver(createUserProfileSchema) as Resolver<IUserCreateForm>,
    shouldUseNativeValidation: false,
  });

  const onSubmit: SubmitHandler<IUserCreateForm> = async (
    data: IUserCreateForm
  ) => {
    const createUserData = {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: (data.role as Role) || Role.USER,
      shippingInfo: {
        address: data.address,
        city: data.city,
        country: data.country,
        state: data?.state || '',
        zip: data.zip,
      },
    };
    await createUserMutation.mutateAsync(createUserData);
    reset();
    navigate('/users');
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!currentUser || isError) {
    return <Typography>Something went wrong...</Typography>;
  }

  return (
    <Box
      sx={{
        width: '70%',
        margin: 'auto',
        [theme.breakpoints.down('lg')]: {
          width: '80%',
        },
      }}
    >
      <Box>
        <form noValidate onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <UserInfoForm
            register={register}
            errors={errors}
            currentCountry={country}
            setCountry={setCountry}
            currentState={state}
            setState={setState}
          />
          <Divider
            orientation={'horizontal'}
            sx={{
              my: 3,
            }}
          />
          <SecurityInfoForm
            register={register}
            errors={errors}
            role={role}
            setRole={setRole}
          />
          <Divider
            orientation={'horizontal'}
            sx={{
              my: 3,
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: '1rem',
              py: '0.8rem',
              color: 'white',
            }}
          >
            Create User
          </Button>
        </form>
      </Box>
    </Box>
  );
};
export default CreateUserForm;
