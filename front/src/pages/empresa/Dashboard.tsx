import {
  Box, Button, Flex, Heading, HStack, Icon, Progress, SimpleGrid, Skeleton,
  Table, Tbody, Td, Text, Th, Thead, Tr, VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiAward, FiFileText, FiStar, FiTrendingUp } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useEmpresaPerfil } from '@/components/hooks/useObras';
import StatusBadge from '@/components/Common/StatusBadge';
import { formatCurrency } from '@/utils/helpers';

const MOCK_PROYECTOS = [
  { id: '1', nombre: 'Mejoramiento de pistas Av. Principal', entidad: 'Municipalidad Miraflores', status: 'En ejecución', avance: 75, monto: 2450000, score: 92 },
  { id: '2', nombre: 'Parque recreativo Los Jardines', entidad: 'Municipalidad San Borja', status: 'Adjudicado', avance: 10, monto: 850000, score: 88 },
];

function StatBox({ label, value, icon, bg = 'brand.100', iconColor = 'brand.700', isLoading }: any) {
  return (
    <Box bg="white" borderRadius="xl" p={5} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
      <Flex justify="space-between" align="flex-start">
        <Box>
          <Text fontSize="xs" color="gray.500" fontWeight="500" mb={1}>{label}</Text>
          {isLoading ? <Skeleton h="28px" w="40px" /> : <Text fontSize="2xl" fontWeight="800" color="gray.800">{value}</Text>}
        </Box>
        <Box p={2.5} bg={bg} borderRadius="lg">
          <Icon as={icon} boxSize={5} color={iconColor} />
        </Box>
      </Flex>
    </Box>
  );
}

export default function EmpresaDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: perfil } = useEmpresaPerfil();
  const razonSocial = perfil?.razonSocial ?? user?.razonSocial;

  return (
    <VStack spacing={5} align="stretch">
      <Flex justify="space-between" align={{ base: 'flex-start', md: 'center' }} gap={3} flexWrap="wrap">
        <Box>
          <Heading size="lg" color="gray.800" fontWeight="700">Dashboard</Heading>
          <Text color="gray.500" fontSize="sm">{razonSocial}</Text>
        </Box>
        <Button variant="outline" onClick={() => navigate('/empresa/perfil')}>
          Actualizar perfil
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4}>
        <StatBox label="Proyectos activos" value={MOCK_PROYECTOS.length} icon={FiFileText} />
        <StatBox label="Evaluaciones recibidas" value={8} icon={FiStar} bg="yellow.100" iconColor="yellow.600" />
        <StatBox label="Score IA promedio" value="92/100" icon={FiAward} bg="green.100" iconColor="green.600" />
      </SimpleGrid>

      {/* Performance */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        {[
          { label: 'Tasa de adjudicación', value: 68, color: 'brand' },
          { label: 'Proyectos a tiempo', value: 85, color: 'blue' },
          { label: 'Satisfacción entidades', value: 92, color: 'green' },
        ].map(m => (
          <Box key={m.label} bg="white" borderRadius="xl" p={4} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
            <Text fontSize="sm" color="gray.500" mb={1}>{m.label}</Text>
            <Text fontSize="2xl" fontWeight="700" color={`${m.color}.600`}>{m.value}%</Text>
            <Progress value={m.value} colorScheme={m.color} size="xs" borderRadius="full" mt={2} />
          </Box>
        ))}
      </SimpleGrid>

      {/* Projects table */}
      <Box bg="white" borderRadius="xl" borderWidth="1px" borderColor="gray.100" boxShadow="sm" overflow="hidden">
        <Flex px={6} py={4} justify="space-between" align="center" borderBottomWidth="1px" borderColor="gray.100">
          <Heading size="sm" color="gray.800" fontWeight="600">Proyectos activos</Heading>
          <Button variant="ghost" size="sm" onClick={() => navigate('/empresa/proyectos')}>Ver todos</Button>
        </Flex>
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead bg="gray.50">
              <Tr>
                <Th textTransform="none" fontSize="xs" color="gray.500">Proyecto</Th>
                <Th textTransform="none" fontSize="xs" color="gray.500">Entidad</Th>
                <Th textTransform="none" fontSize="xs" color="gray.500">Estado</Th>
                <Th textTransform="none" fontSize="xs" color="gray.500">Avance</Th>
                <Th textTransform="none" fontSize="xs" color="gray.500">Monto</Th>
              </Tr>
            </Thead>
            <Tbody>
              {MOCK_PROYECTOS.map(p => (
                <Tr key={p.id} _hover={{ bg: 'gray.50' }}>
                  <Td><Text fontSize="sm" fontWeight="500" color="gray.800" noOfLines={1} maxW="200px">{p.nombre}</Text></Td>
                  <Td><Text fontSize="sm" color="gray.600">{p.entidad}</Text></Td>
                  <Td><StatusBadge status={p.status} size="sm" /></Td>
                  <Td>
                    <HStack spacing={2}>
                      <Progress value={p.avance} size="xs" w="60px" colorScheme="brand" borderRadius="full" />
                      <Text fontSize="xs" color="gray.500">{p.avance}%</Text>
                    </HStack>
                  </Td>
                  <Td><Text fontSize="sm">{formatCurrency(p.monto)}</Text></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </VStack>
  );
}
