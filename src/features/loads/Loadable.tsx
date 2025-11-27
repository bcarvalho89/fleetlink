import LoadingIndicator from '@/components/common/LoadingIndicator';
import { lazyLoad } from '@/lib/loadable';

export const LoadsPage = lazyLoad(
  () => import('./LoadsPage'),
  module => module.default,
  {
    fallback: <LoadingIndicator />,
  },
);
