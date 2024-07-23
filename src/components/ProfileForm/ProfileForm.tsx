import {
  Box,
  Button,
  Divider,
  Modal,
  Typography,
  useTheme,
} from '@mui/material';
import Loader from 'components/Loader/Loader';
import useGetUserProfile from 'hooks/useGetUserProfile';
import { getUserId } from 'utils/helpers';
import { Resolver, SubmitHandler, useForm } from 'react-hook-form';
import { updateUserProfileSchema } from 'utils/validation/users';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import UserInfoForm from './UserInfoForm';
import ChangePasswordUserForm from './ChangePasswordUserForm';
import {
  ModalContentWrapper,
  StyledCloseIcon,
  SectionTitle,
} from 'theme/common';
import useUpdateUserProfile from 'hooks/useUpdateUserProfile';

export interface IUserProfileForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  state: string;
}

const ProfileForm = () => {
  const userId = getUserId();
  const { data: currentUser, isLoading, isError } = useGetUserProfile(userId);
  const updateUserMutation = useUpdateUserProfile();
  const theme = useTheme();
  const [modalIsShown, setModalIsShown] = useState(false);
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');

  const handleModal = () => {
    setModalIsShown((open) => !open);
  };

  const closeModal = () => {
    setModalIsShown(false);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IUserProfileForm>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      zip: '',
      country: '',
      state: '',
    },
    mode: 'onBlur',
    resolver: yupResolver(
      updateUserProfileSchema
    ) as Resolver<IUserProfileForm>,
    shouldUseNativeValidation: false,
  });

  useEffect(() => {
    if (!isLoading && !isError && currentUser) {
      reset({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser?.shippingInfo?.address || '',
        city: currentUser?.shippingInfo?.city || '',
        zip: currentUser?.shippingInfo?.zip || '',
        country: currentUser?.shippingInfo?.country || '',
        state: currentUser?.shippingInfo?.state || '',
      });
      setCountry(currentUser?.shippingInfo?.country || '');
      setState(currentUser?.shippingInfo?.state || '');
    }
  }, [currentUser, isLoading, isError, reset]);

  const onSubmit: SubmitHandler<IUserProfileForm> = async (
    data: IUserProfileForm
  ) => {
    if (!userId) return;
    const updateUserData = {
      name: data.name,
      phone: data.phone,
      shippingInfo: {
        address: data.address,
        city: data.city,
        country: data.country,
        state: data?.state || '',
        zip: data.zip,
      },
    };
    await updateUserMutation.mutateAsync({ id: userId, body: updateUserData });
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
            Update profile
          </Button>
        </form>
        {modalIsShown && (
          <Modal open={modalIsShown} onClose={closeModal}>
            <ModalContentWrapper>
              <StyledCloseIcon onClick={closeModal} />
              <ChangePasswordUserForm
                handleModal={closeModal}
                userId={userId}
              />
            </ModalContentWrapper>
          </Modal>
        )}
        <Divider
          orientation={'horizontal'}
          sx={{
            my: 3,
          }}
        />
        <SectionTitle variant="h3" sx={{ mb: '2.5rem', textAlign: 'center' }}>
          Security information
        </SectionTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button variant="contained" onClick={() => handleModal()}>
            Change password
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
export default ProfileForm;
