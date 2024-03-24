import { Button, Box, Container, Typography } from '@mui/material';
import WestIcon from '@mui/icons-material/West';
import { useNavigate } from 'react-router-dom';
import Colors from 'theme/colors';
import CreateProductForm from './CreateProductForm/CreateProductForm';

const CreateProductPage = () => {
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
        <Typography variant={'h2'}>Create Product</Typography>
      </Box>
      <CreateProductForm />
    </Container>
  );
};

export default CreateProductPage;
