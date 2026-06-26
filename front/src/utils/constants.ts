export const ROLES = {
  ENTITY: 'entity',
  COMPANY: 'company',
} as const;

export type Role = 'entity' | 'company' | 'citizen'; // citizen kept for legacy compat

export const OBRA_STATUS = {
  EVALUATION: 'En evaluación',
  AWARDED: 'Adjudicado',
  IN_PROGRESS: 'En ejecución',
  FINISHED: 'Finalizado',
  SUSPENDED: 'Suspendido',
} as const;

export const RUBROS = [
  'Infraestructura vial',
  'Salud',
  'Educación',
  'Saneamiento',
  'Tecnología',
  'Medio ambiente',
  'Vivienda',
  'Seguridad ciudadana',
  'Transporte',
  'Energía',
] as const;

export const DISTRICTS = [
  'Miraflores', 'San Isidro', 'Barranco', 'Surco', 'La Molina',
  'San Borja', 'Pueblo Libre', 'Magdalena', 'Jesús María', 'Lince',
  'Callao', 'Cercado de Lima', 'Rímac', 'Breña', 'La Victoria',
  'San Luis', 'Ate', 'Comas', 'Los Olivos', 'Independencia',
  'El Agustino', 'San Juan de Lurigancho', 'Villa El Salvador',
] as const;

export const REGIONES = [
  'Lima', 'Callao', 'Arequipa', 'La Libertad', 'Piura',
  'Cusco', 'Junín', 'Lambayeque', 'Ica', 'Áncash',
] as const;

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const QUERY_KEYS = {
  OBRAS: 'obras',
  OBRA: 'obra',
  PROYECTOS: 'proyectos',
  PROYECTO: 'proyecto',
  PROVEEDORES: 'proveedores',
  ME: 'me',
} as const;
