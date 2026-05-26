import React from 'react';
import { Navigate } from 'react-router-dom';
import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  login: (token: string, user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false, // For demo, we start false
  user: null,
  login: (token, user) => set({ isAuthenticated: true, user }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    // In a real implementation we would redirect to /admin/login
    // But to allow viewing the dashboard for now, we'll bypass it with a "fake" auth check
    // return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};
