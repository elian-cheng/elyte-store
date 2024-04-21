import { IconButton, styled, useTheme } from '@mui/material';
import React, { FC, useState } from 'react';
import PreviousIcon from '@mui/icons-material/ChevronLeft';
import NextIcon from '@mui/icons-material/ChevronRight';

const MobileGalleryWrapper = styled('section')(({ theme }) => ({
  position: 'relative',
  width: '70%',
  [theme.breakpoints.down('sml')]: {
    width: '100%',
  },
}));

const MobileGalleryImage = styled('img')({
  width: '100%',
  maxHeight: '30%',
  aspectRatio: '1',
});

const MobileGalleryButton = styled(IconButton)({
  position: 'absolute',
});

const MobileGalleryPrevButton = styled(MobileGalleryButton)({
  left: '15px',
  top: '10%',
  transform: 'translateY(-50%)',
});

const MobileGalleryNextButton = styled(MobileGalleryButton)({
  right: '15px',
  top: '10%',
  transform: 'translateY(-50%)',
});

interface IMobileGalleryProps {
  images: string[];
}

const MobileGallery: FC<IMobileGalleryProps> = ({ images }) => {
  const [currentMobileImage, setCurrentMobileImage] = useState(images[0]);
  const [mobileImageIndex, setMobileImageIndex] = useState(1);

  const theme = useTheme();

  const handleIncrement = () => {
    if (mobileImageIndex === images.length - 1) {
      setCurrentMobileImage(images[0]);
      setMobileImageIndex(0);
    } else {
      setCurrentMobileImage(images[mobileImageIndex + 1]);
      setMobileImageIndex(mobileImageIndex + 1);
    }
  };

  const handleDecrement = () => {
    if (mobileImageIndex === 0) {
      setCurrentMobileImage(images[images.length - 1]);
      setMobileImageIndex(images.length - 1);
    } else {
      setCurrentMobileImage(images[mobileImageIndex - 1]);
      setMobileImageIndex(mobileImageIndex - 1);
    }
  };

  return (
    <MobileGalleryWrapper>
      <MobileGalleryPrevButton
        className="icon-button-prev"
        disableRipple
        onClick={handleDecrement}
        sx={{
          height: '42px',
          width: '42px',
          bgcolor: '#fff',
          border: `1px solid ${theme.palette.secondary.main}`,
        }}
      >
        <PreviousIcon />
      </MobileGalleryPrevButton>
      <MobileGalleryImage src={currentMobileImage} alt="featured-product" />
      <MobileGalleryNextButton
        className="icon-button-next"
        disableRipple
        onClick={handleIncrement}
        sx={{
          height: '42px',
          width: '42px',
          bgcolor: '#fff',
          border: `1px solid ${theme.palette.secondary.main}`,
        }}
      >
        <NextIcon />
      </MobileGalleryNextButton>
    </MobileGalleryWrapper>
  );
};

export default MobileGallery;
