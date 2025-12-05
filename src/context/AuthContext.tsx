import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          const decoded: any = jwtDecode(storedToken);
          
          // Vérifier si le token est expiré
          const currentTime = Math.floor(Date.now() / 1000);
          if (decoded.exp && decoded.exp < currentTime) {
            throw new Error('Session expirée');
          }
          
          setUser({
            id: decoded.sub,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role || 'user',
          });
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData: any) => {
    try {
      // Créer un token JWT factice (en production, cela viendrait du serveur)
      const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({
        sub: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role || 'user',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60) // Expire dans 1 heure
      }))}.signature`;
      
      localStorage.setItem('token', mockToken);
      setToken(mockToken);
      setUser({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role || 'user',
      });
    } catch (error) {
      console.error('Error during login:', error);
      throw new Error('Failed to login');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    queryClient.clear();
    navigate('/login');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
