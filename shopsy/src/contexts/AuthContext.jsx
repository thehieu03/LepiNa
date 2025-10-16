import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../api/client";
import jwtDecode from "jwt-decode";
import PropTypes from "prop-types";

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
      try {
        const decoded = jwtDecode(token);
        const role =
          decoded["role"] ||
          decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ] ||
          "user";
        const exp = decoded["exp"] ? decoded["exp"] * 1000 : 0;
        if (exp && Date.now() > exp) {
          localStorage.removeItem("lepina_token");
          setUser(null);
        } else {
          setUser({ token, role });
        }
      } catch (_) {
        setUser(null);
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await authAPI.login(username, password);
      const { access_token } = response;

      localStorage.setItem("lepina_token", access_token);
      setToken(access_token);
      try {
        const decoded = jwtDecode(access_token);
        const role =
          decoded["role"] ||
          decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ] ||
          "user";
        setUser({ token: access_token, role });
      } catch (_) {
        setUser({ token: access_token, role: "user" });
      }

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

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
