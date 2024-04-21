import {
  AppBar,
  Badge,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  Stack,
  Toolbar,
  styled,
} from '@mui/material';

import Logo from './Logo';
import { StyledLink, StyledMenuItem } from './Header.styles';
import MobileMenu from './MobileMenu';
import { Role } from 'utils/constants';
import { MANAGER_NAV, USER_NAV } from './Navigation';
import AvatarMenu from './AvatarMenu';
import DropdownMenuItem from './DropdownMenuItem';
import { Login, ShoppingCart, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'store/context/authContext';
import { useAppSelector } from 'hooks/redux';
import { useState } from 'react';
import CartDrawer from 'components/CartDrawer/CartDrawer';
import Colors from 'theme/colors';

const Navbar = styled(List)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  [theme.breakpoints.down('mdl')]: {
    display: 'none',
  },
}));

const StyledCloseIcon = styled(Close)({
  position: 'absolute',
  top: 10,
  right: 10,
  width: '1.4rem',
  height: '1.4rem',
  cursor: 'pointer',
  borderRadius: '100%',
  zIndex: '5',
  color: Colors.PRIMARY_MAIN,
  backgroundColor: Colors.WHITE,
});

const Header = () => {
  const { user } = useAuth();
  const [openCartDrawer, setOpenCartDrawer] = useState(false);
  const { totalQuantity } = useAppSelector((state) => state.cart);
  const isAdmin = user && user === Role.ADMIN;
  const navigate = useNavigate();

  return (
    <>
      <AppBar id="header" sx={{ marginBottom: '1.5rem' }} position="static">
        <Container>
          <Toolbar disableGutters>
            <Logo />
            <Navbar>
              {user && isAdmin && (
                <>
                  {MANAGER_NAV.map((link) => (
                    <StyledMenuItem disableGutters key={link.url}>
                      <StyledLink to={link.url}>{link.name}</StyledLink>
                    </StyledMenuItem>
                  ))}
                  <DropdownMenuItem
                    name={'Shop'}
                    links={[
                      { name: 'Home', url: '/' },
                      {
                        name: 'Catalog',
                        url: '/catalog',
                      },
                    ]}
                  />
                  <DropdownMenuItem
                    name={'Products'}
                    links={[
                      {
                        name: 'Products info',
                        url: '/products',
                      },
                      {
                        name: 'Create product',
                        url: '/products/create',
                      },
                    ]}
                  />
                </>
              )}
              {!isAdmin && (
                <>
                  {USER_NAV.map((link) => (
                    <StyledMenuItem disableGutters key={link.url}>
                      <StyledLink to={link.url}>{link.name}</StyledLink>
                    </StyledMenuItem>
                  ))}
                </>
              )}
            </Navbar>
            <Stack
              sx={{
                marginLeft: 'auto',
                textAlign: 'center',
                alignItems: 'center',
              }}
              spacing={2}
              direction={'row'}
            >
              {!isAdmin && (
                <IconButton
                  onClick={() => setOpenCartDrawer((open) => !open)}
                  sx={{ color: Colors.WHITE, padding: 0 }}
                  size="large"
                >
                  <Badge badgeContent={totalQuantity} color="secondary">
                    <ShoppingCart
                      sx={{
                        verticalAlign: 'middle',
                        mr: '.5rem',
                      }}
                    />
                  </Badge>
                </IconButton>
              )}
              {user ? (
                <AvatarMenu />
              ) : (
                <Button
                  onClick={() => navigate('/login')}
                  endIcon={<Login />}
                  sx={{
                    textTransform: 'capitalize',
                    fontSize: '1rem',
                    px: '.7rem',
                    color: Colors.PRIMARY_CONTR_TEXT,
                  }}
                >
                  Login
                </Button>
              )}
            </Stack>
            <MobileMenu />
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        anchor="right"
        open={openCartDrawer}
        onClose={() => setOpenCartDrawer(false)}
        PaperProps={{
          sx: {
            maxWidth: 320,
            width: 300,
          },
        }}
      >
        <StyledCloseIcon onClick={() => setOpenCartDrawer((open) => !open)} />
        <CartDrawer />
      </Drawer>
    </>
  );
};

export default Header;
