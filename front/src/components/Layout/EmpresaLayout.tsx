import {
  Avatar, Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent,
  DrawerHeader, DrawerOverlay, Flex, HStack, Icon, Menu, MenuButton,
  MenuDivider, MenuItem, MenuList, Text, useDisclosure, VStack,
} from '@chakra-ui/react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiBarChart2, FiFolder, FiHome, FiLogOut, FiMenu, FiSettings, FiUser } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

const NAV = [
  { label: 'Dashboard', path: '/empresa/dashboard', icon: FiHome },
  { label: 'Mi perfil', path: '/empresa/perfil', icon: FiUser },
  { label: 'Proyectos', path: '/empresa/proyectos', icon: FiFolder },
];

function SidebarNav({ onClose }: { onClose?: () => void }) {
  const location = useLocation();
  return (
    <VStack spacing={1} align="stretch" p={3} flex={1}>
      {NAV.map(item => {
        const isActive = location.pathname === item.path ||
          (item.path !== '/empresa/dashboard' && location.pathname.startsWith(item.path));
        return (
          <NavLink key={item.path} to={item.path} onClick={onClose}>
            <Flex
              align="center" gap={3} px={3} py={2.5} borderRadius="md"
              bg={isActive ? 'brand.100' : 'transparent'}
              color={isActive ? 'brand.800' : 'gray.600'}
              fontWeight={isActive ? '600' : '400'}
              _hover={{ bg: isActive ? 'brand.100' : 'gray.100' }}
              transition="all 0.15s"
            >
              <Icon as={item.icon} boxSize={5} />
              <Text fontSize="sm">{item.label}</Text>
            </Flex>
          </NavLink>
        );
      })}
    </VStack>
  );
}

export default function EmpresaLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogout = () => { logout(); navigate('/auth/login'); };

  return (
    <Flex direction="column" minH="100vh">
      <Flex
        as="header" h="64px" px={{ base: 4, md: 6 }} bg="white"
        borderBottomWidth="1px" borderColor="gray.200"
        align="center" position="sticky" top={0} zIndex={100}
      >
        <Button display={{ base: 'flex', md: 'none' }} variant="ghost" mr={3} aria-label="Menú" onClick={onOpen} p={2}>
          <Icon as={FiMenu} boxSize={5} color="gray.600" />
        </Button>
        <HStack spacing={2} flex={1}>
          <Flex w="32px" h="32px" bg="brand.800" borderRadius="md" align="center" justify="center">
            <Text color="white" fontWeight="800" fontSize="sm">C</Text>
          </Flex>
          <Text fontWeight="700" color="brand.800" display={{ base: 'none', sm: 'block' }}>ContrataIA</Text>
        </HStack>
        <HStack spacing={3}>
          <Menu>
            <MenuButton>
              <Avatar size="sm" name={user?.name} bg="brand.700" color="white" cursor="pointer" />
            </MenuButton>
            <MenuList shadow="md" borderColor="gray.200" fontSize="sm">
              <Box px={4} py={2}>
                <Text fontWeight="600">{user?.name}</Text>
                <Text fontSize="xs" color="gray.500">{user?.razonSocial}</Text>
              </Box>
              <MenuDivider />
              <MenuItem icon={<FiUser />} onClick={() => navigate('/empresa/perfil')}>Mi perfil</MenuItem>
              <MenuItem icon={<FiSettings />}>Configuración</MenuItem>
              <MenuDivider />
              <MenuItem icon={<FiLogOut />} color="red.500" onClick={handleLogout}>Cerrar sesión</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      <Flex flex={1}>
        <Box
          as="aside" w="240px" bg="white" borderRightWidth="1px" borderColor="gray.200"
          display={{ base: 'none', md: 'flex' }} flexDirection="column"
          position="sticky" top="64px" h="calc(100vh - 64px)" overflowY="auto"
        >
          <SidebarNav />
          <Box p={4} borderTopWidth="1px" borderColor="gray.100">
            <Text fontSize="xs" color="gray.400" textAlign="center">Minda Code © 2024</Text>
          </Box>
        </Box>
        <Box flex={1} p={{ base: 4, md: 6 }} minW={0}><Outlet /></Box>
      </Flex>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" borderColor="gray.200">
            <Text color="brand.800" fontWeight="700">ContrataIA Perú</Text>
          </DrawerHeader>
          <DrawerBody p={0}><SidebarNav onClose={onClose} /></DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}
