import {
  Box,
  Breadcrumbs,
  Container,
  Link,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Gallery from 'components/ImageGallery/Gallery';
import MobileGallery from 'components/ImageGallery/MobileGallery';
import Loader from 'components/Loader/Loader';
import useGetProduct from 'hooks/useGetProduct';
import { IProduct } from 'interfaces/ProductInterface';
import { useParams } from 'react-router-dom';
import ProductDetails from './ProductDetails/ProductDetails';

const CatalogProductPage = () => {
  const { id } = useParams();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const {
    data: product = {} as IProduct,
    isLoading,
    isError,
  } = useGetProduct(id as string);

  return (
    <Container>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Typography>Something went wrong...</Typography>
      ) : (
        <>
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/catalog">
              Catalog
            </Link>
            {/* <Link
              underline="hover"
              color="inherit"
              href={`/catalog?category=${product.category}`}
            >
              {product.category}
            </Link> */}
            <Typography color="text.primary">{product.title}</Typography>
          </Breadcrumbs>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              width: '90%',
              margin: '50px auto',
              gap: '100px',
              '@media (max-width: 992px)': {
                gap: '70px',
              },
              [theme.breakpoints.down('md')]: {
                flexDirection: 'column',
                alignItems: 'center',
                gap: '30px',
                marginBottom: '30px',
              },
            }}
          >
            {isDesktop ? (
              <Gallery images={product.images} />
            ) : (
              <MobileGallery images={product.images} />
            )}
            <ProductDetails product={product} />
          </Box>
        </>
      )}
    </Container>
  );
};
export default CatalogProductPage;
