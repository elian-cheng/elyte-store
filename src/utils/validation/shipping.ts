import * as yup from 'yup';
import { State } from 'country-state-city';

export const shippingSchema = yup.object().shape({
  name: yup.string().required('Receiver name is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  country: yup.string().required('Country is required'),
  zip: yup
    .string()
    .required('Zip Code is required')
    .matches(/^\d{5}(?:-?\d{4})?$/, 'Zip Code is not valid'),
  phone: yup
    .string()
    .required('Phone Number is required')
    .matches(
      /^[0-9]{10,12}$/,
      'Phone Number must be between 10 to 12 digits long'
    ),
  state: yup
    .string()
    .trim()
    .ensure()
    .test((value, context) => {
      const { country } = context.parent;
      if (country && State.getStatesOfCountry(country).length > 0) {
        return yup.string().required('State is required').isValidSync(value);
      }
      return true;
    }),
});
