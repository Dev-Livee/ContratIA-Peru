import { createContext, useContext, useState, ReactNode } from 'react';

export interface Project {
  id: string;
  code: string;
  name: string;
  description: string;
  budget: number;
  rubro: string;
  district: string;
  deadline: string;
  status: string;
  progress: number;
  company?: string;
  companyId?: string;
  createdAt: string;
  requirements?: string;
}

interface ProjectContextType {
  projects: Project[];
  selectedProject: Project | null;
  setSelectedProject: (p: Project | null) => void;
  addProject: (p: Omit<Project, 'id' | 'code' | 'createdAt' | 'progress' | 'status'>) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const MOCK_PROJECTS: Project[] = [
  {
    id: '1', code: 'OBR-2024-001', name: 'Mejoramiento de pistas y veredas Av. Principal',
    description: 'Mejoramiento integral de infraestructura vial en Av. Principal cuadras 1-10.',
    budget: 2500000, rubro: 'Infraestructura vial', district: 'Miraflores', deadline: '2025-06-30',
    status: 'En ejecución', progress: 45, company: 'Construcciones ABC SAC', companyId: 'c1',
    createdAt: '2024-01-15',
  },
  {
    id: '2', code: 'OBR-2024-002', name: 'Construcción de parque recreativo Los Jardines',
    description: 'Construcción de parque con juegos infantiles, losas deportivas y jardines.',
    budget: 850000, rubro: 'Medio ambiente', district: 'San Borja', deadline: '2025-03-31',
    status: 'Adjudicado', progress: 10, company: 'Obras y Servicios XYZ', companyId: 'c2',
    createdAt: '2024-02-20',
  },
  {
    id: '3', code: 'OBR-2024-003', name: 'Instalación de sistema de agua potable sector norte',
    description: 'Instalación de redes de agua potable y alcantarillado en el sector norte.',
    budget: 3200000, rubro: 'Saneamiento', district: 'Comas', deadline: '2025-12-31',
    status: 'Evaluación', progress: 0, createdAt: '2024-03-10',
  },
  {
    id: '4', code: 'OBR-2023-015', name: 'Rehabilitación de colegio primario N° 5043',
    description: 'Rehabilitación completa de infraestructura del colegio, aulas y servicios.',
    budget: 1100000, rubro: 'Educación', district: 'Callao', deadline: '2024-11-30',
    status: 'Finalizado', progress: 100, company: 'Constructora Educativa Perú', companyId: 'c3',
    createdAt: '2023-08-01',
  },
];

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const addProject = (data: Omit<Project, 'id' | 'code' | 'createdAt' | 'progress' | 'status'>) => {
    const newProject: Project = {
      ...data,
      id: crypto.randomUUID(),
      code: `OBR-${new Date().getFullYear()}-${String(projects.length + 1).padStart(3, '0')}`,
      status: 'Evaluación',
      progress: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProjects(prev => [newProject, ...prev]);
  };

  const updateProject = (id: string, data: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  return (
    <ProjectContext.Provider value={{ projects, selectedProject, setSelectedProject, addProject, updateProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProjects must be used within ProjectProvider');
  return ctx;
}
