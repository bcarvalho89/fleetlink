import LoadingIndicator from '@/components/common/LoadingIndicator';
import { lazyLoad } from '@/lib/loadable';

export const TrucksPage = lazyLoad(
  () => import('./TrucksPage'),
  module => module.default,
  {
    fallback: <LoadingIndicator />,
  },
);
