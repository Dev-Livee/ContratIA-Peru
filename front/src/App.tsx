import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';

import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import AuthLayout from '@/components/Layout/AuthLayout';
import EntidadLayout from '@/components/Layout/EntidadLayout';
import EmpresaLayout from '@/components/Layout/EmpresaLayout';

// Public pages (no auth)
import Landing from '@/pages/public/Landing';
import ObrasBusqueda from '@/pages/public/ObrasBusqueda';
import ObraDetalle from '@/pages/public/ObraDetalle';

// Auth pages
import Login from '@/pages/auth/Login';
import Registro from '@/pages/auth/Registro';

// Entity pages
import EntidadDashboard from '@/pages/entidad/Dashboard';
import EntidadProyectos from '@/pages/entidad/Proyectos';
import ProyectoNuevo from '@/pages/entidad/ProyectoNuevo';
import ProyectoDetalle from '@/pages/entidad/ProyectoDetalle';
import Proveedores from '@/pages/entidad/Proveedores';

// Company pages
import EmpresaDashboard from '@/pages/empresa/Dashboard';
import EmpresaPerfil from '@/pages/empresa/Perfil';
import EmpresaProyectos from '@/pages/empresa/Proyectos';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ── Public (no auth required) ── */}
          <Route path="/" element={<Landing />} />
          <Route path="/obras" element={<ObrasBusqueda />} />
          <Route path="/obras/:id" element={<ObraDetalle />} />

          {/* ── Auth pages ── */}
          <Route element={<AuthLayout />}>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/registro" element={<Registro />} />
          </Route>

          {/* ── Entity (protected) ── */}
          <Route element={<ProtectedRoute allowedRoles={['entity']} />}>
            <Route element={<EntidadLayout />}>
              <Route path="/entidad/dashboard" element={<EntidadDashboard />} />
              <Route path="/entidad/proyectos" element={<EntidadProyectos />} />
              <Route path="/entidad/proyectos/nuevo" element={<ProyectoNuevo />} />
              <Route path="/entidad/proyectos/:id" element={<ProyectoDetalle />} />
              <Route path="/entidad/proveedores" element={<Proveedores />} />
              <Route path="/entidad" element={<Navigate to="/entidad/dashboard" replace />} />
            </Route>
          </Route>

          {/* ── Company (protected) ── */}
          <Route element={<ProtectedRoute allowedRoles={['company']} />}>
            <Route element={<EmpresaLayout />}>
              <Route path="/empresa/dashboard" element={<EmpresaDashboard />} />
              <Route path="/empresa/perfil" element={<EmpresaPerfil />} />
              <Route path="/empresa/proyectos" element={<EmpresaProyectos />} />
              <Route path="/empresa" element={<Navigate to="/empresa/dashboard" replace />} />
            </Route>
          </Route>

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
