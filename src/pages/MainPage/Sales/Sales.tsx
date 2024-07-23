import { useEffect, useState } from 'react';
import './Sales.scss';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import salesData from '../../../data/sales';
import { Box, Button } from '@mui/material';

const Sales = () => {
  const slideLength = salesData.length;

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentSlide(0);
  }, []);

  useEffect(() => {
    let slideInterval: ReturnType<typeof setInterval>;
    const intervalTime = 5000;

    function auto() {
      slideInterval = setInterval(nextSlide, intervalTime);
    }
    auto();
    return () => {
      clearInterval(slideInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide]);

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slideLength - 1 : currentSlide - 1);
  };

  const nextSlide = () => {
    setCurrentSlide(currentSlide === slideLength - 1 ? 0 : currentSlide + 1);
  };

  return (
    <Box className="slider" sx={{ marginTop: '-1.5rem', marginBottom: '4rem' }}>
      <ArrowBack className="arrow prev" onClick={prevSlide} />
      <ArrowForward className="arrow next" onClick={nextSlide} />

      {salesData.map((slide, index) => (
        <div
          key={index}
          className={index === currentSlide ? 'slide current' : 'slide'}
        >
          {index === currentSlide && (
            <>
              <img src={slide.image} alt="slide" />
              <div className="content">
                <span className="span1"></span>
                <span className="span2"></span>
                <span className="span3"></span>
                <span className="span4"></span>
                <h2>{slide.heading}</h2>
                <p>{slide.desc}</p>
                <hr />
                <Button
                  variant="contained"
                  onClick={() => navigate('/catalog')}
                >
                  Shop Now
                </Button>
              </div>
            </>
          )}
        </div>
      ))}
    </Box>
  );
};

export default Sales;
