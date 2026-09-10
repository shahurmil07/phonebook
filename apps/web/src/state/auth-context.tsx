import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { adminApi, getAdminToken, setAdminToken, type AdminUser } from "../lib/api";

type AuthContextValue = {
  isAuthenticated: boolean;
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; message: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const USER_KEY = "buzaao-admin-user";

function readStoredUser(): AdminUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AdminUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getAdminToken());
  const [user, setUser] = useState<AdminUser | null>(() => (getAdminToken() ? readStoredUser() : null));

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(token),
      user,
      login: async (email, password) => {
        try {
          const result = await adminApi.login(email, password);
          setAdminToken(result.token);
          localStorage.setItem(USER_KEY, JSON.stringify(result.user));
          setToken(result.token);
          setUser(result.user);
          return { ok: true };
        } catch (error) {
          return {
            ok: false,
            message: error instanceof Error ? error.message : "Login failed",
          };
        }
      },
      logout: () => {
        setAdminToken(null);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
      },
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
