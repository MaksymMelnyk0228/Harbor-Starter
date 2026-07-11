import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "../types";
import { api, saveSession, setToken } from "../services/api";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (name: string, email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: async (email, password) => {
        const result = await api<{ token: string; user: AuthUser }>("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        saveSession(result);
        set({ user: result.user, token: result.token });
        return result.user;
      },
      register: async (name, email, password) => {
        const result = await api<{ token: string; user: AuthUser }>("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({ name, email, password }),
        });
        saveSession(result);
        set({ user: result.user, token: result.token });
        return result.user;
      },
      logout: () => {
        setToken(null);
        set({ user: null, token: null });
      },
    }),
    {
      name: "harbor-auth",
      onRehydrateStorage: () => (state) => {
        if (state?.token) setToken(state.token);
      },
    }
  )
);
