import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  return useAuthStore(state => state.isAuthenticated);
};
