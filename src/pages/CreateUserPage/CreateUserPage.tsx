import { Box, Button, Container, Typography } from '@mui/material';
import CreateUserForm from './CreateUserForm/CreateUserForm';
import { useNavigate } from 'react-router-dom';
import WestIcon from '@mui/icons-material/West';
import Colors from 'theme/colors';

const CreateUserPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
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
        <Typography variant="h2">Create User</Typography>
      </Box>
      <CreateUserForm />
    </Container>
  );
};
export default CreateUserPage;
