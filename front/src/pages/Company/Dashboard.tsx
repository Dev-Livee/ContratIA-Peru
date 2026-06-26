import {
  Box, Button, Flex, Grid, Heading, HStack, Icon, Progress,
  SimpleGrid, Table, Tbody, Td, Text, Th, Thead, Tr, VStack, Badge,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiAward, FiBarChart2, FiCheckCircle, FiFileText, FiStar, FiTrendingUp } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import StatCard from '@/components/Common/StatCard';
import StatusBadge from '@/components/Common/StatusBadge';
import { formatCurrency, formatDate } from '@/utils/helpers';

const MOCK_EVALUATIONS = [
  { id: '1', project: 'Mejoramiento de pistas Av. Principal', entity: 'Municipalidad de Lima', status: 'Adjudicado', budget: 2500000, date: '2024-01-15', score: 94 },
  { id: '2', project: 'Construcción parque Los Jardines', entity: 'Municipalidad San Borja', status: 'En ejecución', budget: 850000, date: '2024-02-20', score: 88 },
  { id: '3', project: 'Centro de salud comunal', entity: 'DIRESA Lima', status: 'Finalizado', budget: 1200000, date: '2023-10-05', score: 91 },
  { id: '4', project: 'Sistema de iluminación LED', entity: 'Municipalidad Miraflores', status: 'Finalizado', budget: 430000, date: '2023-06-12', score: 96 },
];

export default function CompanyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <VStack spacing={6} align="stretch">
      <Flex justify="space-between" align={{ base: 'flex-start', md: 'center' }} gap={3} flexWrap="wrap">
        <Box>
          <Heading size="lg" color="gray.800" fontWeight="700">Dashboard</Heading>
          <Text color="gray.500" fontSize="sm" mt={0.5}>{user?.organizationName ?? user?.name}</Text>
        </Box>
        <Button leftIcon={<Icon as={FiFileText} />} bg="brand.primaryDark" color="white" _hover={{ bg: 'brand.800' }} borderRadius="md" onClick={() => navigate('/empresa/perfil')}>
          Actualizar perfil
        </Button>
      </Flex>

      {/* Stats */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4}>
        <StatCard label="Proyectos totales" value={MOCK_EVALUATIONS.length} icon={FiFileText} change={8} />
        <StatCard label="Adjudicados" value={MOCK_EVALUATIONS.filter(e => e.status === 'Adjudicado').length} icon={FiAward} iconBg="green.50" iconColor="green.600" />
        <StatCard label="En ejecución" value={MOCK_EVALUATIONS.filter(e => e.status === 'En ejecución').length} icon={FiTrendingUp} iconBg="blue.50" iconColor="blue.600" />
        <StatCard label="Score promedio IA" value="92/100" icon={FiStar} iconBg="yellow.50" iconColor="yellow.500" helpText="Basado en historial" />
      </SimpleGrid>

      {/* Performance card */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
        <Box bg="white" borderRadius="lg" p={5} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
          <Text fontSize="sm" color="gray.500" mb={1}>Tasa de adjudicación</Text>
          <Text fontSize="2xl" fontWeight="700" color="brand.primaryDark">68%</Text>
          <Progress value={68} colorScheme="green" size="sm" borderRadius="full" mt={2} />
        </Box>
        <Box bg="white" borderRadius="lg" p={5} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
          <Text fontSize="sm" color="gray.500" mb={1}>Proyectos a tiempo</Text>
          <Text fontSize="2xl" fontWeight="700" color="blue.600">85%</Text>
          <Progress value={85} colorScheme="blue" size="sm" borderRadius="full" mt={2} />
        </Box>
        <Box bg="white" borderRadius="lg" p={5} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
          <Text fontSize="sm" color="gray.500" mb={1}>Nivel de riesgo</Text>
          <HStack spacing={2} mt={1}>
            <Text fontSize="2xl" fontWeight="700" color="green.600">Bajo</Text>
            <Badge colorScheme="green" variant="subtle">Verificado</Badge>
          </HStack>
        </Box>
      </Grid>

      {/* History table */}
      <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.100" overflow="hidden">
        <Flex px={6} py={4} justify="space-between" align="center" borderBottomWidth="1px" borderColor="gray.100">
          <Heading size="sm" color="gray.800" fontWeight="600">Historial de evaluaciones</Heading>
          <Button variant="ghost" size="sm" color="brand.primary" rightIcon={<Icon as={FiBarChart2} />} onClick={() => navigate('/empresa/historial')}>
            Ver completo
          </Button>
        </Flex>
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead bg="gray.50">
              <Tr>
                <Th textTransform="none" fontSize="xs" color="gray.500">Proyecto</Th>
                <Th textTransform="none" fontSize="xs" color="gray.500">Entidad</Th>
                <Th textTransform="none" fontSize="xs" color="gray.500">Estado</Th>
                <Th textTransform="none" fontSize="xs" color="gray.500">Monto</Th>
                <Th textTransform="none" fontSize="xs" color="gray.500">Score IA</Th>
                <Th textTransform="none" fontSize="xs" color="gray.500">Fecha</Th>
              </Tr>
            </Thead>
            <Tbody>
              {MOCK_EVALUATIONS.map(e => (
                <Tr key={e.id} _hover={{ bg: 'gray.50' }}>
                  <Td><Text fontSize="sm" fontWeight="500" color="gray.800" maxW="200px" noOfLines={1}>{e.project}</Text></Td>
                  <Td><Text fontSize="sm" color="gray.600">{e.entity}</Text></Td>
                  <Td><StatusBadge status={e.status} size="sm" /></Td>
                  <Td><Text fontSize="sm">{formatCurrency(e.budget)}</Text></Td>
                  <Td>
                    <HStack spacing={1}>
                      <Text fontSize="sm" fontWeight="600" color={e.score >= 90 ? 'green.600' : e.score >= 75 ? 'orange.500' : 'red.500'}>{e.score}</Text>
                      <Text fontSize="xs" color="gray.400">/100</Text>
                    </HStack>
                  </Td>
                  <Td><Text fontSize="sm" color="gray.500">{formatDate(e.date)}</Text></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </VStack>
  );
}
