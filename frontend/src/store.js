import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isLoading: false,
  error: null,

  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    set({ user });
  },
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    set({ accessToken, refreshToken });
  },
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({ user: null, accessToken: null, refreshToken: null });
  },
}));

export const usePropertyStore = create((set) => ({
  properties: [],
  selectedProperty: null,
  filters: {
    type: '',
    purpose: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    search: '',
  },
  isLoading: false,

  setProperties: (properties) => set({ properties }),
  setSelectedProperty: (property) => set({ selectedProperty: property }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  setLoading: (isLoading) => set({ isLoading }),
}));

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  theme: localStorage.getItem('theme') || 'light',

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  },
}));
