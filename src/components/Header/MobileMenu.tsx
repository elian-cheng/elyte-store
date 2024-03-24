import { useState } from 'react';
import { Drawer, List, MenuItem, styled, Link } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { MANAGER_NAV_MOBILE, USER_NAV } from './Navigation';
import Colors from 'theme/colors';
import { useAuth } from 'store/context/authContext';
import { Role } from 'utils/constants';

const StyledMenuIcon = styled(MenuIcon)(({ theme }) => ({
  cursor: 'pointer',
  display: 'none',
  width: '3rem',
  height: '3rem',
  color: Colors.WHITE,
  [theme.breakpoints.down('mdl')]: {
    display: 'block',
    marginLeft: '1rem',
  },
  [theme.breakpoints.down('sm')]: {
    width: '2.25rem',
    height: '2.25rem',
  },
}));

const StyledCloseIcon = styled(CloseIcon)({
  position: 'absolute',
  top: 24,
  right: 24,
  width: '1.4rem',
  height: '1.4rem',
  cursor: 'pointer',
  borderRadius: '100%',
  zIndex: '5',
  color: Colors.PRIMARY_MAIN,
  backgroundColor: Colors.WHITE,
});

const StyledList = styled(List)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  gap: '0.5rem',
  alignItems: 'center',
  paddingTop: '3.5rem',
  paddingLeft: '2rem',
  paddingRight: '2rem',
  paddingBottom: '2.5rem',
  height: '100%',
  width: '100%',
});

const StyledLink = styled(Link)({
  color: Colors.MIDNIGHT_BLUE,
  fontWeight: 'semibold',
  cursor: 'pointer',
  fontSize: '1rem',
  minWidth: 0,
  textDecoration: 'none',
  transition: 'color 0.3s ease',
});

const StyledMenuItem = styled(MenuItem)({
  fontSize: '1rem',
  transition: 'color 0.3s ease',
  padding: '10px',
});

const MobileMenu = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const { user } = useAuth();
  const isAdmin = user && user === Role.ADMIN;

  return (
    <>
      <StyledMenuIcon onClick={() => setOpenDrawer((open) => !open)} />
      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        PaperProps={{
          sx: {
            maxWidth: 247,
            width: 247,
          },
        }}
      >
        <StyledCloseIcon onClick={() => setOpenDrawer((open) => !open)} />
        <StyledList key={'navbar'}>
          <StyledMenuItem key={'home'}>
            <Link
              underline="none"
              href="/"
              sx={{
                fontSize: '1.4rem',
                fontWeight: 'bold',
                textAlign: 'center',
                color: 'primary.main',
                textTransform: 'uppercase',
              }}
            >
              Elyte Store
            </Link>
          </StyledMenuItem>
          {user && isAdmin
            ? MANAGER_NAV_MOBILE.map((link) => (
                <StyledMenuItem key={link.url}>
                  <StyledLink href={link.url}>{link.name}</StyledLink>
                </StyledMenuItem>
              ))
            : USER_NAV.map((link) => (
                <StyledMenuItem key={link.url}>
                  <StyledLink href={link.url}>{link.name}</StyledLink>
                </StyledMenuItem>
              ))}
        </StyledList>
      </Drawer>
    </>
  );
};
export default MobileMenu;
