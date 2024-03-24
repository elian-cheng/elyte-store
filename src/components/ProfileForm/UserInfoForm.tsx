import React from 'react';
import { Grid, InputAdornment, TextField, Typography } from '@mui/material';
import { IUserMutation } from 'interfaces/UserInterface';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { SectionTitle } from 'theme/common';

interface UserInfoFormProps {
  register: UseFormRegister<IUserMutation>;
  errors: FieldErrors;
  readonly?: boolean;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({
  register,
  errors,
  readonly = false,
}) => {
  return (
    <>
      <SectionTitle variant="h3" sx={{ mb: '1.5rem', textAlign: 'center' }}>
        User information
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
          { name: 'name', label: 'Full Name' },
          { name: 'email', label: 'Email' },
          {
            name: 'phone',
            label: 'Phone',
          },
        ].map(({ name, label }) => (
          <Grid item xxs={12} md={6} key={name}>
            <TextField
              {...register(name as keyof IUserMutation)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id={name}
              label={label}
              name={name}
              type="text"
              autoComplete={'off'}
              error={!!errors[name as keyof IUserMutation]}
              helperText={
                errors?.[name as keyof IUserMutation]?.message as string
              }
              InputProps={{
                readOnly: readonly,
                startAdornment:
                  name === 'phone' ? (
                    <InputAdornment position="start">
                      <Typography component="span" variant="body1">
                        +
                      </Typography>
                    </InputAdornment>
                  ) : undefined,
              }}
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

export default UserInfoForm;
