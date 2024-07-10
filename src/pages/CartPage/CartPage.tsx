import { Box, Grid, Typography } from '@mui/material';
import { useAppSelector } from '../../hooks/redux';
import CartProduct from './CartProduct/CartProduct';
import CartSummary from './CartSummary/CartSummary';

const CartPage = () => {
  const { cartItems, totalAmount, totalQuantity } = useAppSelector(
    (state) => state.cart
  );

  return (
    <>
      {!cartItems.length ? (
        <Typography component="h2" variant="h4" sx={{ mt: '5rem' }}>
          The cart is empty. Add some items =)
        </Typography>
      ) : (
        <Box
          sx={{
            my: 3,
            p: 2,
            overflow: 'hidden',
            height: '100%',
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Typography variant="h4" component="h1" sx={{ mb: '1rem' }}>
                Cart Items
              </Typography>
              {cartItems.map((item) => {
                return <CartProduct key={item.id} {...item} />;
              })}
            </Grid>
            <Grid item xs={12} md={4}>
              <CartSummary
                totalAmount={totalAmount ? totalAmount : 0}
                totalQuantity={totalQuantity ? totalQuantity : 0}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};
export default CartPage;
