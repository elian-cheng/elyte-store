import React, { useState, useEffect, FC } from 'react';
import { Backdrop, Box, IconButton, styled } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import PreviousIcon from '@mui/icons-material/ChevronLeft';
import NextIcon from '@mui/icons-material/ChevronRight';

interface IBackdropGalleryProps {
  images: string[];
  open: boolean;
  handleClose: () => void;
  currentPassedImage: string;
}

const BackdropContent = styled(Box)(({ theme }) => ({
  width: '500px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  zIndex: 4,
  gap: theme.spacing(1),
  [theme.breakpoints.down('md')]: {
    width: '80vw',
  },
}));

const BackdropImage = styled('img')({
  height: '415px',
  borderRadius: '10px',
  cursor: 'auto',
  width: '100%',
  objectFit: 'contain',
});

const Thumbnails = styled('div')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const ImgHolderBackdrop = styled('div')({
  height: '75px',
  width: '75px',
  position: 'relative',
  objectFit: 'cover',
});

const Outlay = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '0',
  left: '0',
  height: '100%',
  width: '100%',
  zIndex: '5',
  border: '3px solid var(--orange)',
  borderRadius: '10px',
  backgroundColor: '#e3dfdfab',
  '&.activated': {
    position: 'absolute',
    top: '0',
    left: '0',
    height: '100%',
    width: '100%',
    zIndex: '5',
    border: `3px solid ${theme.palette.secondary.main}`,
    borderRadius: '10px',
    backgroundColor: '#e3dfdfab',
  },
}));

const StyledImg = styled('img')({
  height: '75px',
  width: '75px',
  borderRadius: '10px',
  cursor: 'pointer',
});

const BackdropGallery: FC<IBackdropGalleryProps> = ({
  images,
  open,
  handleClose,
  currentPassedImage,
}) => {
  const [backdropImage, setBackdropImage] = useState(currentPassedImage);
  const [currentPassedImageIndex, setCurrentPassedImageIndex] = useState(1);

  useEffect(() => {
    setBackdropImage(currentPassedImage);
    images.forEach((img, index) => {
      img === currentPassedImage && setCurrentPassedImageIndex(index);
    });
  }, [currentPassedImage, images]);

  const handleClick = (index = 0) => {
    setBackdropImage(images[index]);
    setCurrentPassedImageIndex(index);
  };

  const handleIncrement = () => {
    if (currentPassedImageIndex === images.length - 1) {
      setBackdropImage(images[0]);
      setCurrentPassedImageIndex(0);
    } else {
      setBackdropImage(images[currentPassedImageIndex + 1]);
      setCurrentPassedImageIndex(currentPassedImageIndex + 1);
    }
  };

  const handleDecrement = () => {
    if (currentPassedImageIndex === 0) {
      setBackdropImage(images[images.length - 1]);
      setCurrentPassedImageIndex(images.length - 1);
    } else {
      setBackdropImage(images[currentPassedImageIndex - 1]);
      setCurrentPassedImageIndex(currentPassedImageIndex - 1);
    }
  };

  const removeActivatedClass = (parent: HTMLElement) => {
    parent.childNodes.forEach((node: ChildNode) => {
      const childElement = node.firstChild as HTMLElement;
      childElement.classList.contains('activated') &&
        childElement.classList.remove('activated');
    });
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLElement>) => {
    // Check if the click occurred on the backdrop and not on the content
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <Backdrop
      className="backdrop"
      sx={{
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 3,
      }}
      open={open}
      onClick={handleBackdropClick}
    >
      <BackdropContent className="backdrop-content">
        <IconButton
          onClick={handleClose}
          sx={{ color: '#fff', bgcolor: 'transparent', alignSelf: 'flex-end' }}
        >
          <CloseIcon color="secondary" fontSize="medium" />
        </IconButton>
        <Box className="image">
          <IconButton
            className="icon-button-prev"
            disableRipple
            onClick={() => {
              handleDecrement();
              removeActivatedClass(
                document.querySelector('.thumbnails') as HTMLElement
              );
            }}
            sx={{
              position: 'absolute',
              left: '50px',
              top: '50%',
              transform: 'translateY(-50%)',
              height: '42px',
              width: '42px',
              bgcolor: '#fff',
            }}
          >
            <PreviousIcon />
          </IconButton>
          <IconButton
            className="icon-button-next"
            disableRipple
            onClick={() => {
              handleIncrement();
              removeActivatedClass(
                document.querySelector('.thumbnails') as HTMLElement
              );
            }}
            sx={{
              position: 'absolute',
              right: '50px',
              top: '50%',
              transform: 'translateY(-50%)',
              height: '42px',
              width: '42px',
              bgcolor: '#fff',
            }}
          >
            <NextIcon />
          </IconButton>
          <BackdropImage src={backdropImage} alt="selected-product" />
        </Box>
        <Thumbnails className="thumbnails">
          {images.map((thumb, index) => (
            <ImgHolderBackdrop
              key={index}
              onClick={(e) => {
                handleClick(index);
                removeActivatedClass(e.currentTarget.parentNode as HTMLElement);
                const childElement = e.currentTarget
                  .childNodes[0] as HTMLElement;
                childElement.classList.toggle('activated');
              }}
            >
              <Outlay
                className={`${
                  index === currentPassedImageIndex ? 'activated' : ''
                }`}
              />
              <StyledImg src={thumb} alt={`product-${index + 1}`} />
            </ImgHolderBackdrop>
          ))}
        </Thumbnails>
      </BackdropContent>
    </Backdrop>
  );
};

export default BackdropGallery;
