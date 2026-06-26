import {
  Box, Button, Flex, Grid, Heading, HStack, Icon, Progress, SimpleGrid,
  Skeleton, SkeletonText, Table, Tbody, Td, Text, Th, Thead, Tr, VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiFolder, FiPlus, FiSearch, FiTrendingUp } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useProyectosEntidad } from '@/components/hooks/useObras';
import StatusBadge from '@/components/Common/StatusBadge';
import { SkeletonTable } from '@/components/Common/SkeletonCard';
import { formatCurrency } from '@/utils/helpers';

function StatCard({ label, value, icon, bg = 'brand.100', iconColor = 'brand.700', isLoading }: {
  label: string; value: number; icon: React.ElementType;
  bg?: string; iconColor?: string; isLoading?: boolean;
}) {
  return (
    <Box bg="white" borderRadius="xl" p={5} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
      <Flex justify="space-between" align="flex-start">
        <Box>
          <Text fontSize="xs" color="gray.500" fontWeight="500" mb={1}>{label}</Text>
          {isLoading
            ? <Skeleton h="32px" w="48px" borderRadius="md" />
            : <Text fontSize="2xl" fontWeight="800" color="gray.800">{value}</Text>}
        </Box>
        <Box p={2.5} bg={bg} borderRadius="lg">
          <Icon as={icon} boxSize={5} color={iconColor} />
        </Box>
      </Flex>
    </Box>
  );
}

export default function EntidadDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: obras, isLoading } = useProyectosEntidad();

  const stats = {
    total: obras?.length ?? 0,
    evaluacion: obras?.filter(o => o.estado === 'EN_EVALUACION').length ?? 0,
    adjudicado: obras?.filter(o => o.estado === 'ADJUDICADO').length ?? 0,
    ejecucion: obras?.filter(o => o.estado === 'EN_EJECUCION').length ?? 0,
  };

  return (
    <VStack spacing={6} align="stretch">
      <Flex justify="space-between" align={{ base: 'flex-start', md: 'center' }} gap={3} flexWrap="wrap">
        <Box>
          <Heading size="lg" color="gray.800" fontWeight="700">Dashboard</Heading>
          <Text color="gray.500" fontSize="sm" mt={0.5}>
            {user?.razonSocial ?? user?.name}
          </Text>
        </Box>
        <Button leftIcon={<Icon as={FiPlus} />} onClick={() => navigate('/entidad/proyectos/nuevo')}>
          Crear nuevo proyecto
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4}>
        <StatCard label="Total proyectos" value={stats.total} icon={FiFolder} isLoading={isLoading} />
        <StatCard label="En evaluación" value={stats.evaluacion} icon={FiClock} bg="yellow.100" iconColor="yellow.600" isLoading={isLoading} />
        <StatCard label="Adjudicados" value={stats.adjudicado} icon={FiCheckCircle} bg="blue.100" iconColor="blue.600" isLoading={isLoading} />
        <StatCard label="En ejecución" value={stats.ejecucion} icon={FiTrendingUp} isLoading={isLoading} />
      </SimpleGrid>

      {isLoading ? <SkeletonTable rows={4} /> : (
        <Box bg="white" borderRadius="xl" borderWidth="1px" borderColor="gray.100" boxShadow="sm" overflow="hidden">
          <Flex px={6} py={4} justify="space-between" align="center" borderBottomWidth="1px" borderColor="gray.100">
            <Heading size="sm" color="gray.800" fontWeight="600">Últimos proyectos</Heading>
            <Button variant="ghost" size="sm" rightIcon={<Icon as={FiSearch} />} onClick={() => navigate('/entidad/proyectos')}>
              Ver todos
            </Button>
          </Flex>
          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead bg="gray.50">
                <Tr>
                  <Th textTransform="none" fontSize="xs" color="gray.500">Nombre</Th>
                  <Th textTransform="none" fontSize="xs" color="gray.500">Estado</Th>
                  <Th textTransform="none" fontSize="xs" color="gray.500">Empresa</Th>
                  <Th textTransform="none" fontSize="xs" color="gray.500">Avance</Th>
                  <Th textTransform="none" fontSize="xs" color="gray.500">Presupuesto</Th>
                  <Th />
                </Tr>
              </Thead>
              <Tbody>
                {(obras ?? []).slice(0, 5).map(o => (
                  <Tr key={o.id} _hover={{ bg: 'gray.50' }} cursor="pointer"
                    onClick={() => navigate(`/entidad/proyectos/${o.id}`)}>
                    <Td>
                      <Text fontSize="sm" fontWeight="500" color="gray.800" maxW="220px" noOfLines={1}>{o.titulo}</Text>
                      <Text fontSize="xs" color="gray.400">{o.distrito}</Text>
                    </Td>
                    <Td><StatusBadge status={o.estado} size="sm" /></Td>
                    <Td><Text fontSize="sm" color="gray.600" noOfLines={1} maxW="160px">—</Text></Td>
                    <Td minW="130px">
                      <VStack spacing={1} align="start">
                        <Text fontSize="xs" color="gray.500">{o.avanceFisico ?? 0}%</Text>
                        <Progress value={o.avanceFisico ?? 0} size="xs" w="110px" colorScheme="brand" borderRadius="full" />
                      </VStack>
                    </Td>
                    <Td><Text fontSize="sm">{formatCurrency(o.presupuesto)}</Text></Td>
                    <Td onClick={e => e.stopPropagation()}>
                      <Button size="xs" variant="ghost" color="brand.700"
                        onClick={() => navigate(`/entidad/proyectos/${o.id}`)}>
                        Gestionar
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      )}

      {/* Quick actions */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
        {[
          { icon: FiSearch, title: 'Buscar proveedores', desc: 'Encuentra empresas calificadas con análisis IA', path: '/entidad/proveedores', bg: 'brand.100', color: 'brand.700' },
          { icon: FiTrendingUp, title: 'Ver obras públicas', desc: 'Consulta el estado de obras en tu zona', path: '/obras', bg: 'blue.50', color: 'blue.600' },
        ].map(a => (
          <Box key={a.title} bg={a.bg} borderRadius="xl" p={5} cursor="pointer"
            _hover={{ filter: 'brightness(0.97)' }} transition="filter 0.15s"
            onClick={() => navigate(a.path)}>
            <HStack spacing={4}>
              <Box p={3} bg="white" borderRadius="lg" flexShrink={0}>
                <Icon as={a.icon} boxSize={5} color={a.color} />
              </Box>
              <Box>
                <Text fontWeight="600" color="gray.800" fontSize="sm">{a.title}</Text>
                <Text fontSize="xs" color="gray.600" mt={0.5}>{a.desc}</Text>
              </Box>
            </HStack>
          </Box>
        ))}
      </Grid>
    </VStack>
  );
}
