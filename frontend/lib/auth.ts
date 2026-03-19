/**
 * Demo authentication helpers.
 * In production, replace with a proper auth solution (NextAuth, Clerk, etc.)
 */

const AUTH_KEY = "taskai_auth";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

const DEMO_USER: AuthUser = {
  id: "demo_user",
  name: "Zohair Azmat",
  email: "zohair@taskai.demo",
};

export const login = (email: string, password: string): boolean => {
  // Demo credentials
  const validCredentials = [
    { email: "demo@taskai.com", password: "demo123" },
    { email: "admin@taskai.com", password: "admin123" },
    { email: "zohair@taskai.demo", password: "password" },
  ];

  const valid = validCredentials.some(
    (cred) => cred.email === email && cred.password === password
  );

  if (valid) {
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_KEY, JSON.stringify(DEMO_USER));
    }
    return true;
  }
  return false;
};

export const logout = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_KEY);
  }
};

export const getUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(AUTH_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as AuthUser;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return getUser() !== null;
};
