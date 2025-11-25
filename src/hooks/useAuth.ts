import { useAuthStore } from '../store/auth';

export const useAuth = () => {
  return useAuthStore(state => state.isAuthenticated);
};
