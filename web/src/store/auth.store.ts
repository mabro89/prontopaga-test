import { create } from "zustand";
import axios from "axios";
import type { LoginInput, SafeUser } from "@/types/auth.types";
import { authService } from "@/services/auth.service";
import { setupApiClientAuth } from "@/services/api.client";
import { decodeJwtPayload } from "@/utils/jwt";

interface AuthState {
  user: SafeUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: LoginInput) => Promise<boolean>;
  logout: () => Promise<void>;
  silentRefresh: () => Promise<boolean>;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitializing: true,
  isLoading: false,
  error: null,

  login: async (credentials: LoginInput): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      const { user, accessToken } = await authService.login(credentials);
      set({
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (err) {
      let message = "Error al iniciar sesión";
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      set({
        error: message,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        accessToken: null,
      });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
    } catch {
      // Ignore logout network error to always clean local state
    } finally {
      get().clearAuth();
      set({ isLoading: false });
    }
  },

  silentRefresh: async (): Promise<boolean> => {
    try {
      const { accessToken } = await authService.refreshToken();
      const payload = decodeJwtPayload(accessToken);

      if (!payload?.id) {
        get().clearAuth();
        set({ isInitializing: false });
        return false;
      }

      set({ accessToken });

      // Fetch user profile using authenticated token
      const user = await authService.getUserProfile(payload.id);

      set({
        user,
        accessToken,
        isAuthenticated: true,
        isInitializing: false,
        error: null,
      });
      return true;
    } catch {
      get().clearAuth();
      set({ isInitializing: false });
      return false;
    }
  },

  setAccessToken: (token: string) => {
    set({ accessToken: token, isAuthenticated: true });
  },

  clearAuth: () => {
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));

setupApiClientAuth({
  getToken: () => useAuthStore.getState().accessToken,
  setToken: (token) => useAuthStore.getState().setAccessToken(token),
  onAuthFailed: () => useAuthStore.getState().clearAuth(),
});
