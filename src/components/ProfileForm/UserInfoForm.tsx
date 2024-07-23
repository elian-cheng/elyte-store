import React, { useEffect, useState } from 'react';
import {
  Grid,
  InputAdornment,
  TextField,
  Typography,
  MenuItem,
} from '@mui/material';
import { IUserMutation } from 'interfaces/UserInterface';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { SectionTitle } from 'theme/common';
import { IUserProfileForm } from './ProfileForm';
import { Country, State } from 'country-state-city';
import {
  Public as PublicIcon,
  TransferWithinAStation as TransferWithinAStationIcon,
} from '@mui/icons-material';
import { IUserCreateForm } from 'pages/CreateUserPage/CreateUserForm/CreateUserForm';

interface UserInfoFormProps {
  register:
    | UseFormRegister<IUserProfileForm>
    | UseFormRegister<IUserCreateForm>;
  errors: FieldErrors;
  readonly?: boolean;
  currentCountry?: string;
  setCountry?: (value: string) => void;
  currentState?: string;
  setState?: (value: string) => void;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({
  register,
  errors,
  readonly = false,
  currentCountry,
  setCountry,
  currentState,
  setState,
}) => {
  const [country, setCountryInternal] = useState(currentCountry || '');
  const [state, setStateInternal] = useState(currentState || '');

  useEffect(() => {
    if (currentCountry) setCountryInternal(currentCountry);
    if (currentState) setStateInternal(currentState);
  }, [currentCountry, currentState]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedCountry = e.target.value;
    setCountryInternal(selectedCountry);
    setCountry && setCountry(selectedCountry);
    setStateInternal('');
    setState && setState('');
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedState = e.target.value;
    setStateInternal(selectedState);
    setState && setState(selectedState);
  };

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
          {
            name: 'address',
            label: 'Address',
          },
          {
            name: 'city',
            label: 'City',
          },
          {
            name: 'zip',
            label: 'Zip Code',
          },
        ].map(({ name, label }) => (
          <Grid item xxs={12} md={6} key={name}>
            <TextField
              {...register(name as keyof IUserProfileForm)}
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
        <Grid item xxs={12} md={6}>
          <TextField
            select
            fullWidth
            required
            {...register('country')}
            id={'country'}
            label={'Country'}
            name={'country'}
            value={country}
            variant="outlined"
            margin="normal"
            error={!!errors?.country}
            helperText={errors?.['country']?.message as string}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: readonly,
              startAdornment: (
                <InputAdornment position="start">
                  <PublicIcon />
                </InputAdornment>
              ),
            }}
            onChange={handleCountryChange}
            sx={{ mb: 2 }}
          >
            {Country.getAllCountries().map((item) => (
              <MenuItem key={item.isoCode} value={item.isoCode}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {country && State.getStatesOfCountry(country).length > 0 && (
          <Grid item xxs={12} md={6}>
            <TextField
              select
              fullWidth
              required
              {...register('state')}
              id={'state'}
              label={'State'}
              name={'state'}
              value={state}
              variant="outlined"
              margin="normal"
              error={!!errors?.state}
              helperText={errors?.['state']?.message as string}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                readOnly: readonly,
                startAdornment: (
                  <InputAdornment position="start">
                    <TransferWithinAStationIcon />
                  </InputAdornment>
                ),
              }}
              onChange={handleStateChange}
              sx={{ mb: 2 }}
            >
              {State.getStatesOfCountry(country).map((item) => (
                <MenuItem key={item.isoCode} value={item.isoCode}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default UserInfoForm;
