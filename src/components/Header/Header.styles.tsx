import { List, MenuItem, styled } from '@mui/material';
import { NavLink } from 'react-router-dom';
import Colors from 'theme/colors';
import theme from 'theme/theme';

export const Navbar = styled(List)(() => ({
  height: '80px',
  paddingTop: 0,
  paddingBottom: 0,
  display: 'flex',
  alignItems: 'center',
}));

export const StyledLink = styled(NavLink)({
  color: Colors.WHITE,
  fontWeight: 500,
  lineHeight: 'normal',
  fontSize: '1rem',
  textDecoration: 'none',
  textTransform: 'uppercase',
  transition: 'color 0.3s ease',
  position: 'relative',
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  padding: '10px 16px',

  '&.active': {
    '&::after': {
      content: '" "',
      display: 'flex',
      justifyContent: 'center',
      position: 'absolute',
      width: '88%',
      height: '2px',
      backgroundColor: Colors.WHITE,
      marginTop: '40px',
      left: '4px',
      [theme.breakpoints.down('xl')]: {
        marginTop: '30px',
      },
    },
  },
  [theme.breakpoints.down('xl')]: {
    fontSize: '0.8rem',
    padding: '6px 8px',
  },
});

export const StyledMenuItem = styled(MenuItem)(() => ({
  height: '100%',
  transition: 'color 0.3s ease',

  '&:hover': {
    background: 'rgba(173, 187, 185, 0.1)',
  },
}));

export const styledMenuItemForSignIn = {
  transition: 'all 0.3s ease',
  backgroundColor: Colors.PRIMARY_MAIN,
  padding: '1rem 1.9rem',
  '& button': {
    textTransform: 'uppercase',
    fontSize: '1rem',
  },
  '&:hover': {
    color: Colors.WHITE,
    backgroundColor: Colors.SECONDARY_MAIN,
  },
  [theme.breakpoints.down('lg')]: {
    padding: '1.2rem 1.9rem',
  },
  [theme.breakpoints.down('mlg')]: {
    padding: '0.8rem 1rem',
  },
  [theme.breakpoints.down('sm')]: {
    minHeight: '1rem',
    padding: '0.4rem 1rem',
  },
};
export const styledAddButtonBox = {
  width: '40px',
  height: '38px',
  backgroundColor: Colors.WHITE,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: '1rem',
};
