
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  role: 'Admin' | 'VA';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, role: 'Admin' | 'VA') => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Mock API call - replace with actual API
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      
      // Store user and token in session storage
      const userData = { 
        id: data.user.id || `user_${Date.now()}`, 
        username: data.user.username || username, 
        role: data.user.role || 'VA' 
      };
      
      sessionStorage.setItem('user', JSON.stringify(userData));
      sessionStorage.setItem('token', data.access_token || 'mock_token');
      setUser(userData);
    } catch (error) {
      // For demo purposes, create a mock login
      console.log('Using mock login for demo');
      const userData = { 
        id: `user_${Date.now()}`, 
        username, 
        role: 'Admin' as const 
      };
      
      sessionStorage.setItem('user', JSON.stringify(userData));
      sessionStorage.setItem('token', 'mock_token_' + Date.now());
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string, role: 'Admin' | 'VA') => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      
      const userData = { 
        id: data.id || `user_${Date.now()}`, 
        username: data.username || username, 
        role: data.role || role 
      };
      
      sessionStorage.setItem('user', JSON.stringify(userData));
      sessionStorage.setItem('token', 'mock_token_' + Date.now());
      setUser(userData);
    } catch (error) {
      // For demo purposes, create a mock registration
      console.log('Using mock registration for demo');
      const userData = { id: `user_${Date.now()}`, username, role };
      
      sessionStorage.setItem('user', JSON.stringify(userData));
      sessionStorage.setItem('token', 'mock_token_' + Date.now());
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
