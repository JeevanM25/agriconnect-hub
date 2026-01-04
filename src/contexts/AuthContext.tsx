import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'createdAt'>, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing
const demoUsers: Record<string, User> = {
  'farmer@demo.com': {
    id: '1',
    name: 'Ramesh Kumar',
    phone: '+91 9876543210',
    email: 'farmer@demo.com',
    role: 'farmer',
    location: 'Shivamogga, Karnataka',
    createdAt: new Date(),
  },
  'middleman@demo.com': {
    id: '2',
    name: 'Suresh Trader',
    phone: '+91 9876543211',
    email: 'middleman@demo.com',
    role: 'middleman',
    location: 'Bangalore, Karnataka',
    createdAt: new Date(),
  },
  'driver@demo.com': {
    id: '3',
    name: 'Krishna Driver',
    phone: '+91 9876543212',
    email: 'driver@demo.com',
    role: 'driver',
    location: 'Shivamogga, Karnataka',
    createdAt: new Date(),
  },
  'worker@demo.com': {
    id: '4',
    name: 'Gowda Worker',
    phone: '+91 9876543213',
    email: 'worker@demo.com',
    role: 'worker',
    location: 'Shivamogga, Karnataka',
    createdAt: new Date(),
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('krishiconnect_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Demo login - in production, this would be an API call
    const demoUser = demoUsers[email];
    if (demoUser && demoUser.role === role) {
      setUser(demoUser);
      localStorage.setItem('krishiconnect_user', JSON.stringify(demoUser));
      return true;
    }
    
    // Allow any login for demo purposes
    const newUser: User = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      phone: '+91 0000000000',
      email,
      role,
      location: 'Unknown',
      createdAt: new Date(),
    };
    setUser(newUser);
    localStorage.setItem('krishiconnect_user', JSON.stringify(newUser));
    return true;
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt'>, password: string): Promise<boolean> => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setUser(newUser);
    localStorage.setItem('krishiconnect_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('krishiconnect_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
