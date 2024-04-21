import React, { createContext, useState, useEffect } from "react";
import {jwtDecode} from 'jwt-decode'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(true); 

  const signIn = () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        const { id } = decodedToken;
        setToken(storedToken);
        setId(id);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
    setLoading(false); 
  }

  useEffect(() => {
    signIn();
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, loading, id, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};