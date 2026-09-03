import { createContext, useContext, useState } from "react";
import { login as apiLogin, register as apiRegister } from "../api/auth";
import { clearToken, getToken, setToken } from "../api/client";

const USER_KEY = "authUser";
const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  function persistSession({ token, user: sessionUser }) {
    setToken(token);
    localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
  }

  async function login(credentials) {
    const result = await apiLogin(credentials);
    persistSession(result);
    return result.user;
  }

  async function register(data) {
    const result = await apiRegister(data);
    persistSession(result);
    return result.user;
  }

  function logout() {
    clearToken();
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  const value = {
    user,
    isAuthenticated: Boolean(user && getToken()),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
}
