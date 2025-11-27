import LoadingIndicator from '@/components/common/LoadingIndicator';
import { lazyLoad } from '@/lib/loadable';

export const LoginPage = lazyLoad(
  () => import('./LoginPage'),
  module => module.default,
  {
    fallback: <LoadingIndicator />,
  },
);
