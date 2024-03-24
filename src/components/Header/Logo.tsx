import { styled } from '@mui/material';
import logo from 'assets/icons/logo.svg';
import { Link } from 'react-router-dom';
import { useAuth } from 'store/context/authContext';
import { Role } from 'utils/constants';

const StyledImageBox = styled(Link)({
  width: '100px',
  marginRight: '2rem',
  '& img': {
    width: '100%',
    height: '100%',
    objectPosition: 'bottom',
    objectFit: 'cover',
  },
});

const Logo = () => {
  const { user } = useAuth();
  const isAdmin = user && user === Role.ADMIN;

  return (
    <StyledImageBox to={isAdmin ? '/app' : '/'}>
      <img src={logo} alt="Elyte Store logo" />
    </StyledImageBox>
  );
};
export default Logo;
