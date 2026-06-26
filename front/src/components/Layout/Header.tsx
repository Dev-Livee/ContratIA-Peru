import {
  Flex, Box, Text, Avatar, Menu, MenuButton, MenuList, MenuItem,
  MenuDivider, IconButton, useDisclosure, Drawer, DrawerBody,
  DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
  HStack, Badge, Icon,
} from '@chakra-ui/react';
import { FiLogOut, FiUser, FiSettings, FiMenu } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { SidebarContent } from './Sidebar';

const ROLE_LABELS: Record<string, string> = {
  entity: 'Entidad Pública',
  company: 'Empresa',
  citizen: 'Ciudadano',
};

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Flex
        as="header"
        h="64px"
        px={{ base: 4, md: 6 }}
        bg="white"
        borderBottomWidth="1px"
        borderColor="gray.200"
        align="center"
        position="sticky"
        top={0}
        zIndex={100}
      >
        {/* Mobile hamburger */}
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          aria-label="Abrir menú"
          icon={<Icon as={FiMenu} />}
          variant="ghost"
          onClick={onOpen}
          mr={3}
          color="gray.600"
        />

        {/* Logo */}
        <HStack spacing={2} flex={1}>
          <Box w="32px" h="32px" bg="brand.primaryDark" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
            <Text color="white" fontWeight="800" fontSize="sm">C</Text>
          </Box>
          <Text fontWeight="700" fontSize="lg" color="brand.primaryDark" display={{ base: 'none', sm: 'block' }}>
            ContrataIA
          </Text>
          <Text fontWeight="400" fontSize="sm" color="gray.500" display={{ base: 'none', md: 'block' }}>
            Perú
          </Text>
        </HStack>

        {/* Right side */}
        <HStack spacing={3}>
          {user && (
            <Badge colorScheme="green" variant="subtle" display={{ base: 'none', sm: 'inline-flex' }}>
              {ROLE_LABELS[user.role]}
            </Badge>
          )}
          <Menu>
            <MenuButton>
              <Avatar
                size="sm"
                name={user?.name}
                bg="brand.primaryDark"
                color="white"
                cursor="pointer"
              />
            </MenuButton>
            <MenuList shadow="md" borderColor="gray.200">
              <Box px={4} py={2}>
                <Text fontWeight="600" fontSize="sm" color="gray.800">{user?.name}</Text>
                <Text fontSize="xs" color="gray.500">{user?.email}</Text>
              </Box>
              <MenuDivider />
              <MenuItem icon={<FiUser />} onClick={() => navigate('/perfil')}>Mi perfil</MenuItem>
              <MenuItem icon={<FiSettings />} onClick={() => navigate('/configuracion')}>Configuración</MenuItem>
              <MenuDivider />
              <MenuItem icon={<FiLogOut />} color="red.500" onClick={handleLogout}>Cerrar sesión</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      {/* Mobile drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" borderColor="gray.200">
            <HStack>
              <Box w="28px" h="28px" bg="brand.primaryDark" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                <Text color="white" fontWeight="800" fontSize="xs">C</Text>
              </Box>
              <Text color="brand.primaryDark" fontWeight="700">ContrataIA Perú</Text>
            </HStack>
          </DrawerHeader>
          <DrawerBody p={0}>
            <SidebarContent onClose={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
