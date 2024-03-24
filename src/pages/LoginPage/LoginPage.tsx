import { Container, Typography } from '@mui/material';
import LoginForm from './LoginForm/LoginForm';

const LoginPage = () => {
  return (
    <Container>
      <Typography variant="h3" sx={{ mt: '2rem' }}>
        Elyte Store
      </Typography>
      <LoginForm />
    </Container>
  );
};
export default LoginPage;
