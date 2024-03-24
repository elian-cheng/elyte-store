import React, { useState } from 'react';
import {
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
} from '@mui/material';
import { IUserMutation } from 'interfaces/UserInterface';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { SectionTitle } from 'theme/common';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { ROLES } from 'utils/constants';

interface SecurityInfoFormProps {
  register: UseFormRegister<IUserMutation>;
  errors: FieldErrors;
  role: string;
  setRole: React.Dispatch<React.SetStateAction<string>>;
}

const SecurityInfoForm: React.FC<SecurityInfoFormProps> = ({
  register,
  errors,
  role,
  setRole,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const showPasswordHandler = () => setShowPassword((show) => !show);

  const passwordMouseDownHandler = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <>
      <SectionTitle variant="h3" sx={{ mb: '1.5rem', textAlign: 'center' }}>
        Security information
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
        <Grid item xxs={12} md={6}>
          <TextField
            {...register('password')}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label={'Password'}
            id="password"
            autoComplete="new-password"
            type={showPassword ? 'text' : 'password'}
            error={!!errors?.password}
            helperText={errors?.['password']?.message as string}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={showPasswordHandler}
                    onMouseDown={passwordMouseDownHandler}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xxs={12} md={6}>
          <TextField
            select
            fullWidth
            required
            {...register('role')}
            id={'role'}
            label={'Role'}
            name={'role'}
            defaultValue=""
            value={role}
            variant="outlined"
            margin="normal"
            error={!!errors?.role}
            helperText={errors?.['role']?.message as string}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => setRole(e.target.value)}
          >
            {ROLES.map((availableRole) => (
              <MenuItem value={availableRole} key={availableRole}>
                {availableRole}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </>
  );
};

export default SecurityInfoForm;
