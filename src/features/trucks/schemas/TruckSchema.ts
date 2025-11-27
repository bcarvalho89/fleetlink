import * as yup from 'yup';

import { TruckStatus } from '../types/Truck';

export const TruckSchema = yup.object().shape({
  plate: yup.string().required('License plate is required'),
  model: yup.string().required('Model is required'),
  capacity: yup
    .number()
    .typeError('Capacity must be a number')
    .positive('Must be positive')
    .required('Capacity is required'),
  year: yup
    .number()
    .typeError('Year must be a number')
    .min(1990, 'Year too old')
    .max(new Date().getFullYear() + 1, 'Invalid year')
    .required('Year is required'),
  status: yup
    .mixed<TruckStatus>()
    .oneOf(Object.values(TruckStatus))
    .default(TruckStatus.ACTIVE),
  docUrl: yup.string().url('Invalid URL').default(''),
  driverId: yup.string().nullable(),
});
