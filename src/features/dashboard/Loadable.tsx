import LoadingIndicator from '@/components/common/LoadingIndicator';
import { lazyLoad } from '@/lib/loadable';

export const DashboardPage = lazyLoad(
  () => import('./DashboardPage'),
  module => module.default,
  {
    fallback: <LoadingIndicator />,
  },
);
