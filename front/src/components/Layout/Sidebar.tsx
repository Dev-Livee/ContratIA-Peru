import { Box, VStack, Text, Divider, Flex, Icon, HStack } from '@chakra-ui/react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FiHome, FiFolder, FiSearch, FiBarChart2, FiUser,
  FiAward, FiFileText, FiMapPin, FiCode,
} from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const ENTITY_NAV: NavItem[] = [
  { label: 'Dashboard', path: '/entidad', icon: FiHome },
  { label: 'Mis proyectos', path: '/entidad/proyectos', icon: FiFolder },
  { label: 'Nuevo proyecto', path: '/entidad/proyectos/nuevo', icon: FiFileText },
  { label: 'Buscar proveedores', path: '/entidad/proveedores', icon: FiSearch },
  { label: 'Comparar proveedores', path: '/entidad/comparar', icon: FiBarChart2 },
];

const COMPANY_NAV: NavItem[] = [
  { label: 'Dashboard', path: '/empresa', icon: FiHome },
  { label: 'Mi perfil', path: '/empresa/perfil', icon: FiUser },
  { label: 'Certificaciones', path: '/empresa/certificaciones', icon: FiAward },
  { label: 'Historial', path: '/empresa/historial', icon: FiBarChart2 },
];

const CITIZEN_NAV: NavItem[] = [
  { label: 'Buscar por distrito', path: '/ciudadano', icon: FiMapPin },
  { label: 'Buscar por código', path: '/ciudadano/codigo', icon: FiCode },
];

export function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { user } = useAuth();
  const location = useLocation();

  const navItems =
    user?.role === 'entity' ? ENTITY_NAV :
    user?.role === 'company' ? COMPANY_NAV :
    CITIZEN_NAV;

  return (
    <VStack spacing={0} align="stretch" h="100%">
      <VStack spacing={1} p={3} align="stretch" flex={1}>
        {navItems.map(item => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/entidad' && item.path !== '/empresa' && item.path !== '/ciudadano' && location.pathname.startsWith(item.path));
          return (
            <NavLink key={item.path} to={item.path} onClick={onClose}>
              <Flex
                align="center"
                px={3}
                py={2.5}
                borderRadius="md"
                bg={isActive ? 'brand.light' : 'transparent'}
                color={isActive ? 'brand.primaryDark' : 'gray.600'}
                fontWeight={isActive ? '600' : '400'}
                _hover={{ bg: isActive ? 'brand.light' : 'gray.100', color: isActive ? 'brand.primaryDark' : 'gray.800' }}
                transition="all 0.15s"
                gap={3}
              >
                <Icon as={item.icon} boxSize={5} />
                <Text fontSize="sm">{item.label}</Text>
              </Flex>
            </NavLink>
          );
        })}
      </VStack>

      <Divider borderColor="gray.200" />
      <Box p={4}>
        <Text fontSize="xs" color="gray.400" textAlign="center">
          Minda Code © 2024
        </Text>
      </Box>
    </VStack>
  );
}

export default function Sidebar() {
  return (
    <Box
      as="aside"
      w="256px"
      minH="calc(100vh - 64px)"
      bg="white"
      borderRightWidth="1px"
      borderColor="gray.200"
      display={{ base: 'none', md: 'flex' }}
      flexDirection="column"
      position="sticky"
      top="64px"
      h="calc(100vh - 64px)"
      overflowY="auto"
    >
      <SidebarContent />
    </Box>
  );
}
