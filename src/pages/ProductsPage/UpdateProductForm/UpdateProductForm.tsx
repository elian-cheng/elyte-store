import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { SubmitHandler, useForm, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Colors from 'theme/colors';
import { updateProductFormSchema } from 'utils/validation/products';
import Loader from 'components/Loader/Loader';
import { IProduct, IProductUpdate } from 'interfaces/ProductInterface';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import useUpdateProduct from 'hooks/useUpdateProduct';
import useGetProduct from 'hooks/useGetProduct';
import { CATEGORIES, COLORS } from 'utils/constants';

interface IProductUpdateProps {
  handleModal: () => void;
  editedProductId: string;
}

const UpdateProductForm: FC<IProductUpdateProps> = ({
  handleModal,
  editedProductId,
}) => {
  const {
    data: product = {} as IProduct,
    isLoading,
    isError,
  } = useGetProduct(editedProductId);
  const updateProductMutation = useUpdateProduct();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IProductUpdate>({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      brand: '',
      images: [],
      colors: [],
      price: '0',
      discountPercentage: '0',
      rating: '0',
      stock: '0',
      isActive: true,
    },
    mode: 'onBlur',
    resolver: yupResolver(updateProductFormSchema) as Resolver<IProductUpdate>,
    shouldUseNativeValidation: false,
  });

  useEffect(() => {
    if (!isLoading && !isError && product) {
      reset({
        title: product.title || '',
        description: product.description || '',
        category: product.category || '',
        brand: product.brand || '',
        images: product.images || [],
        colors: product.colors || [],
        price: product.price || '0',
        discountPercentage: product.discountPercentage || '0',
        rating: product.rating || '0',
        stock: product.stock || '0',
        isActive: product.isActive || true,
      });
      setSelectedCategory(product.category || '');
      setSelectedColors(product.colors || []);
    }
  }, [product, isLoading, isError, reset]);

  const handleColorChange = (color: string) => {
    const index = selectedColors.indexOf(color);
    if (index === -1) {
      setSelectedColors([...selectedColors, color]);
    } else {
      const updatedColors = [...selectedColors];
      updatedColors.splice(index, 1);
      setSelectedColors(updatedColors);
    }
  };

  const isColorSelected = (color: string) => selectedColors.includes(color);

  const onSubmit: SubmitHandler<IProductUpdate> = async (data) => {
    const category = data.category.toLowerCase();
    const brand =
      data.brand.charAt(0).toUpperCase() + data.brand.slice(1).toLowerCase();
    const price = +data.price;
    const discountPercentage = +data.discountPercentage;
    const rating = +data.rating;
    const stock = +data.stock;

    const postData = {
      ...data,
      category,
      brand,
      price,
      discountPercentage,
      rating,
      stock,
      colors: selectedColors,
    };

    if (!editedProductId) return;

    await updateProductMutation.mutateAsync({
      id: editedProductId,
      body: postData,
    });

    handleModal();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        p: '2rem 2rem 3rem',
        borderRadius: '6px',
        width: '100%',
        backgroundColor: Colors.WHITE,
        maxHeight: '90vh',
        overflowY: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          mb: '1rem',
        }}
      >
        <Typography component="h2" variant="h4" sx={{ mt: '.5rem' }}>
          Edit product
        </Typography>
      </Box>
      {isLoading && editedProductId ? (
        <Loader />
      ) : (
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          {[
            { name: 'title', label: 'Title' },
            { name: 'brand', label: 'Brand' },
            { name: 'price', label: 'Price' },
            { name: 'discountPercentage', label: 'Discount Percentage' },
            { name: 'rating', label: 'Rating' },
            { name: 'stock', label: 'Stock' },
          ].map(({ name, label }) => (
            <TextField
              {...register(name as keyof IProductUpdate)}
              key={name}
              variant="outlined"
              margin="normal"
              required={name !== 'discountPercentage' && name !== 'rating'}
              fullWidth
              id={name}
              label={label}
              name={name}
              type="text"
              autoComplete={name}
              error={!!errors[name as keyof IProductUpdate]}
              helperText={
                errors?.[name as keyof IProductUpdate]?.message as string
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          ))}
          <TextField
            select
            fullWidth
            required
            {...register('category')}
            id={'category'}
            label={'Category'}
            name={'category'}
            defaultValue=""
            value={selectedCategory}
            variant="outlined"
            margin="normal"
            error={!!errors['category']}
            helperText={errors?.['category']?.message as string}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {CATEGORIES.map((category) => (
              <MenuItem value={category} key={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            {...register('description')}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            multiline
            // minRows={2}
            // maxRows={5}
            id={'description'}
            label={'Description'}
            name={'description'}
            type="text"
            autoComplete={'description'}
            error={!!errors['description']}
            helperText={errors?.['description']?.message as string}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl sx={{ mt: 2, mb: 1 }}>
            <FormLabel
              id="type-checkbox-group-label"
              sx={{ fontWeight: 500, color: Colors.PRIMARY_MAIN }}
            >
              Colors
            </FormLabel>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xxs: 1, md: 2 }}
              justifyContent="flex-start"
            >
              {COLORS.map((color) => (
                <Grid item xxs={6} sm={4} key={color}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isColorSelected(color)}
                        onChange={() => handleColorChange(color)}
                      />
                    }
                    label={color}
                  />
                </Grid>
              ))}
            </Grid>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                {...register('isActive')}
                icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                checkedIcon={<CheckBoxIcon fontSize="large" />}
                color="primary"
                defaultChecked={product?.isActive}
              />
            }
            label={'Is Active'}
            labelPlacement="end"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: '2rem',
              py: '0.8rem',
              color: 'white',
            }}
          >
            Save
          </Button>
        </form>
      )}
    </Box>
  );
};

export default UpdateProductForm;
