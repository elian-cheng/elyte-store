import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from 'hooks/redux';

import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  styled,
} from '@mui/material';
import { isoCodeToCountryStateName } from 'utils/helpers';

interface IConfirmOrderProps {
  onNext: () => void;
  onBack: () => void;
}

const ConfirmOrderContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const ConfirmOrderPage = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}));

const ShippingInfoBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const OrderSummaryBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  marginTop: theme.spacing(2),
}));

const ConfirmOrder: FC<IConfirmOrderProps> = ({ onNext, onBack }) => {
  const { totalAmount, cartItems, userData } = useAppSelector(
    (state) => state.cart
  );

  let address = '';
  const countryState = isoCodeToCountryStateName(
    userData?.shippingInfo?.country || '',
    userData?.shippingInfo?.state || ''
  );
  if (userData && userData.shippingInfo) {
    address = `${userData?.shippingInfo?.address}, ${userData?.shippingInfo
      ?.city}, ${userData?.shippingInfo?.zip}, ${countryState.country}${
      countryState.state ? `, ${countryState.state}` : ''
    }`;
  }
  const proceedToPayment = () => {
    onNext();
  };

  return (
    <>
      <ConfirmOrderContainer>
        <ConfirmOrderPage>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <ShippingInfoBox>
                <Typography variant="h6">Shipping Info</Typography>
                <Divider />
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Name"
                      secondary={userData?.name || ''}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Phone"
                      secondary={userData?.phone || ''}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Address" secondary={address} />
                  </ListItem>
                </List>
              </ShippingInfoBox>
              <ShippingInfoBox>
                <Typography variant="h6">Your Cart Items:</Typography>
                <Divider />
                <List>
                  {cartItems.map((item) => (
                    <ListItem key={item.id} divider>
                      <ListItemAvatar>
                        <Avatar
                          src={item.image}
                          alt={item.title}
                          sx={{
                            borderRadius: 0,
                            '& img': {
                              objectFit: 'contain',
                            },
                          }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Link to={`/catalog/${item.id}`}>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                '&:hover': {
                                  textDecoration: 'underline',
                                },
                              }}
                            >
                              {item.title}
                            </Typography>
                          </Link>
                        }
                        secondary={
                          <>
                            {item.quantity} X ${item.price} ={' '}
                            <strong>
                              ${(item.price * item.quantity).toFixed(2)}
                            </strong>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </ShippingInfoBox>
            </Grid>
            <Grid item xs={12} md={5}>
              <OrderSummaryBox>
                <Typography variant="h6">Order Summary</Typography>
                <Divider />
                <Box sx={{ mt: 2 }}>
                  <Grid container justifyContent="space-between">
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6">${totalAmount}</Typography>
                  </Grid>
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={proceedToPayment}
                  sx={{
                    mt: '1rem',
                  }}
                >
                  Proceed To Payment
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={onBack}
                  sx={{
                    mt: '1rem',
                  }}
                >
                  Return to Shipping
                </Button>
              </OrderSummaryBox>
            </Grid>
          </Grid>
        </ConfirmOrderPage>
      </ConfirmOrderContainer>
    </>
  );
};

export default ConfirmOrder;
