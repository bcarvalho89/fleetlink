import LoadingIndicator from '@/components/common/LoadingIndicator';
import { lazyLoad } from '@/lib/loadable';

export const NotFoundPage = lazyLoad(
  () => import('./NotFoundPage'),
  module => module.default,
  {
    fallback: <LoadingIndicator />,
  },
);
