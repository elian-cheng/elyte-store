import React, { FC, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAppDispatch } from 'hooks/redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { Country, State } from 'country-state-city';

import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
  MenuItem,
} from '@mui/material';
import {
  PinDrop as PinDropIcon,
  Home as HomeIcon,
  LocationCity as LocationCityIcon,
  Public as PublicIcon,
  Phone as PhoneIcon,
  TransferWithinAStation as TransferWithinAStationIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';
import { shippingSchema } from 'utils/validation/shipping';
import useGetUserProfile from 'hooks/useGetUserProfile';
import { getUserId } from 'utils/helpers';
import useUpdateUserProfile from 'hooks/useUpdateUserProfile';
import { setShippingInfo } from 'store/redux/cartSlice';

export interface IFormData {
  address: string;
  city: string;
  country: string;
  state: string;
  zip: string;
  phone: string;
  name: string;
}

interface IShippingFormProps {
  onNext: () => void;
}

const ShippingForm: FC<IShippingFormProps> = ({ onNext }) => {
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const userId = getUserId();
  const { data: currentUser, isLoading, isError } = useGetUserProfile(userId);
  const updateUserMutation = useUpdateUserProfile();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormData>({
    mode: 'onBlur',
    resolver: yupResolver(shippingSchema),
    defaultValues: {
      address: '',
      city: '',
      country: '',
      state: '',
      zip: '',
      phone: '',
      name: '',
    },
  });
  useEffect(() => {
    if (!isLoading && !isError && currentUser) {
      reset({
        address: currentUser?.shippingInfo?.address || '',
        city: currentUser?.shippingInfo?.city || '',
        zip: currentUser?.shippingInfo?.zip || '',
        country: currentUser?.shippingInfo?.country || '',
        state: currentUser?.shippingInfo?.state || '',
        phone: currentUser?.phone || '',
        name: currentUser?.name || '',
      });
      setCountry(currentUser?.shippingInfo?.country || '');
      setState(currentUser?.shippingInfo?.state || '');
    }
  }, [currentUser, isLoading, isError, reset]);

  const onSubmit: SubmitHandler<IFormData> = async (data) => {
    if (!userId) return;
    const updateUserData = {
      id: userId,
      name: data.name,
      phone: data.phone,
      shippingInfo: {
        address: data.address,
        city: data.city,
        country: data.country,
        state: data?.state || '',
        zip: data.zip,
      },
    };
    const userData = {
      ...updateUserData,
      email: currentUser?.email || '',
    };
    if (
      !currentUser?.shippingInfo ||
      !currentUser?.phone ||
      !currentUser?.name
    ) {
      await updateUserMutation.mutateAsync({
        id: userId,
        body: updateUserData,
      });
    }

    dispatch(setShippingInfo(userData));

    onNext();
  };

  const formFields = [
    {
      name: 'name',
      label: 'Full Name',
      icon: <BadgeIcon />,
    },
    {
      name: 'address',
      label: 'Address',
      icon: <HomeIcon />,
    },
    {
      name: 'city',
      label: 'City',
      icon: <LocationCityIcon />,
    },
    {
      name: 'zip',
      label: 'Zip Code',
      icon: <PinDropIcon />,
    },
    {
      name: 'phone',
      label: 'Phone Number',
      icon: <PhoneIcon />,
    },
  ];

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          m: '3rem auto',
          p: '1rem',
          borderRadius: '6px',
          width: '95%',
          maxWidth: '35rem',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
          backgroundColor: '#fff',
        }}
      >
        <Typography component="h2" variant="h4" sx={{ my: '.5rem' }}>
          Shipping Details
        </Typography>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          {formFields.map((field) => (
            <TextField
              key={field.name}
              {...register(field.name as keyof IFormData)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label={field.label}
              autoComplete={field.name}
              error={!!errors[field.name as keyof IFormData]}
              helperText={errors?.[field.name as keyof IFormData]?.message}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">{field.icon}</InputAdornment>
                ),
              }}
            />
          ))}
          <TextField
            select
            fullWidth
            required
            {...register('country')}
            id={'country'}
            label={'Country'}
            name={'country'}
            defaultValue=""
            value={country}
            variant="outlined"
            margin="normal"
            error={!!errors?.country}
            helperText={errors?.['country']?.message as string}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PublicIcon />
                </InputAdornment>
              ),
            }}
            onChange={(e) => {
              setCountry(e.target.value);
              setState('');
            }}
            sx={{ mb: 2 }}
          >
            {Country.getAllCountries().map((item) => (
              <MenuItem key={item.isoCode} value={item.isoCode}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
          {country && State.getStatesOfCountry(country).length > 0 && (
            <TextField
              select
              fullWidth
              required
              {...register('state')}
              id={'state'}
              label={'State'}
              name={'state'}
              defaultValue=""
              value={state}
              variant="outlined"
              margin="normal"
              error={!!errors?.state}
              helperText={errors?.['state']?.message as string}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TransferWithinAStationIcon />
                  </InputAdornment>
                ),
              }}
              onChange={(e) => setState(e.target.value)}
              sx={{ mb: 2 }}
            >
              {State.getStatesOfCountry(country).map((item) => (
                <MenuItem key={item.isoCode} value={item.isoCode}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            // disabled={
            //   country && State.getStatesOfCountry(country).length > 0 && !state
            // }
            sx={{ py: '.8rem' }}
          >
            Continue
          </Button>
        </form>
      </Box>
    </>
  );
};

export default ShippingForm;
