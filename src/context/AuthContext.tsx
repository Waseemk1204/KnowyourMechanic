import React, { useEffect, useState, createContext, useContext } from 'react';
export type UserRole = 'customer' | 'garage' | null;
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {}
});
export const useAuth = () => useContext(AuthContext);
export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Check for existing session on load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);
  // Mock login function
  const login = async (email: string, password: string, role: UserRole) => {
    // In a real app, this would make an API call to authenticate
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      // Mock user based on role
      let mockUser: User;
      if (role === 'garage') {
        mockUser = {
          id: 'garage_001',
          name: 'Shiv Auto Care',
          email: email,
          role: 'garage',
          phone: '+91-9876543210'
        };
      } else {
        mockUser = {
          id: 'customer_001',
          name: 'Rahul Kumar',
          email: email,
          role: 'customer',
          phone: '+91-9876543201'
        };
      }
      // Save to local storage
      localStorage.setItem('user', JSON.stringify(mockUser));
      // Update state
      setUser(mockUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid credentials');
    }
  };
  // Mock register function
  const register = async (name: string, email: string, password: string, role: UserRole) => {
    // In a real app, this would make an API call to register
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Mock user creation
      const mockUser: User = {
        id: role === 'garage' ? 'garage_' + Date.now() : 'customer_' + Date.now(),
        name,
        email,
        role
      };
      // Save to local storage
      localStorage.setItem('user', JSON.stringify(mockUser));
      // Update state
      setUser(mockUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('Registration failed');
    }
  };
  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };
  return <AuthContext.Provider value={{
    user,
    isAuthenticated,
    login,
    register,
    logout
  }}>
      {children}
    </AuthContext.Provider>;
};