import {
  Box,
  Button,
  Divider,
  useTheme,
  TextField,
  Grid,
  FormControl,
  FormLabel,
  FormControlLabel,
  Checkbox,
  MenuItem,
} from '@mui/material';
import { IProductCreate } from 'interfaces/ProductInterface';
import { Resolver, SubmitHandler, useForm } from 'react-hook-form';
import { createProductFormSchema } from 'utils/validation/products';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import ProductInfoForm from '../ProductInfoForm/ProductInfoForm';
import { useNavigate } from 'react-router-dom';
import useCreateProduct from 'hooks/useCreateProduct';
import toast from 'react-hot-toast';
import useUploadImage from 'hooks/useUploadImage';
import { useQueryClient } from '@tanstack/react-query';
import { CATEGORIES, COLORS, cacheKeys } from 'utils/constants';
import ImageDropzoneMulti from 'components/ImageDropzone/ImageDropzoneMulti';
import { SectionTitle } from 'theme/common';
import Colors from 'theme/colors';

const CreateProductForm = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const createProductMutation = useCreateProduct();
  const uploadImageHandler = useUploadImage();
  const queryClient = useQueryClient();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<IProductCreate>({
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
    },
    mode: 'onBlur',
    resolver: yupResolver(createProductFormSchema) as Resolver<IProductCreate>,
    shouldUseNativeValidation: false,
  });

  const removeFilesHandler = () => {
    setSelectedFiles(null);
  };

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

  const onSubmit: SubmitHandler<IProductCreate> = async (
    data: IProductCreate
  ) => {
    if (!selectedFiles) {
      toast.error('Please upload at least one product image');
      return;
    }
    if (selectedFiles.length > 4) {
      toast.error('You can upload up to 4 images.');
      return;
    }

    const uploadedImages = [] as string[];

    if (selectedFiles) {
      for (const file of selectedFiles) {
        const image = await uploadImageHandler(file);
        if (!image) {
          toast.error('Error uploading image');
          return;
        }
        uploadedImages.push(image);
      }
    }
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
      images: uploadedImages,
    };

    await createProductMutation.mutateAsync(postData);
    void queryClient.invalidateQueries({
      queryKey: cacheKeys.products(),
    });
    reset();
    navigate('/products');
  };

  return (
    <Box
      sx={{
        width: '70%',
        margin: 'auto',
        [theme.breakpoints.down('lg')]: {
          width: '80%',
        },
      }}
    >
      <Box>
        <form noValidate onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <ProductInfoForm register={register} errors={errors} />
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
                <Grid item xxs={6} sm={4} md={3} lg={1.5} key={color}>
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
          <Divider
            orientation={'horizontal'}
            sx={{
              marginTop: 6,
              marginBottom: 3,
            }}
          />
          <SectionTitle variant="h3" sx={{ mb: '1.5rem', textAlign: 'center' }}>
            Product Images
          </SectionTitle>
          <ImageDropzoneMulti
            onSelectFiles={setSelectedFiles}
            selectedFiles={selectedFiles}
          />
          {selectedFiles && (
            <Button
              onClick={removeFilesHandler}
              variant="outlined"
              sx={{
                mt: 2,
                mx: 'auto',
                display: 'block',
                textAlign: 'center',
              }}
            >
              Remove
            </Button>
          )}
          <Divider
            orientation={'horizontal'}
            sx={{
              mt: 5,
              mb: 3,
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: '1rem',
              py: '0.8rem',
              color: 'white',
            }}
          >
            Create Product
          </Button>
        </form>
      </Box>
    </Box>
  );
};
export default CreateProductForm;
