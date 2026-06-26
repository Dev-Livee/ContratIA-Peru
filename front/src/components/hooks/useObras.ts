import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/constants';

export interface Obra {
  id: string;
  codigo: string;
  nombre: string;
  empresa: string;
  entidad: string;
  distrito: string;
  region: string;
  rubro: string;
  presupuesto: number;
  fechaInicio: string;
  fechaFin: string;
  status: string;
  avance: number;
  descripcion: string;
  riskScore: number;
  hitos: Hito[];
  fotos: string[];
  documentos: Documento[];
  historial: HistorialEntry[];
}

export interface Hito {
  label: string;
  fecha: string;
  completado: boolean;
  actual?: boolean;
}

export interface Documento {
  nombre: string;
  url: string;
}

export interface HistorialEntry {
  fecha: string;
  descripcion: string;
}

const MOCK_OBRAS: Obra[] = [
  {
    id: '1', codigo: 'COD-2025-0042',
    nombre: 'Mejoramiento de pistas y veredas Av. Principal',
    empresa: 'Constructora Lima S.A.C.', entidad: 'Municipalidad de Miraflores',
    distrito: 'Miraflores', region: 'Lima', rubro: 'Infraestructura vial',
    presupuesto: 2450000, fechaInicio: '2025-03-15', fechaFin: '2025-08-15',
    status: 'En ejecución', avance: 75, riskScore: 92,
    descripcion: 'Mejoramiento integral de la infraestructura vial, incluyendo pistas, veredas y señalización horizontal y vertical.',
    hitos: [
      { label: 'Proyecto creado', fecha: '2025-01-15', completado: true },
      { label: 'Evaluación de empresas', fecha: '2025-01-28', completado: true },
      { label: 'Empresa seleccionada', fecha: '2025-02-10', completado: true },
      { label: 'Contrato firmado', fecha: '2025-02-15', completado: true },
      { label: 'Inicio de obra', fecha: '2025-03-15', completado: true },
      { label: '25% completado', fecha: '2025-04-01', completado: true },
      { label: '50% completado', fecha: '2025-05-15', completado: true },
      { label: '75% completado', fecha: '2025-06-30', completado: true, actual: true },
      { label: 'Obra finalizada', fecha: '2025-08-15', completado: false },
    ],
    fotos: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=70',
      'https://images.unsplash.com/photo-1574169208507-84376144848b?w=600&q=70',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=70',
    ],
    documentos: [
      { nombre: 'Bases de contratación', url: '#' },
      { nombre: 'Contrato firmado', url: '#' },
      { nombre: 'Informe de avance - Jun 2025', url: '#' },
    ],
    historial: [
      { fecha: '2025-06-30', descripcion: 'Avance actualizado al 75%' },
      { fecha: '2025-05-15', descripcion: 'Avance actualizado al 50%' },
      { fecha: '2025-04-01', descripcion: 'Avance actualizado al 25%' },
      { fecha: '2025-03-15', descripcion: 'Inicio oficial de obra' },
    ],
  },
  {
    id: '2', codigo: 'COD-2025-0019',
    nombre: 'Construcción del parque recreativo Los Jardines',
    empresa: 'Infraestructura Verde S.A.C.', entidad: 'Municipalidad de San Borja',
    distrito: 'San Borja', region: 'Lima', rubro: 'Medio ambiente',
    presupuesto: 850000, fechaInicio: '2025-02-01', fechaFin: '2025-07-31',
    status: 'En ejecución', avance: 50, riskScore: 78,
    descripcion: 'Construcción de parque con áreas verdes, juegos infantiles y losas deportivas multifuncionales.',
    hitos: [
      { label: 'Proyecto creado', fecha: '2024-12-01', completado: true },
      { label: 'Evaluación de empresas', fecha: '2025-01-10', completado: true },
      { label: 'Empresa seleccionada', fecha: '2025-01-20', completado: true },
      { label: 'Contrato firmado', fecha: '2025-01-28', completado: true },
      { label: 'Inicio de obra', fecha: '2025-02-01', completado: true },
      { label: '25% completado', fecha: '2025-03-15', completado: true },
      { label: '50% completado', fecha: '2025-05-01', completado: true, actual: true },
      { label: '75% completado', fecha: '2025-06-15', completado: false },
      { label: 'Obra finalizada', fecha: '2025-07-31', completado: false },
    ],
    fotos: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=70',
    ],
    documentos: [
      { nombre: 'Expediente técnico', url: '#' },
      { nombre: 'Contrato de obra', url: '#' },
    ],
    historial: [
      { fecha: '2025-05-01', descripcion: 'Avance actualizado al 50%' },
      { fecha: '2025-03-15', descripcion: 'Avance actualizado al 25%' },
    ],
  },
  {
    id: '3', codigo: 'COD-2024-0088',
    nombre: 'Rehabilitación del colegio primario N° 5043',
    empresa: 'Constructora Educativa Perú', entidad: 'UGEL 07 Lima Sur',
    distrito: 'Callao', region: 'Callao', rubro: 'Educación',
    presupuesto: 1100000, fechaInicio: '2024-09-01', fechaFin: '2024-12-31',
    status: 'Finalizado', avance: 100, riskScore: 88,
    descripcion: 'Rehabilitación completa de infraestructura escolar incluyendo aulas, servicios higiénicos y áreas administrativas.',
    hitos: [
      { label: 'Proyecto creado', fecha: '2024-07-01', completado: true },
      { label: 'Evaluación de empresas', fecha: '2024-08-01', completado: true },
      { label: 'Empresa seleccionada', fecha: '2024-08-20', completado: true },
      { label: 'Contrato firmado', fecha: '2024-08-28', completado: true },
      { label: 'Inicio de obra', fecha: '2024-09-01', completado: true },
      { label: '25% completado', fecha: '2024-10-01', completado: true },
      { label: '50% completado', fecha: '2024-11-01', completado: true },
      { label: '75% completado', fecha: '2024-11-20', completado: true },
      { label: 'Obra finalizada', fecha: '2024-12-31', completado: true },
    ],
    fotos: [],
    documentos: [
      { nombre: 'Acta de recepción de obra', url: '#' },
      { nombre: 'Informe final', url: '#' },
    ],
    historial: [
      { fecha: '2024-12-31', descripcion: 'Obra finalizada y recepcionada' },
    ],
  },
  {
    id: '4', codigo: 'COD-2025-0031',
    nombre: 'Instalación red de agua potable sector norte',
    empresa: '', entidad: 'Municipalidad de Comas',
    distrito: 'Comas', region: 'Lima', rubro: 'Saneamiento',
    presupuesto: 3200000, fechaInicio: '', fechaFin: '2026-03-31',
    status: 'En evaluación', avance: 0, riskScore: 0,
    descripcion: 'Instalación de redes de distribución de agua potable y alcantarillado en el sector norte del distrito.',
    hitos: [
      { label: 'Proyecto creado', fecha: '2025-06-01', completado: true, actual: true },
      { label: 'Evaluación de empresas', fecha: '', completado: false },
      { label: 'Empresa seleccionada', fecha: '', completado: false },
      { label: 'Contrato firmado', fecha: '', completado: false },
      { label: 'Inicio de obra', fecha: '', completado: false },
      { label: 'Obra finalizada', fecha: '2026-03-31', completado: false },
    ],
    fotos: [],
    documentos: [{ nombre: 'Bases de licitación', url: '#' }],
    historial: [{ fecha: '2025-06-01', descripcion: 'Proyecto registrado y publicado' }],
  },
];

interface ObraFilters { distrito?: string; status?: string; rubro?: string; search?: string; }

export function useObras(filters?: ObraFilters) {
  return useQuery({
    queryKey: [QUERY_KEYS.OBRAS, filters],
    queryFn: async (): Promise<Obra[]> => {
      await new Promise(r => setTimeout(r, 700));
      return MOCK_OBRAS.filter(o => {
        if (filters?.distrito && o.distrito !== filters.distrito) return false;
        if (filters?.status && o.status !== filters.status) return false;
        if (filters?.rubro && o.rubro !== filters.rubro) return false;
        if (filters?.search && !o.nombre.toLowerCase().includes(filters.search.toLowerCase()) && !o.codigo.toLowerCase().includes(filters.search.toLowerCase())) return false;
        return true;
      });
    },
  });
}

export function useObra(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.OBRA, id],
    queryFn: async (): Promise<Obra | null> => {
      await new Promise(r => setTimeout(r, 500));
      return MOCK_OBRAS.find(o => o.id === id || o.codigo === id) ?? null;
    },
    enabled: !!id,
  });
}
