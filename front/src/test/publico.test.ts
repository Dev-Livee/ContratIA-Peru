import { describe, it, expect } from 'vitest';
import {
  adaptObra,
  adaptObraDetalle,
  mapEstadoToLabel,
  mapLabelToEstado,
  type ObraPublicaResponse,
  type ObraDetalleResponse,
} from '@/services/publico';

const baseDto: ObraPublicaResponse = {
  id: 'a1b2c3',
  codigoUnico: 'COD-2025-0042',
  titulo: 'Mejoramiento de pistas Av. Principal',
  descripcion: 'Mejora vial integral',
  presupuesto: 2450000,
  rubro: 'Infraestructura vial',
  distrito: 'Miraflores',
  provincia: 'Lima',
  region: 'Lima',
  direccion: 'Av. Principal 123',
  fechaInicioPrevista: '2025-03-15',
  fechaFinPrevista: '2025-08-15',
  plazoMeses: 5,
  estado: 'EN_EJECUCION',
  avanceFisico: 75,
  avanceFinanciero: 70,
  entidadNombre: 'Municipalidad de Miraflores',
  empresaEjecutoraNombre: 'Constructora Lima S.A.C.',
};

describe('publico API adapters', () => {
  it('maps estado enum to spanish label', () => {
    expect(mapEstadoToLabel('EN_EJECUCION')).toBe('En ejecución');
    expect(mapEstadoToLabel('FINALIZADO')).toBe('Finalizado');
    expect(mapEstadoToLabel('ADJUDICADO')).toBe('Adjudicado');
    expect(mapEstadoToLabel('EN_EVALUACION')).toBe('En evaluación');
    expect(mapEstadoToLabel('CANCELADO')).toBe('Suspendido');
  });

  it('maps label back to enum', () => {
    expect(mapLabelToEstado('En ejecución')).toBe('EN_EJECUCION');
    expect(mapLabelToEstado('Finalizado')).toBe('FINALIZADO');
    expect(mapLabelToEstado('Adjudicado')).toBe('ADJUDICADO');
    expect(mapLabelToEstado('No existe')).toBeUndefined();
  });

  it('adapts a public obra response to front Obra shape', () => {
    const obra = adaptObra(baseDto);
    expect(obra.id).toBe('a1b2c3');
    expect(obra.codigo).toBe('COD-2025-0042');
    expect(obra.nombre).toBe('Mejoramiento de pistas Av. Principal');
    expect(obra.empresa).toBe('Constructora Lima S.A.C.');
    expect(obra.entidad).toBe('Municipalidad de Miraflores');
    expect(obra.distrito).toBe('Miraflores');
    expect(obra.status).toBe('En ejecución');
    expect(obra.avance).toBe(75);
    expect(obra.presupuesto).toBe(2450000);
    expect(obra.fechaInicio).toBe('2025-03-15');
  });

  it('handles missing empresa and dates gracefully', () => {
    const dto: ObraPublicaResponse = {
      ...baseDto,
      empresaEjecutoraNombre: null,
      fechaInicioPrevista: null,
      fechaFinPrevista: null,
      estado: 'EN_EVALUACION',
    };
    const obra = adaptObra(dto);
    expect(obra.empresa).toBe('');
    expect(obra.fechaInicio).toBe('');
    expect(obra.fechaFin).toBe('');
    expect(obra.status).toBe('En evaluación');
  });

  it('adapts a full detail response with hitos, evidencias and documentos', () => {
    const dto: ObraDetalleResponse = {
      ...baseDto,
      requisitos: 'Requisitos técnicos detallados',
      fechaAdjudicacion: '2025-02-15T10:00:00',
      entidadTipo: 'GOBIERNO_LOCAL',
      empresaEjecutoraRuc: '20123456789',
      hitos: [
        { id: 'h1', titulo: 'Inicio de obra', fechaPrevista: '2025-03-15', fechaReal: '2025-03-15', completado: true },
        { id: 'h2', titulo: 'Avance 50%', fechaPrevista: '2025-05-15', fechaReal: null, completado: false },
      ],
      avancesRecientes: [
        { id: 'a1', porcentaje: 75, descripcion: 'Avance trimestral', fecha: '2025-06-30' },
      ],
      evidenciasPublicas: [
        { id: 'e1', url: 'https://example.com/foto1.jpg', descripcion: 'Foto avance' },
      ],
      documentosPublicos: [
        { id: 'd1', nombre: 'Contrato firmado', url: 'https://example.com/contrato.pdf' },
      ],
    };

    const obra = adaptObraDetalle(dto);
    expect(obra.hitos).toHaveLength(2);
    expect(obra.hitos[0]).toEqual({ label: 'Inicio de obra', fecha: '2025-03-15', completado: true });
    expect(obra.hitos[1].completado).toBe(false);
    expect(obra.fotos).toEqual(['https://example.com/foto1.jpg']);
    expect(obra.documentos).toEqual([{ nombre: 'Contrato firmado', url: 'https://example.com/contrato.pdf' }]);
    expect(obra.historial).toHaveLength(1);
    expect(obra.historial[0].descripcion).toContain('75%');
  });
});
