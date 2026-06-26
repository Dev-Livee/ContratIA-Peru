import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { QUERY_KEYS } from '@/utils/constants';
import api from '@/services/api';

export interface Proveedor {
  id: string;
  nombre: string;
  ruc: string;
  region: string;
  rubros: string[];
  riskScore: number;
  contratos: number;
  experiencia: number;
  rating: number;
  descripcion: string;
  estadoSunat: 'Activo' | 'Inactivo';
}

interface Filters { rubro?: string; region?: string; maxRisk?: string; minExp?: number; search?: string; }

export function useProveedores(filters?: Filters) {
  return useQuery({
    queryKey: [QUERY_KEYS.PROVEEDORES, filters],
    queryFn: async (): Promise<Proveedor[]> => {
      const q = filters?.rubro || filters?.search || 'construccion';
      const { data } = await api.get('/proveedores/buscar', { params: { q } });
      // LatInfo returns { razon_social, estado, id(ruc) }
      return (data as { razon_social: string; estado: string; id: string }[])
        .filter(p => p.estado === 'ACTIVO')
        .map(p => ({
          id: p.id,
          nombre: p.razon_social,
          ruc: p.id,
          region: filters?.region ?? 'Lima',
          rubros: filters?.rubro ? [filters.rubro] : ['Infraestructura vial'],
          riskScore: 70,
          contratos: 0,
          experiencia: 0,
          rating: 4.0,
          descripcion: `Estado SUNAT: ${p.estado}`,
          estadoSunat: 'Activo',
        }));
    },
    enabled: true,
  });
}

export function useProveedorSelection() {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev);
  const clear = () => setSelected([]);
  return { selected, toggle, clear };
}
