import {
  Box,
  Button,
  Divider,
  Modal,
  Typography,
  useTheme,
} from '@mui/material';
import WestIcon from '@mui/icons-material/West';
import Loader from 'components/Loader/Loader';
import useGetUserProfile from 'hooks/useGetUserProfile';
import { IUserMutation } from 'interfaces/UserInterface';
import { Resolver, SubmitHandler, useForm } from 'react-hook-form';
import { updateUserProfileSchema } from 'utils/validation/users';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import UserInfoForm from 'components/ProfileForm/UserInfoForm';
import { useNavigate, useParams } from 'react-router-dom';
import ChangePasswordAdminForm from 'components/ProfileForm/ChangePasswordAdminForm';
import {
  ModalContentWrapper,
  SectionTitle,
  StyledCloseIcon,
} from 'theme/common';
import ChangeRoleAdminForm from 'components/ProfileForm/ChangeRoleAdminForm';
import Colors from 'theme/colors';
import useUpdateUserProfile from 'hooks/useUpdateUserProfile';

const UpdateUserForm = () => {
  const { id } = useParams();
  const userId = id ? id : null;
  const { data: currentUser, isLoading, isError } = useGetUserProfile(userId);
  const theme = useTheme();
  const updateUserMutation = useUpdateUserProfile();
  const navigate = useNavigate();
  const [modalIsShown, setModalIsShown] = useState(false);
  const [modalType, setModalType] = useState<'password' | 'role'>('password');

  const handleModal = () => {
    setModalIsShown((open) => !open);
  };

  const closeModal = () => {
    setModalIsShown(false);
  };

  const handleEditUser = (modalType: 'password' | 'role') => {
    setModalType(modalType);
    handleModal();
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
    navigate('/users');
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!currentUser || isError) {
    return <Typography>Something went wrong...</Typography>;
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          mb: '3rem',
        }}
      >
        <Button
          onClick={() => navigate(-1)}
          style={{ color: Colors.PRIMARY_LIGHT }}
        >
          <WestIcon fontSize="large" />
        </Button>
        <Typography variant="h2">
          {'Profile of'} {currentUser.name}
        </Typography>
      </Box>
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
              Update user
            </Button>
          </form>
          {modalIsShown && (
            <Modal open={modalIsShown} onClose={closeModal}>
              <ModalContentWrapper>
                <StyledCloseIcon onClick={closeModal} />
                {modalType === 'password' && (
                  <ChangePasswordAdminForm
                    handleModal={closeModal}
                    userId={userId}
                  />
                )}
                {modalType === 'role' && (
                  <ChangeRoleAdminForm
                    handleModal={closeModal}
                    userId={userId}
                  />
                )}
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
              gap: '1rem',
            }}
          >
            <Button variant="outlined" onClick={() => handleEditUser('role')}>
              Change role
            </Button>
            <Button
              variant="contained"
              onClick={() => handleEditUser('password')}
            >
              Change password
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};
export default UpdateUserForm;
