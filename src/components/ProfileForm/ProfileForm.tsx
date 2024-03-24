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
import { IUserMutation } from 'interfaces/UserInterface';
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

const ProfileForm = () => {
  const userId = getUserId();
  const { data: currentUser, isLoading, isError } = useGetUserProfile(userId);
  const updateUserMutation = useUpdateUserProfile();
  const theme = useTheme();
  const [modalIsShown, setModalIsShown] = useState(false);

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
  } = useForm<IUserMutation>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
    mode: 'onBlur',
    resolver: yupResolver(updateUserProfileSchema) as Resolver<IUserMutation>,
    shouldUseNativeValidation: false,
  });

  useEffect(() => {
    if (!isLoading && !isError && currentUser) {
      reset({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
      });
    }
  }, [currentUser, isLoading, isError, reset]);

  const onSubmit: SubmitHandler<IUserMutation> = async (
    data: IUserMutation
  ) => {
    if (!userId) return;
    await updateUserMutation.mutateAsync({ id: userId, body: data });
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
          <UserInfoForm register={register} errors={errors} />
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
