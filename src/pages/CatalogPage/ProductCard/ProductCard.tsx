import * as Icons from '@mui/icons-material';
import { Grid, Paper, Box, Typography, Button, styled } from '@mui/material';
import { useAppDispatch } from 'hooks/redux';
import { IProduct } from 'interfaces/ProductInterface';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { addItemToCart } from 'store/redux/cartSlice';

export interface IProductProps {
  product: IProduct;
}

const FlyingProductImage = styled('img')(({ theme }) => ({
  display: 'none',
  maxWidth: '100px',
  maxHeight: '100px',
  opacity: 1,
  position: 'fixed',
  zIndex: 5,
  animation: 'fly 1s ease-in-out forwards',
  borderRadius: '10px',

  '@keyframes fly': {
    to: {
      top: 0, // Final top position
      left: '90%', // Final left position
      [theme.breakpoints.down('md')]: {
        right: '50%',
      },
      opacity: 0, // Final opacity
      display: 'none', // Final display
      maxWidth: '50px', // Final max-width
      maxHeight: '50px', // Final max-height
    },
  },
}));

const ProductCard: React.FC<IProductProps> = ({ product }) => {
  const { title, price, _id, images, discountPrice } = product;
  const flyingImageRef = useRef<HTMLImageElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const addToCartHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    sendImageToCart(e);
    dispatch(
      addItemToCart({
        id: _id,
        title,
        price: discountPrice || price,
        quantity: 1,
        image: images[0],
      })
    );
  };

  const sendImageToCart = (ev: React.MouseEvent<HTMLButtonElement>) => {
    if (flyingImageRef.current) {
      flyingImageRef.current.style.display = 'inline-block';
      flyingImageRef.current.style.left = ev.clientX - 50 + 'px';
      flyingImageRef.current.style.top = ev.clientY - 50 + 'px';
    }
    setTimeout(() => {
      if (flyingImageRef.current) {
        flyingImageRef.current.style.display = 'none';
      }
    }, 1000);
  };

  return (
    <Grid
      item
      key={_id}
      xs={5}
      lg={3}
      sx={{ minWidth: '275px', cursor: 'pointer' }}
      onClick={() => navigate(`/catalog/${_id}`)}
    >
      <Paper
        elevation={5}
        sx={{
          '&:hover': {
            boxShadow: 8,
          },
          mb: 2,
          overflow: 'hidden',
          height: '100%',
        }}
      >
        <Box
          m={1}
          borderRadius={1}
          sx={{
            height: 180,
            backgroundImage: 'url(' + images[0] + ')',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
          }}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography component="h2" variant="h6" sx={{ my: '.5rem' }}>
            {title}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 1.5,
              justifyContent: 'center',
              alignSelf: 'center',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 400 }}>
              ${product.discountPrice.toFixed(2)}
            </Typography>
            {product.discountPercentage > 0 && (
              <>
                <Typography
                  variant="body1"
                  sx={{ textDecoration: 'line-through', py: '0.3rem' }}
                >
                  ${product.price.toFixed(2)}
                </Typography>
              </>
            )}
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<Icons.ShoppingCart />}
            sx={{ verticalAlign: 'middle', color: 'white' }}
            onClick={addToCartHandler}
          >
            Add to cart
          </Button>
          <FlyingProductImage
            src={images[0]}
            alt={title}
            ref={flyingImageRef}
          />
        </Box>
      </Paper>
    </Grid>
  );
};
export default ProductCard;
