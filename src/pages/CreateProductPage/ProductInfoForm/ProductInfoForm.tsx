import React from 'react';
import { Grid, TextField } from '@mui/material';
import { IProductCreate } from 'interfaces/ProductInterface';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { SectionTitle } from 'theme/common';

interface ProductInfoFormProps {
  register: UseFormRegister<IProductCreate>;
  errors: FieldErrors;
}

const ProductInfoForm: React.FC<ProductInfoFormProps> = ({
  register,
  errors,
}) => {
  return (
    <>
      <SectionTitle variant="h3" sx={{ mb: '1.5rem', textAlign: 'center' }}>
        Product information
      </SectionTitle>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        justifyContent="center"
        sx={{
          mb: 4,
        }}
      >
        {[
          { name: 'title', label: 'Title' },
          { name: 'brand', label: 'Brand' },
          { name: 'price', label: 'Price' },
          { name: 'discountPercentage', label: 'Discount Percentage' },
          { name: 'rating', label: 'Rating' },
          { name: 'stock', label: 'Stock' },
        ].map(({ name, label }) => (
          <Grid item xxs={12} md={6} key={name}>
            <TextField
              {...register(name as keyof IProductCreate)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id={name}
              label={label}
              name={name}
              type="text"
              autoComplete={'off'}
              error={!!errors[name as keyof IProductCreate]}
              helperText={
                errors?.[name as keyof IProductCreate]?.message as string
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default ProductInfoForm;
