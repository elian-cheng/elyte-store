import { Button, Container, Typography } from '@mui/material';
import UsersTable from './UsersTable/UsersTable';
import { useNavigate } from 'react-router-dom';

const UsersPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Typography variant="h2" mb={1}>
        Users
      </Typography>
      <Button
        sx={{
          margin: '0.5rem 0 2rem',
        }}
        variant="outlined"
        size="large"
        onClick={() => navigate('/users/create')}
      >
        Add new user
      </Button>
      <UsersTable />
    </Container>
  );
};

export default UsersPage;
