import { Container, Typography } from '@mui/material';
import AuthForm from './AuthForm/AuthForm';

const LoginPage = () => {
  return (
    <Container>
      <Typography variant="h3" sx={{ mt: '2rem' }}>
        Elyte Store
      </Typography>
      <AuthForm />
    </Container>
  );
};
export default LoginPage;
