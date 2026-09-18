import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: 'editor' | 'creator' | null;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  setRole: (role: 'editor' | 'creator') => Promise<User>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('edit_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('edit_token');
  });
  const [isLoading, setIsLoading] = useState(true);

  // Validate token with backend on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('edit_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('http://127.0.0.1:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            localStorage.setItem('edit_user', JSON.stringify(data.user));
          }
        } else {
          // Token invalid or expired
          localStorage.removeItem('edit_token');
          localStorage.removeItem('edit_user');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.warn('Backend authentication check failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('edit_token', newToken);
    localStorage.setItem('edit_user', JSON.stringify(newUser));
  };

  const setRole = async (role: 'editor' | 'creator'): Promise<User> => {
    const activeToken = token || localStorage.getItem('edit_token');
    if (!activeToken) {
      throw new Error('Not authenticated');
    }

    const res = await fetch('http://127.0.0.1:5000/api/auth/role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${activeToken}`,
      },
      body: JSON.stringify({ role }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to set user role');
    }

    if (data.token) {
      setToken(data.token);
      localStorage.setItem('edit_token', data.token);
    }

    const updatedUser = data.user || { ...user, role };
    setUser(updatedUser);
    localStorage.setItem('edit_user', JSON.stringify(updatedUser));
    return updatedUser;
  };

  const logout = () => {
    try {
      fetch('http://127.0.0.1:5000/api/auth/logout', { method: 'POST' }).catch(() => {});
    } catch {}
    localStorage.removeItem('edit_token');
    localStorage.removeItem('edit_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      localStorage.setItem('edit_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        setRole,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
