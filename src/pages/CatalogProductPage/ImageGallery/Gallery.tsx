import React, { useState, useEffect, FC } from 'react';
import Box from '@mui/material/Box';
import styled from '@mui/system/styled';
import BackdropGallery from './BackdropGallery';

interface IGalleryProps {
  images: string[];
}

const GalleryWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  flex: '0 1 40%',
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const Image = styled('div')(({ theme }) => ({
  objectFit: 'cover',
  marginBottom: theme.spacing(2),
  width: '100%',
  '& img': {
    objectFit: 'contain',
    height: '350px',
    width: '400px',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  [theme.breakpoints.down('lg')]: {
    '& img': {
      height: '300px',
    },
  },
}));

const Thumbnails = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const ImgHolder = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '90px',
  width: '90px',
  [theme.breakpoints.down('md')]: {
    height: '75px',
    width: '75px',
  },
}));

const Outlay = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '0',
  left: '0',
  height: '100%',
  width: '100%',
  zIndex: '2',
  border: '3px solid var(--orange)',
  borderRadius: '10px',
  backgroundColor: '#e3dfdfab',
  '&.activated': {
    position: 'absolute',
    top: '0',
    left: '0',
    height: '100%',
    width: '100%',
    zIndex: '2',
    border: `3px solid ${theme.palette.secondary.main}`,
    borderRadius: '10px',
    backgroundColor: '#e3dfdfab',
  },
}));

const StyledImg = styled('img')(({ theme }) => ({
  height: '90px',
  width: '90px',
  borderRadius: '10px',
  cursor: 'pointer',
  [theme.breakpoints.down('md')]: {
    height: '75px',
    width: '75px',
  },
}));

const Gallery: FC<IGalleryProps> = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(images[0]);
  const [currentPassedImage, setCurrentPassedImage] = useState(images[0]);
  const [open, setOpen] = useState(false);

  const handleClick = (index: number) => {
    setCurrentImage(images[index]);
  };

  const handleToggle = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const removeActivatedClass = (parent: HTMLElement) => {
    parent.childNodes.forEach((node: ChildNode) => {
      const childElement = node.firstChild as HTMLElement;
      childElement.classList.contains('activated') &&
        childElement.classList.remove('activated');
    });
  };

  useEffect(() => {
    setCurrentPassedImage(currentImage);
  }, [currentImage]);

  return (
    <GalleryWrapper>
      <div>
        <Image>
          <img src={currentImage} alt="product-1" onClick={handleToggle} />
        </Image>
        {open && (
          <BackdropGallery
            images={images}
            handleClose={handleClose}
            open={open}
            currentPassedImage={currentPassedImage}
          />
        )}
        <Thumbnails>
          {images.map((image, index) => (
            <ImgHolder
              key={index}
              onClick={(e) => {
                handleClick(index);
                const parentElement = e.currentTarget.parentNode as HTMLElement;
                removeActivatedClass(parentElement);
                const childElement = e.currentTarget
                  .childNodes[0] as HTMLElement;
                childElement.classList.toggle('activated');
              }}
            >
              <Outlay className={`${index === 0 && 'activated'}`}></Outlay>
              <StyledImg src={image} alt={`product-${index + 1}`} />
            </ImgHolder>
          ))}
        </Thumbnails>
      </div>
    </GalleryWrapper>
  );
};

export default Gallery;
