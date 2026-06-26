import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import type { ObraPublicaResponse, ObraDetalleResponse, SpringPage } from '@/services/publico';

vi.mock('@/services/publico', async () => {
  const actual = await vi.importActual<typeof import('@/services/publico')>('@/services/publico');
  return {
    ...actual,
    buscarObras: vi.fn(),
    obtenerObraDetalle: vi.fn(),
    listarDistritos: vi.fn(),
  };
});

import { useObras, useObra } from '@/components/hooks/useObras';
import * as publicoApi from '@/services/publico';

const buscarObrasMock = publicoApi.buscarObras as ReturnType<typeof vi.fn>;
const obtenerDetalleMock = publicoApi.obtenerObraDetalle as ReturnType<typeof vi.fn>;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

const sampleObras: ObraPublicaResponse[] = [
  {
    id: '1', codigoUnico: 'COD-2025-0042',
    titulo: 'Mejoramiento de pistas Av. Principal',
    descripcion: 'Vías', presupuesto: 2450000, rubro: 'Infraestructura vial',
    distrito: 'Miraflores', provincia: 'Lima', region: 'Lima', direccion: 'Av X',
    fechaInicioPrevista: '2025-03-15', fechaFinPrevista: '2025-08-15',
    plazoMeses: 5, estado: 'EN_EJECUCION',
    avanceFisico: 75, avanceFinanciero: 70,
    entidadNombre: 'Munic. Miraflores',
    empresaEjecutoraNombre: 'Constructora Lima S.A.C.',
  },
  {
    id: '2', codigoUnico: 'COD-2025-0019',
    titulo: 'Construcción del parque recreativo Los Jardines',
    descripcion: 'Parque', presupuesto: 850000, rubro: 'Medio ambiente',
    distrito: 'San Borja', provincia: 'Lima', region: 'Lima', direccion: 'Calle Y',
    fechaInicioPrevista: '2025-02-01', fechaFinPrevista: '2025-07-31',
    plazoMeses: 6, estado: 'EN_EJECUCION',
    avanceFisico: 50, avanceFinanciero: 45,
    entidadNombre: 'Munic. San Borja',
    empresaEjecutoraNombre: 'Verde S.A.C.',
  },
];

function pageOf(items: ObraPublicaResponse[]): SpringPage<ObraPublicaResponse> {
  return { content: items, totalElements: items.length, totalPages: 1, number: 0, size: 100 };
}

beforeEach(() => {
  buscarObrasMock.mockReset();
  obtenerDetalleMock.mockReset();
});

describe('useObras — Búsqueda de obras (integración con backend)', () => {
  it('happy path: devuelve obras del backend filtradas por distrito', async () => {
    buscarObrasMock.mockResolvedValueOnce(pageOf([sampleObras[0]]));

    const { result } = renderHook(() => useObras({ distrito: 'Miraflores' }), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(buscarObrasMock).toHaveBeenCalledWith(expect.objectContaining({ distrito: 'Miraflores' }));
    expect(result.current.data!.length).toBe(1);
    expect(result.current.data![0].distrito).toBe('Miraflores');
    expect(result.current.data![0].codigo).toBe('COD-2025-0042');
  });

  it('happy path: devuelve todas las obras sin filtro', async () => {
    buscarObrasMock.mockResolvedValueOnce(pageOf(sampleObras));

    const { result } = renderHook(() => useObras({}), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data!.length).toBe(2);
  });

  it('happy path: búsqueda por nombre filtra en cliente (case insensitive)', async () => {
    buscarObrasMock.mockResolvedValueOnce(pageOf(sampleObras));

    const { result } = renderHook(() => useObras({ search: 'PARQUE' }), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data!.length).toBe(1);
    expect(result.current.data![0].nombre.toLowerCase()).toContain('parque');
  });

  it('mapea el estado del filtro a enum del backend', async () => {
    buscarObrasMock.mockResolvedValueOnce(pageOf([]));

    const { result } = renderHook(() => useObras({ status: 'En ejecución' }), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(buscarObrasMock).toHaveBeenCalledWith(expect.objectContaining({ estado: 'EN_EJECUCION' }));
  });

  it('caso de error: distrito inexistente devuelve lista vacía', async () => {
    buscarObrasMock.mockResolvedValueOnce(pageOf([]));

    const { result } = renderHook(() => useObras({ distrito: 'Atlantis' }), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it('caso de error: búsqueda por código inexistente devuelve lista vacía', async () => {
    buscarObrasMock.mockResolvedValueOnce(pageOf(sampleObras));

    const { result } = renderHook(() => useObras({ search: 'XXXXX-9999-NOPE' }), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });
});

describe('useObra — Detalle de obra individual', () => {
  const detailDto: ObraDetalleResponse = {
    ...sampleObras[0],
    requisitos: 'Requisitos', fechaAdjudicacion: '2025-02-15T10:00:00',
    entidadTipo: 'GOBIERNO_LOCAL', empresaEjecutoraRuc: '20123456789',
    hitos: [], avancesRecientes: [], evidenciasPublicas: [], documentosPublicos: [],
  };

  it('happy path: encuentra obra por código único', async () => {
    obtenerDetalleMock.mockResolvedValueOnce(detailDto);

    const { result } = renderHook(() => useObra('COD-2025-0042'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(obtenerDetalleMock).toHaveBeenCalledWith('COD-2025-0042');
    expect(result.current.data!.codigo).toBe('COD-2025-0042');
    expect(result.current.data!.distrito).toBe('Miraflores');
  });

  it('caso de error: código inexistente devuelve null', async () => {
    obtenerDetalleMock.mockRejectedValueOnce(new Error('404'));

    const { result } = renderHook(() => useObra('NOPE'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });
});
