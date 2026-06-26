import api from './api';
import type { Obra, Hito, Documento, HistorialEntry } from '@/components/hooks/useObras';

// ============================================================================
// Backend DTOs (mirror of Spring Boot responses)
// ============================================================================

export type EstadoProyecto =
  | 'BORRADOR'
  | 'EN_EVALUACION'
  | 'ADJUDICADO'
  | 'EN_EJECUCION'
  | 'FINALIZADO'
  | 'CANCELADO';

export interface ObraPublicaResponse {
  id: string;
  codigoUnico: string;
  titulo: string;
  descripcion: string;
  presupuesto: number;
  rubro: string;
  distrito: string;
  provincia: string;
  region: string;
  direccion: string;
  fechaInicioPrevista: string | null;
  fechaFinPrevista: string | null;
  plazoMeses: number | null;
  estado: EstadoProyecto;
  avanceFisico: number;
  avanceFinanciero: number;
  entidadNombre: string;
  empresaEjecutoraNombre: string | null;
}

export interface HitoResponse {
  id: string;
  titulo: string;
  fechaPrevista: string | null;
  fechaReal: string | null;
  completado: boolean;
}

export interface AvanceResponse {
  id: string;
  porcentaje: number;
  descripcion: string;
  fecha: string;
}

export interface EvidenciaResponse {
  id: string;
  url: string;
  descripcion: string;
}

export interface DocumentoResponse {
  id: string;
  nombre: string;
  url: string;
}

export interface ObraDetalleResponse extends ObraPublicaResponse {
  requisitos: string;
  fechaAdjudicacion: string | null;
  entidadTipo: string;
  empresaEjecutoraRuc: string | null;
  hitos: HitoResponse[];
  avancesRecientes: AvanceResponse[];
  evidenciasPublicas: EvidenciaResponse[];
  documentosPublicos: DocumentoResponse[];
}

export interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// ============================================================================
// Adapters: DTO -> front Obra type
// ============================================================================

const ESTADO_LABELS: Record<EstadoProyecto, string> = {
  BORRADOR: 'En evaluación',
  EN_EVALUACION: 'En evaluación',
  ADJUDICADO: 'Adjudicado',
  EN_EJECUCION: 'En ejecución',
  FINALIZADO: 'Finalizado',
  CANCELADO: 'Suspendido',
};

export function mapEstadoToLabel(estado: EstadoProyecto): string {
  return ESTADO_LABELS[estado] ?? 'En evaluación';
}

export function mapLabelToEstado(label: string): EstadoProyecto | undefined {
  const entry = Object.entries(ESTADO_LABELS).find(([, v]) => v === label);
  return entry?.[0] as EstadoProyecto | undefined;
}

export function adaptObra(dto: ObraPublicaResponse): Obra {
  return {
    id: dto.id,
    codigo: dto.codigoUnico,
    nombre: dto.titulo,
    empresa: dto.empresaEjecutoraNombre ?? '',
    entidad: dto.entidadNombre,
    distrito: dto.distrito,
    region: dto.region,
    rubro: dto.rubro,
    presupuesto: Number(dto.presupuesto),
    fechaInicio: dto.fechaInicioPrevista ?? '',
    fechaFin: dto.fechaFinPrevista ?? '',
    status: mapEstadoToLabel(dto.estado),
    avance: Number(dto.avanceFisico),
    descripcion: dto.descripcion ?? '',
    riskScore: 0,
    hitos: [],
    fotos: [],
    documentos: [],
    historial: [],
  };
}

export function adaptObraDetalle(dto: ObraDetalleResponse): Obra {
  const hitos: Hito[] = (dto.hitos ?? []).map(h => ({
    label: h.titulo,
    fecha: h.fechaReal ?? h.fechaPrevista ?? '',
    completado: h.completado,
  }));

  const fotos: string[] = (dto.evidenciasPublicas ?? []).map(e => e.url);

  const documentos: Documento[] = (dto.documentosPublicos ?? []).map(d => ({
    nombre: d.nombre,
    url: d.url,
  }));

  const historial: HistorialEntry[] = (dto.avancesRecientes ?? []).map(a => ({
    fecha: a.fecha,
    descripcion: `${a.descripcion} (${a.porcentaje}%)`,
  }));

  return {
    ...adaptObra(dto),
    hitos,
    fotos,
    documentos,
    historial,
  };
}

// ============================================================================
// API calls
// ============================================================================

export interface BuscarObrasParams {
  distrito?: string;
  estado?: EstadoProyecto;
  rubro?: string;
  presupuestoMin?: number;
  presupuestoMax?: number;
  page?: number;
  size?: number;
}

export async function buscarObras(params: BuscarObrasParams = {}): Promise<SpringPage<ObraPublicaResponse>> {
  const { data } = await api.get<SpringPage<ObraPublicaResponse>>('/publico/obras', { params });
  return data;
}

export async function obtenerObraDetalle(codigoUnico: string): Promise<ObraDetalleResponse> {
  const { data } = await api.get<ObraDetalleResponse>(`/publico/obras/${codigoUnico}`);
  return data;
}

export async function listarDistritos(): Promise<string[]> {
  const { data } = await api.get<string[]>('/publico/distritos');
  return data;
}
