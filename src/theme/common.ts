import { Box, Typography, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Colors from 'theme/colors';

export const StyledCloseIcon = styled(CloseIcon)(({ theme }) => ({
  position: 'absolute',
  top: 32,
  right: 32,
  width: '2.5rem',
  height: '2.5rem',
  cursor: 'pointer',
  borderRadius: '100%',
  zIndex: '5',
  backgroundColor: Colors.PRIMARY_MAIN,
  color: Colors.WHITE,
  [theme.breakpoints.down('sm')]: {
    top: 16,
    right: 16,
    width: '1.5rem',
    height: '1.5rem',
  },
}));

export const ModalContentWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: Colors.WHITE,
  borderRadius: '6px',
  width: '30rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.down('lg')]: {
    width: '50vw',
  },
  [theme.breakpoints.down('tb')]: {
    width: '70vw',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '2.5rem 1.5rem',
    width: '100vw',
  },
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  color: Colors.MIDNIGHT_BLUE,
  textAlign: 'center',
  fontWeight: 500,
  fontSize: '1.75rem',
  lineHeight: '2.25rem',
  [theme.breakpoints.down('md')]: {
    fontSize: '1.5rem',
    lineHeight: '2rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
    lineHeight: '1.5rem',
  },
  '&::after': {
    content: '""',
    background: Colors.PRIMARY_MAIN,
    display: 'block',
    position: 'relative',
    width: '70px',
    height: '3px',
    zIndex: 1,
    margin: '0 auto',
    marginTop: '10px',
    marginBottom: '-5px',
    borderRadius: '5px',
  },
}));
