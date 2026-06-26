import { useState } from 'react';

export interface Provider {
  id: string;
  name: string;
  ruc: string;
  rubro: string[];
  region: string;
  risk: string;
  experience: number;
  contracts: number;
  avgDays: number;
  rating: number;
  description: string;
}

const MOCK_PROVIDERS: Provider[] = [
  { id: 'c1', name: 'Construcciones ABC SAC', ruc: '20512345678', rubro: ['Infraestructura vial', 'Saneamiento'], region: 'Lima', risk: 'Bajo', experience: 12, contracts: 34, avgDays: 185, rating: 4.5, description: 'Empresa líder en obras viales con más de 12 años de trayectoria.' },
  { id: 'c2', name: 'Obras y Servicios XYZ', ruc: '20598765432', rubro: ['Medio ambiente', 'Vivienda'], region: 'Lima', risk: 'Bajo', experience: 8, contracts: 21, avgDays: 210, rating: 4.2, description: 'Especialista en proyectos de medio ambiente y espacios públicos.' },
  { id: 'c3', name: 'Constructora Educativa Perú', ruc: '20534567890', rubro: ['Educación', 'Salud'], region: 'Callao', risk: 'Medio', experience: 6, contracts: 15, avgDays: 240, rating: 3.9, description: 'Enfocada en infraestructura educativa y de salud a nivel nacional.' },
  { id: 'c4', name: 'Tecno Obras Norte', ruc: '20576543210', rubro: ['Tecnología', 'Seguridad ciudadana'], region: 'La Libertad', risk: 'Medio', experience: 4, contracts: 9, avgDays: 195, rating: 3.7, description: 'Soluciones tecnológicas integradas para el sector público.' },
  { id: 'c5', name: 'Constructora Andina Perú SAC', ruc: '20512309876', rubro: ['Infraestructura vial', 'Energía'], region: 'Arequipa', risk: 'Alto', experience: 3, contracts: 5, avgDays: 320, rating: 2.8, description: 'Empresa emergente con proyectos en la región sur del país.' },
];

export function useProviders() {
  const [providers] = useState<Provider[]>(MOCK_PROVIDERS);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const getById = (id: string) => providers.find(p => p.id === id);

  const filter = (rubro?: string, region?: string, maxRisk?: string) => {
    return providers.filter(p => {
      if (rubro && !p.rubro.includes(rubro)) return false;
      if (region && p.region !== region) return false;
      if (maxRisk === 'Bajo' && p.risk !== 'Bajo') return false;
      if (maxRisk === 'Medio' && p.risk === 'Alto') return false;
      return true;
    });
  };

  return { providers, selected, toggleSelect, setSelected, getById, filter };
}
