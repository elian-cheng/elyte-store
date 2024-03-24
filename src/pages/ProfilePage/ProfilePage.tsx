import { Container, Typography } from '@mui/material';
import ProfileForm from 'components/ProfileForm/ProfileForm';

const ProfilePage = () => {
  return (
    <Container>
      <Typography variant="h2" mb={2}>
        My Profile
      </Typography>
      <ProfileForm />
    </Container>
  );
};
export default ProfilePage;
