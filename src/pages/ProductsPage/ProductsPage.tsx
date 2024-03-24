import ProductsTable from './ProductsTable/ProductsTable';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProductsPage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Typography variant={'h2'} mb={1}>
        Products
      </Typography>

      <Button
        variant="outlined"
        size="small"
        onClick={() => navigate('/products/create')}
        sx={{
          margin: '0.5rem 0 2rem',
        }}
      >
        Add new product
      </Button>
      <ProductsTable />
    </Container>
  );
};

export default ProductsPage;
