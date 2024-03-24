import { NavLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import blocks from 'assets/images/error/blocks.gif';

const StyledImageBox = styled(Box)(({ theme }) => ({
  height: '500px',
  width: '500px',
  [theme.breakpoints.down('lg')]: {
    height: '400px',
    width: '400px',
  },
  [theme.breakpoints.down('xs')]: { height: '300px', width: '300px' },
  '& img': {
    width: '100%',
    height: '100%',
    objectPosition: 'bottom',
    objectFit: 'cover',
  },
}));

function ErrorPage() {
  const theme = useTheme();

  return (
    <Container
      sx={{
        paddingTop: '3rem',
        paddingBottom: '3rem',
        zIndex: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '4rem',
        [theme.breakpoints.down('mdl')]: {
          flexDirection: 'column',
          gap: 0,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          rowGap: '1.5rem',
        }}
      >
        <Typography
          variant="h1"
          sx={{ color: theme.palette.primary.main, fontWeight: 700 }}
        >
          404
        </Typography>
        <Typography
          variant="h3"
          sx={{
            [theme.breakpoints.down('xs')]: { fontSize: '2.5rem' },
          }}
        >
          Page not found
        </Typography>
        <NavLink to="/">
          <Button variant="contained" size="large" sx={{ mt: 2 }}>
            To Main Page
          </Button>
        </NavLink>
      </Box>
      <StyledImageBox>
        <img src={blocks} alt="blocks gif" />
      </StyledImageBox>
    </Container>
  );
}

export default ErrorPage;
