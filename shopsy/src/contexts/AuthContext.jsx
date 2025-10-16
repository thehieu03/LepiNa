import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../api/client";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("lepina_token"));

  useEffect(() => {
    if (token) {
      // Verify token and get user info
      // For now, we'll assume the token is valid if it exists
      setUser({ token, role: "admin" }); // You might want to decode JWT to get actual user info
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await authAPI.login(username, password);
      const { access_token } = response;

      localStorage.setItem("lepina_token", access_token);
      setToken(access_token);
      setUser({ token: access_token, role: "admin" });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  };

  const logout = () => {
    authAPI.logout();
    setToken(null);
    setUser(null);
    localStorage.removeItem("lepina_token");
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
