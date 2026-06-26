import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { QUERY_KEYS } from '@/utils/constants';

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

const MOCK_PROVEEDORES: Proveedor[] = [
  { id: 'p1', nombre: 'Constructora Lima S.A.C.', ruc: '20512345678', region: 'Lima', rubros: ['Infraestructura vial', 'Saneamiento'], riskScore: 92, contratos: 120, experiencia: 15, rating: 4.8, descripcion: 'Empresa líder en obras viales con más de 15 años. Sin sanciones vigentes.', estadoSunat: 'Activo' },
  { id: 'p2', nombre: 'Infraestructura Perú S.A.', ruc: '20598765432', region: 'Lima', rubros: ['Educación', 'Salud'], riskScore: 65, contratos: 15, experiencia: 5, rating: 3.9, descripcion: 'Empresa mediana especializada en infraestructura social. Historial mixto.', estadoSunat: 'Activo' },
  { id: 'p3', nombre: 'Obras y Más S.A.C.', ruc: '20534567890', region: 'Arequipa', rubros: ['Infraestructura vial', 'Energía'], riskScore: 32, contratos: 84, experiencia: 12, rating: 2.9, descripcion: 'Empresa con sanciones previas por incumplimiento de plazos.', estadoSunat: 'Activo' },
  { id: 'p4', nombre: 'Tecno Obras Norte S.A.C.', ruc: '20576543210', region: 'La Libertad', rubros: ['Tecnología', 'Seguridad ciudadana'], riskScore: 78, contratos: 22, experiencia: 7, rating: 4.2, descripcion: 'Especialista en soluciones tecnológicas para el sector público.', estadoSunat: 'Activo' },
  { id: 'p5', nombre: 'Constructora Andina SAC', ruc: '20512309876', region: 'Cusco', rubros: ['Saneamiento', 'Vivienda'], riskScore: 55, contratos: 9, experiencia: 3, rating: 3.5, descripcion: 'Empresa emergente con proyectos en la región sur.', estadoSunat: 'Activo' },
];

interface Filters { rubro?: string; region?: string; maxRisk?: string; minExp?: number; }

export function useProveedores(filters?: Filters) {
  return useQuery({
    queryKey: [QUERY_KEYS.PROVEEDORES, filters],
    queryFn: async (): Promise<Proveedor[]> => {
      await new Promise(r => setTimeout(r, 600));
      return MOCK_PROVEEDORES.filter(p => {
        if (filters?.rubro && !p.rubros.includes(filters.rubro)) return false;
        if (filters?.region && p.region !== filters.region) return false;
        if (filters?.maxRisk === 'Bajo' && p.riskScore < 71) return false;
        if (filters?.maxRisk === 'Medio' && p.riskScore < 41) return false;
        if (filters?.minExp && p.experiencia < filters.minExp) return false;
        return true;
      });
    },
  });
}

export function useProveedorSelection() {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev);
  const clear = () => setSelected([]);
  return { selected, toggle, clear };
}
