import { Box, Rating, styled, Typography } from '@mui/material';
import Image from 'mui-image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Keyboard } from 'swiper/modules';
import testimonialsData from '../../../data/testimonials.json';
import Colors from 'theme/colors';
import './Testimonials.scss';

const sliderSettings = {
  spaceBetween: 48,
  modules: [Pagination, Keyboard],
  keyboard: { enabled: true, onlyInViewport: true },
  pagination: { clickable: true },
  slidesPerGroup: 1,
  centeredSlides: true,
  initialSlide: 1,
  grabCursor: true,
  breakpoints: {
    319: {
      slidesPerView: 1.15,
    },
    600: {
      slidesPerView: 1.31,
    },
    950: {
      slidesPerView: 1.75,
    },
    1200: {
      slidesPerView: 2.19,
    },
  },
};

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

const StyledSection = styled(Box)(({ theme }) => ({
  marginBottom: '3rem',
  [theme.breakpoints.down('sm')]: {
    marginBottom: '2rem',
  },
}));

const SlideCard = styled(Box)(({ theme }) => ({
  padding: '2.5rem 2.25rem 1.8rem',
  borderRadius: '2rem',
  boxShadow: Colors.BOX_SHADOW,
  [theme.breakpoints.down('sm')]: {
    padding: '1.5rem 1.25rem',
  },
}));

const AvatarWrapper = styled(Box)({
  width: '64px',
  height: '64px',
  overflow: 'hidden',
  borderRadius: '100%',
  '& img': {
    objectPosition: 'center',
    objectFit: 'cover',
    width: '100%',
    height: '100%',
  },
});

const CustomerInfoWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem',
  marginBottom: '1.5rem',
});

const TestimonialText = styled(Typography)({
  marginBottom: '1.8rem',
  whiteSpace: 'pre-line',
  lineHeight: '1.75rem',
});

const ClientRole = styled(Typography)(({ theme }) => ({
  color: Colors.PRIMARY_LIGHT,
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.75rem',
  },
}));

const ClientName = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
  },
}));

const Testimonials = () => {
  return (
    <StyledSection id="testimonials" component="section">
      <StyledTitle variant="h2">Testimonials</StyledTitle>
      <Swiper
        {...sliderSettings}
        className="testimonials-slider js-testimonials-slider"
      >
        {testimonialsData.map((card) => (
          <SwiperSlide key={card.id}>
            <SlideCard>
              <TestimonialText variant="body2">{card.text}</TestimonialText>
              <CustomerInfoWrapper>
                <AvatarWrapper>
                  <Image
                    src={card.image}
                    width={64}
                    height={64}
                    alt="mini cooper center testimonials"
                  />
                </AvatarWrapper>
                <Box>
                  <ClientRole variant="body2">{card.role}</ClientRole>
                  <ClientName variant="body1">{card.name}</ClientName>
                </Box>
              </CustomerInfoWrapper>
              <Rating
                name="read-only"
                value={card.rating}
                precision={0.5}
                size="large"
                readOnly
              />
            </SlideCard>
          </SwiperSlide>
        ))}
      </Swiper>
    </StyledSection>
  );
};
export default Testimonials;
