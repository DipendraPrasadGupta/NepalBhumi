import { useAuthStore } from '../store.js';

export const useAuth = () => {
  return useAuthStore();
};

export const useIsAuthenticated = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  return !!accessToken;
};

export const useIsAdmin = () => {
  const user = useAuthStore((state) => state.user);
  return user?.role === 'admin';
};

export const useIsAgent = () => {
  const user = useAuthStore((state) => state.user);
  return user?.role === 'agent';
};
