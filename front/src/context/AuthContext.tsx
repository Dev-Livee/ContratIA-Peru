import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Role } from '@/utils/constants';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  razonSocial?: string;
  ruc?: string;
  avatarUrl?: string;
  organizationName?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = 'contratia_v2_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user);
        setToken(parsed.token);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const role: Role = email.includes('empresa') || email.includes('corp') ? 'company' : 'entity';
    const mockUser: AuthUser = {
      id: crypto.randomUUID(),
      name: role === 'entity' ? 'María González' : 'Carlos Ríos',
      email,
      role,
      razonSocial: role === 'entity' ? 'Municipalidad de Miraflores' : 'Constructora Lima S.A.C.',
      ruc: role === 'entity' ? '20131377783' : '20512345678',
    };
    const mockToken = 'jwt-' + Date.now();
    setUser(mockUser);
    setToken(mockToken);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: mockUser, token: mockToken }));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateUser = (data: Partial<AuthUser>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: updated, token }));
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated: !!user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
