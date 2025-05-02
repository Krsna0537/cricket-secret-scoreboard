
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, UserRole } from "@/types";

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - in a real app, this would come from an API
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@cricket.com",
    password: "password123", // In a real app, passwords would be hashed
    role: UserRole.ADMIN
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("cricket_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
      } catch (e) {
        console.error("Failed to parse saved user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, this would be an API call
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = MOCK_USERS.find(u => u.email === email);
    
    if (!user || user.password !== password) {
      setIsLoading(false);
      throw new Error("Invalid credentials");
    }
    
    // Remove password before storing user
    const { password: _, ...userWithoutPassword } = user;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem("cricket_user", JSON.stringify(userWithoutPassword));
    setIsLoading(false);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("cricket_user");
  };

  const isAdmin = currentUser?.role === UserRole.ADMIN;

  return (
    <AuthContext.Provider value={{
      currentUser,
      isLoading,
      login,
      logout,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
