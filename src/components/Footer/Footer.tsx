import {
  Typography,
  Box,
  Toolbar,
  useTheme,
  styled,
  Link,
} from '@mui/material';
import logo from 'assets/icons/logo.svg';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Container } from '@mui/system';

const StyledImageBox = styled(Link)({
  width: '100px',
  '& img': {
    width: '100%',
    height: '100%',
    objectPosition: 'bottom',
    objectFit: 'cover',
  },
});

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      id="footer"
      component="footer"
      sx={{
        borderTop: `${theme.palette.primary.main} 1px solid`,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        marginTop: '3rem',
        [theme.breakpoints.down('sml')]: {
          paddingTop: '1rem',
        },
      }}
    >
      <Container>
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
            [theme.breakpoints.down('sml')]: {
              flexDirection: 'column',
              gap: '1rem',
              pb: '1rem',
            },
          }}
          disableGutters
        >
          <StyledImageBox href="/">
            <img src={logo} alt="Elyte Store" />
          </StyledImageBox>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
            }}
          >
            <Link
              href="https://github.com/elian-cheng"
              sx={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
              }}
            >
              <GitHubIcon
                sx={{
                  fontSize: '2rem',
                  color: theme.palette.primary.contrastText,
                }}
              />
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.primary.contrastText,
                  [theme.breakpoints.down('tb')]: {
                    fontSize: '0.8rem',
                  },
                }}
              >
                Olga Chernega
              </Typography>
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </Box>
  );
};
export default Footer;
