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

export interface IUserUpdateForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  state: string;
}

const UpdateUserForm = () => {
  const { id } = useParams();
  const userId = id ? id : null;
  const { data: currentUser, isLoading, isError } = useGetUserProfile(userId);
  const theme = useTheme();
  const updateUserMutation = useUpdateUserProfile();
  const navigate = useNavigate();
  const [modalIsShown, setModalIsShown] = useState(false);
  const [modalType, setModalType] = useState<'password' | 'role'>('password');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');

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
  } = useForm<IUserUpdateForm>({
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
    resolver: yupResolver(updateUserProfileSchema) as Resolver<IUserUpdateForm>,
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

  const onSubmit: SubmitHandler<IUserUpdateForm> = async (
    data: IUserUpdateForm
  ) => {
    if (!userId) return;
    const updateUserData = {
      name: data.name,
      email: data.email,
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
