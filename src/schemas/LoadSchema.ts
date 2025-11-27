import * as yup from 'yup';

export const LoadSchema = yup.object().shape({
  description: yup.string().required('Description is required'),
  weight: yup
    .number()
    .typeError('Weight must be a number')
    .positive('Must be positive')
    .required('Weight is required'),
  originAddress: yup.string().required('Origin is required'),
  destinationAddress: yup.string().required('Destination is required'),
  truckId: yup.string().required('You must select a truck'),
  driverId: yup.string().nullable(),
});
