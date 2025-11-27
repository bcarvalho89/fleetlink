import LoadingIndicator from '@/components/common/LoadingIndicator';
import { lazyLoad } from '@/lib/loadable';

export const DriversPage = lazyLoad(
  () => import('./DriversPage'),
  module => module.default,
  {
    fallback: <LoadingIndicator />,
  },
);
