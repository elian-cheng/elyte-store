import React, { Fragment } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Typography,
  Button,
  Box,
  Divider,
  darken,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import Colors from 'theme/colors';
import { useNavigate } from 'react-router-dom';
import {
  ICartItem,
  addItemToCart,
  removeItemFromCart,
} from 'store/redux/cartSlice';

const CartDrawer: React.FC = () => {
  const { totalQuantity, totalAmount, cartItems } = useAppSelector(
    (state) => state.cart
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const removeItemHandler = (id: string) => {
    dispatch(removeItemFromCart(id));
  };
  const addItemHandler = (product: ICartItem) => {
    dispatch(addItemToCart({ ...product }));
  };

  return (
    <Box
      sx={{
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <Typography variant="body1" sx={{ mb: '0.2rem' }}>
        <span
          style={{
            backgroundColor: Colors.SECONDARY_MAIN,
            padding: '0 0.2rem',
          }}
        >
          {totalQuantity}
        </span>
        {totalQuantity === 1 ? ` item in cart` : ` items in cart`}
      </Typography>
      <Divider />
      <List sx={{ flex: '1 1 50%' }}>
        {cartItems.map((item, index) => (
          <Fragment key={item.id}>
            <ListItem disableGutters sx={{ py: '0.7rem' }}>
              <ListItemIcon>
                <img
                  src={item.image}
                  alt={item.title}
                  width="50"
                  height="50"
                  className="product-image"
                />
              </ListItemIcon>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginLeft: '0.5rem',
                }}
              >
                <ListItemText
                  primary={item.title}
                  sx={{ '& span': { fontWeight: 500 } }}
                />
                <Box
                  sx={{
                    display: 'flex',
                    // justifyContent: 'center',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  {/* <Typography variant="body1" sx={{ mb: '0.2rem' }}>
                    <span>{`${item.quantity} x `}</span>
                    {`$${item.price}`}
                  </Typography> */}
                  <Box
                    sx={{
                      display: 'flex',
                      // justifyContent: 'center',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={addItemHandler.bind(null, item)}
                      sx={{
                        bgcolor: Colors.SECONDARY_MAIN,
                        '&:hover': {
                          bgcolor: darken(Colors.SECONDARY_MAIN, 0.1),
                        },
                      }}
                    >
                      <Add fontSize="small" />
                    </IconButton>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => removeItemHandler(item.id)}
                      sx={{
                        bgcolor: Colors.SECONDARY_MAIN,
                        '&:hover': {
                          bgcolor: darken(Colors.SECONDARY_MAIN, 0.1),
                        },
                      }}
                    >
                      <Remove fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {`$${(item.price * item.quantity).toFixed(2)}`}
                  </Typography>
                </Box>
              </Box>
            </ListItem>
            {index !== cartItems.length - 1 && <Divider />}
          </Fragment>
        ))}
      </List>
      <Box sx={{ marginTop: 'auto', justifySelf: 'flex-end' }}>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            my: '0.8rem',
          }}
        >
          <Typography variant="body1">Total:</Typography>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>
            ${totalAmount}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ mb: '0.5rem' }}
          onClick={() => navigate('/cart')}
        >
          View Cart
        </Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => navigate('/cart')}
        >
          Checkout
        </Button>
      </Box>
    </Box>
  );
};

export default CartDrawer;
