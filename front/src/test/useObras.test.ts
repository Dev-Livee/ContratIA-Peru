import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useObras, useObra } from '@/components/hooks/useObras';
import React from 'react';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useObras — Búsqueda de obras (funcionalidad crítica)', () => {
  it('happy path: devuelve obras filtradas por distrito', async () => {
    const { result } = renderHook(() => useObras({ distrito: 'Miraflores' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data!.length).toBeGreaterThan(0);
    expect(result.current.data!.every(o => o.distrito === 'Miraflores')).toBe(true);
  });

  it('happy path: devuelve todas las obras sin filtro', async () => {
    const { result } = renderHook(() => useObras({}), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data!.length).toBe(4);
  });

  it('happy path: búsqueda por nombre parcial (case insensitive)', async () => {
    const { result } = renderHook(() => useObras({ search: 'parque' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data!.length).toBe(1);
    expect(result.current.data![0].nombre).toContain('parque');
  });

  it('caso de error: búsqueda por distrito inexistente devuelve lista vacía', async () => {
    const { result } = renderHook(() => useObras({ distrito: 'Atlantis' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
  });

  it('caso de error: búsqueda por código inexistente devuelve lista vacía', async () => {
    const { result } = renderHook(() => useObras({ search: 'XXXXX-9999-NOPE' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
  });
});

describe('useObra — Detalle de obra individual', () => {
  it('happy path: encuentra obra por ID', async () => {
    const { result } = renderHook(() => useObra('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data!.codigo).toBe('COD-2025-0042');
    expect(result.current.data!.distrito).toBe('Miraflores');
  });

  it('caso de error: ID inexistente devuelve null', async () => {
    const { result } = renderHook(() => useObra('999'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeNull();
  });
});
