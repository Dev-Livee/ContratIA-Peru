import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import type { Role } from '@/utils/constants';
import { API_BASE_URL } from '@/utils/constants';

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

export interface RegisterPayload {
  tipoCuenta: 'entidad' | 'empresa';
  ruc: string;
  razonSocial: string;
  correo: string;
  dniRepresentante: string;
  nombreRepresentante: string;
  password: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<AuthUser>) => void;
}

// Must match the key read by api.ts axios interceptor
const STORAGE_KEY = 'contratia_auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  const persist = (u: AuthUser, t: string) => {
    setUser(u);
    setToken(t);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: u, token: t }));
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const backendRole: Role = data.role === 'EMPRESA' ? 'company' : 'entity';
      const authUser: AuthUser = {
        id: data.userId,
        name: data.razonSocial ?? data.email,
        email: data.email,
        role: backendRole,
        razonSocial: data.razonSocial,
      };
      localStorage.setItem('contratia_refresh', data.refreshToken);
      persist(authUser, data.accessToken);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    const isEmpresa = payload.tipoCuenta === 'empresa';
    const endpoint = isEmpresa ? '/auth/register/empresa' : '/auth/register/entidad';
    const body = isEmpresa
      ? {
          ruc: payload.ruc,
          razonSocial: payload.razonSocial,
          email: payload.correo,
          dniRepresentante: payload.dniRepresentante,
          representanteLegal: payload.nombreRepresentante,
          password: payload.password,
          sector: 'Construccion',
          telefono: '',
        }
      : {
          ruc: payload.ruc,
          razonSocial: payload.razonSocial,
          email: payload.correo,
          dniRepresentante: payload.dniRepresentante,
          representanteLegal: payload.nombreRepresentante,
          password: payload.password,
          tipo: 'MUNICIPALIDAD',
          distrito: 'Lima',
          provincia: 'Lima',
          region: 'Lima',
          telefono: '',
          cargo: 'Representante',
        };
    await axios.post(`${API_BASE_URL}${endpoint}`, body);
    // emailVerificado=true on backend, login immediately
    await login(payload.correo, payload.password);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('contratia_refresh');
  };

  const updateUser = (data: Partial<AuthUser>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: updated, token }));
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated: !!user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
