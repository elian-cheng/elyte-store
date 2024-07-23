import {
  Box,
  Container,
  Grid,
  styled,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import advantagesData from '../../../data/advantages.json';
import AdvantageCard from './AdvantageCard';

const StyledSection = styled(Box)(({ theme }) => ({
  marginBottom: '4rem',
  [theme.breakpoints.down('sm')]: {
    marginBottom: '2rem',
  },
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  textTransform: 'initial',
  textAlign: 'center',
  fontSize: '4rem',
  marginBottom: '2.3rem',
  [theme.breakpoints.down('md')]: {
    fontSize: '4rem',
    marginBottom: '5rem',
  },
  [theme.breakpoints.down('sm')]: {
    marginBottom: '3rem',
    fontSize: '1.5rem',
  },
  [theme.breakpoints.down('xs')]: {
    marginBottom: '1.5rem',
  },
}));

const Advantages = () => {
  const theme = useTheme();
  const [showAllCards, setShowAllCards] = useState(false);
  const [numCardsToShow, setNumCardsToShow] = useState(3);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const handleButtonClick = () => {
    setShowAllCards((prevShowAllCards) => !prevShowAllCards);
  };

  useEffect(() => {
    const setNumCardsToShowBasedOnWidth = () => {
      const containerWidth = containerRef.current?.offsetWidth;
      if (containerWidth) {
        setNumCardsToShow(
          showAllCards
            ? advantagesData.length
            : containerWidth >= 768 && containerWidth <= 1199.98
              ? 4
              : 3
        );
      }
    };

    setNumCardsToShowBasedOnWidth();
    window.addEventListener('resize', setNumCardsToShowBasedOnWidth);

    return () => {
      window.removeEventListener('resize', setNumCardsToShowBasedOnWidth);
    };
    /* eslint-disable-next-line */
  }, [showAllCards, containerRef.current]);

  return (
    <StyledSection id="advantages" component="section">
      <Container
        ref={containerRef}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <StyledTitle variant="h2">Advantages</StyledTitle>
        <Grid
          container
          rowSpacing={{ xxs: '2rem', xl: '4rem' }}
          columnSpacing={'1.25rem'}
          justifyContent="center"
          alignItems="stretch"
          sx={{ marginBottom: '3rem' }}
        >
          {advantagesData.slice(0, numCardsToShow).map((card) => (
            <Grid key={card.id} item xxs={12} tb={6} lg={4} display="flex">
              <AdvantageCard
                title={card.title}
                description={card.description}
                image={card.image}
              />
            </Grid>
          ))}
        </Grid>
        <Button
          variant="contained"
          onClick={handleButtonClick}
          sx={{
            [theme.breakpoints.down('tb')]: {
              width: '100%',
            },
          }}
        >
          {showAllCards ? 'Show Less' : 'Show All'}
        </Button>
      </Container>
    </StyledSection>
  );
};

export default Advantages;
