import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '../types/k8s';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  hasPermission: (action: 'view' | 'create' | 'edit' | 'delete', namespace?: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      hasPermission: (action, namespace) => {
        const { user } = get();
        if (!user) return false;

        // Check namespace access if specified
        if (namespace && !user.namespaces.includes(namespace) && user.role !== 'admin') {
          return false;
        }

        switch (user.role) {
          case 'admin':
            return true;
          case 'editor':
            return action !== 'delete';
          case 'viewer':
            return action === 'view';
          default:
            return false;
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);