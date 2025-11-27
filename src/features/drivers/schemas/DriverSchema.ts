import * as yup from 'yup';

export const DriverSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  phone: yup.string().required('Phone is required'),
  cnh: yup.string().required('Driver License (CNH) is required'),
  truckId: yup.string().nullable(),
});
