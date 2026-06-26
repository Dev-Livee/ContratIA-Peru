import {
  Box, Button, Flex, Grid, Heading, HStack, Icon, Progress,
  SimpleGrid, Table, Tbody, Td, Text, Th, Thead, Tr, VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiFolder, FiPlus, FiSearch, FiTrendingUp, FiCheckCircle, FiClock } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useProjects } from '@/context/ProjectContext';
import StatCard from '@/components/Common/StatCard';
import StatusBadge from '@/components/Common/StatusBadge';
import { formatCurrency, formatDate } from '@/utils/helpers';

export default function EntityDashboard() {
  const { user } = useAuth();
  const { projects } = useProjects();
  const navigate = useNavigate();

  const stats = {
    total: projects.length,
    evaluation: projects.filter(p => p.status === 'Evaluación').length,
    awarded: projects.filter(p => p.status === 'Adjudicado').length,
    inProgress: projects.filter(p => p.status === 'En ejecución').length,
  };

  const recent = projects.slice(0, 5);

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <Flex justify="space-between" align={{ base: 'flex-start', md: 'center' }} gap={3} flexWrap="wrap">
        <Box>
          <Heading size="lg" color="gray.800" fontWeight="700">Dashboard</Heading>
          <Text color="gray.500" fontSize="sm" mt={0.5}>
            Bienvenido, {user?.organizationName ?? user?.name}
          </Text>
        </Box>
        <Button
          leftIcon={<Icon as={FiPlus} />}
          bg="brand.primaryDark"
          color="white"
          _hover={{ bg: 'brand.800' }}
          borderRadius="md"
          onClick={() => navigate('/entidad/proyectos/nuevo')}
        >
          Nuevo proyecto
        </Button>
      </Flex>

      {/* Stats */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4}>
        <StatCard label="Total proyectos" value={stats.total} icon={FiFolder} change={12} />
        <StatCard label="En evaluación" value={stats.evaluation} icon={FiClock} iconBg="blue.50" iconColor="blue.600" helpText="Pendiente de adjudicación" />
        <StatCard label="Adjudicados" value={stats.awarded} icon={FiCheckCircle} iconBg="green.50" iconColor="green.600" change={5} />
        <StatCard label="En ejecución" value={stats.inProgress} icon={FiTrendingUp} iconBg="orange.50" iconColor="orange.500" helpText="Obras activas" />
      </SimpleGrid>

      {/* Projects table */}
      <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.100" overflow="hidden">
        <Flex px={6} py={4} justify="space-between" align="center" borderBottomWidth="1px" borderColor="gray.100">
          <Heading size="sm" color="gray.800" fontWeight="600">Últimos proyectos</Heading>
          <Button
            variant="ghost"
            size="sm"
            color="brand.primary"
            rightIcon={<Icon as={FiSearch} />}
            onClick={() => navigate('/entidad/proyectos')}
          >
            Ver todos
          </Button>
        </Flex>
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead bg="gray.50">
              <Tr>
                <Th color="gray.500" fontWeight="600" textTransform="none" fontSize="xs">Código</Th>
                <Th color="gray.500" fontWeight="600" textTransform="none" fontSize="xs">Nombre</Th>
                <Th color="gray.500" fontWeight="600" textTransform="none" fontSize="xs">Estado</Th>
                <Th color="gray.500" fontWeight="600" textTransform="none" fontSize="xs">Presupuesto</Th>
                <Th color="gray.500" fontWeight="600" textTransform="none" fontSize="xs">Avance</Th>
                <Th color="gray.500" fontWeight="600" textTransform="none" fontSize="xs">Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {recent.map(p => (
                <Tr key={p.id} _hover={{ bg: 'gray.50' }} cursor="pointer" onClick={() => navigate(`/entidad/proyectos/${p.id}`)}>
                  <Td><Text fontSize="xs" color="gray.500" fontFamily="mono">{p.code}</Text></Td>
                  <Td>
                    <Text fontSize="sm" fontWeight="500" color="gray.800" maxW="200px" noOfLines={1}>{p.name}</Text>
                    <Text fontSize="xs" color="gray.400">{p.district}</Text>
                  </Td>
                  <Td><StatusBadge status={p.status} size="sm" /></Td>
                  <Td><Text fontSize="sm" color="gray.700">{formatCurrency(p.budget)}</Text></Td>
                  <Td minW="120px">
                    <VStack spacing={1} align="start">
                      <Text fontSize="xs" color="gray.500">{p.progress}%</Text>
                      <Progress value={p.progress} size="sm" w="100px" colorScheme="green" borderRadius="full" />
                    </VStack>
                  </Td>
                  <Td>
                    <HStack spacing={2} onClick={e => e.stopPropagation()}>
                      <Button size="xs" variant="ghost" color="brand.primary" onClick={() => navigate(`/entidad/proyectos/${p.id}`)}>Ver</Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>

      {/* Quick actions */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
        <Box
          bg="brand.light"
          borderRadius="lg"
          p={5}
          cursor="pointer"
          _hover={{ bg: 'brand.200' }}
          transition="background 0.15s"
          onClick={() => navigate('/entidad/proveedores')}
        >
          <HStack spacing={4}>
            <Box p={3} bg="white" borderRadius="md">
              <Icon as={FiSearch} boxSize={5} color="brand.primaryDark" />
            </Box>
            <Box>
              <Text fontWeight="600" color="brand.primaryDark">Buscar proveedores</Text>
              <Text fontSize="sm" color="brand.700">Encuentra empresas calificadas con IA</Text>
            </Box>
          </HStack>
        </Box>
        <Box
          bg="blue.50"
          borderRadius="lg"
          p={5}
          cursor="pointer"
          _hover={{ bg: 'blue.100' }}
          transition="background 0.15s"
          onClick={() => navigate('/entidad/comparar')}
        >
          <HStack spacing={4}>
            <Box p={3} bg="white" borderRadius="md">
              <Icon as={FiTrendingUp} boxSize={5} color="blue.600" />
            </Box>
            <Box>
              <Text fontWeight="600" color="blue.700">Comparar proveedores</Text>
              <Text fontSize="sm" color="blue.600">Análisis lado a lado de candidatos</Text>
            </Box>
          </HStack>
        </Box>
      </Grid>
    </VStack>
  );
}
