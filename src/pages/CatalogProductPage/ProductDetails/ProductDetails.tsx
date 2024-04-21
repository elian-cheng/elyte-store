import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Collapse,
  Rating,
  darken,
} from '@mui/material';
import {
  CheckCircleOutline,
  ErrorOutline,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { IProduct } from 'interfaces/ProductInterface';
import Colors from 'theme/colors';
import { useAppDispatch } from 'hooks/redux';
import { addItemToCart } from 'store/redux/cartSlice';
import { Add, Remove } from '@mui/icons-material';
import toast from 'react-hot-toast';

const setProductAvailability = (
  stock: number
): { status: string; icon: JSX.Element } => {
  if (stock > 0) {
    return {
      status: `In stock (${stock})`,
      icon: <CheckCircleOutline color="success" />,
    };
  } else {
    return {
      status: 'Out of stock',
      icon: <ErrorOutline color="error" />,
    };
  }
};

const ProductDetails: React.FC<{ product: IProduct }> = ({ product }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();

  const { title, price, _id, images, discountPrice } = product;

  const SHORT_DESCRIPTION_LENGTH = 200;

  const shortDescription =
    product.description.slice(0, SHORT_DESCRIPTION_LENGTH) + '...';

  const toggleDescriptionHandler = () => {
    setIsExpanded(!isExpanded);
  };

  const availabilityInfo = setProductAvailability(product.stock);

  const addToCartHandler = () => {
    dispatch(
      addItemToCart({
        id: _id,
        title,
        price: discountPrice || price,
        image: images[0],
        quantity,
      })
    );
    toast.success('Item added to cart');
  };

  const increaseQuantityHandler = () => {
    if (product.stock <= quantity) return;

    const qty = quantity + 1;
    setQuantity(qty);
  };

  const decreaseQuantityHandler = () => {
    if (1 >= quantity) return;

    const qty = quantity - 1;
    setQuantity(qty);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: { xxs: 1, md: 2 },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Rating value={product.rating} readOnly max={5} precision={0.5} />
        <Typography variant="body2">({product.rating})</Typography>
      </Box>
      <Typography variant="h6">{product.title}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h5">
          ${product.discountPrice.toFixed(2)}
        </Typography>
        {product.discountPercentage > 0 && (
          <>
            <Typography variant="body1" sx={{ textDecoration: 'line-through' }}>
              ${product.price.toFixed(2)}
            </Typography>
            <span
              style={{
                backgroundColor: Colors.PRIMARY_MAIN,
                padding: '0 0.3rem',
                color: Colors.WHITE,
              }}
            >
              -{product.discountPercentage.toFixed(0)}%
            </span>
          </>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {availabilityInfo.icon}
        <Typography variant="body1" sx={{ ml: 1 }}>
          {availabilityInfo.status}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2">Color:</Typography>
        {product.colors.map((color) => (
          <Chip
            key={color}
            label={color}
            sx={{
              backgroundColor: color,
              color: color === 'white' ? 'black' : 'white',
              border: `1px solid ${color === 'white' ? 'black' : 'white'}`,
            }}
          />
        ))}
      </Box>
      {/* <Typography variant="body2">
        Brand: <strong>{product.brand}</strong>
      </Typography> */}
      {/* <Typography variant="body2">
        Category:{' '}
        <strong>
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </strong>
      </Typography> */}
      <Box
        sx={{
          display: 'flex',
          // justifyContent: 'center',
          alignItems: 'center',
          gap: 1,
          mt: 2,
        }}
      >
        <IconButton
          size="small"
          onClick={increaseQuantityHandler}
          sx={{
            bgcolor: Colors.SECONDARY_MAIN,
            '&:hover': {
              bgcolor: darken(Colors.SECONDARY_MAIN, 0.1),
            },
          }}
        >
          <Add fontSize="small" />
        </IconButton>
        <Typography variant="body1" sx={{ fontWeight: 700 }}>
          {quantity}
        </Typography>
        <IconButton
          size="small"
          onClick={decreaseQuantityHandler}
          disabled={quantity <= 1}
          sx={{
            bgcolor: Colors.SECONDARY_MAIN,
            '&:hover': {
              bgcolor: darken(Colors.SECONDARY_MAIN, 0.1),
            },
          }}
        >
          <Remove fontSize="small" />
        </IconButton>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={addToCartHandler}
            disabled={product.stock <= 0}
          >
            Add to Cart
          </Button>
          {/* <Button variant="contained" color="secondary">
          Buy Now
        </Button> */}
        </Box>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          Description:
        </Typography>

        {/* Only show the short description when not expanded */}
        {!isExpanded && (
          <Typography variant="body2">{shortDescription}</Typography>
        )}

        {/* Only show the full description when expanded */}
        <Collapse in={isExpanded}>
          <Typography variant="body2">{product.description}</Typography>
        </Collapse>

        <Button
          variant="text"
          onClick={toggleDescriptionHandler}
          endIcon={isExpanded ? <ExpandLess /> : <ExpandMore />}
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </Button>
      </Box>
    </Box>
  );
};

export default ProductDetails;
