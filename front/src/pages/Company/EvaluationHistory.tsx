import {
  Box, Flex, Heading, HStack, Icon, Progress, Select, SimpleGrid,
  Table, Tbody, Td, Text, Th, Thead, Tr, VStack, Badge,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiStar, FiTrendingUp } from 'react-icons/fi';
import StatusBadge from '@/components/Common/StatusBadge';
import { formatCurrency, formatDate } from '@/utils/helpers';

const HISTORY = [
  { id: '1', project: 'Mejoramiento pistas Av. Principal', entity: 'Municipalidad Lima', rubro: 'Infraestructura vial', budget: 2500000, status: 'En ejecución', score: 94, date: '2024-01-15', onTime: true, comment: 'Excelente organización y cumplimiento de plazos.' },
  { id: '2', project: 'Construcción parque Los Jardines', entity: 'Municipalidad San Borja', rubro: 'Medio ambiente', budget: 850000, status: 'Adjudicado', score: 88, date: '2024-02-20', onTime: true, comment: 'Propuesta técnica sólida.' },
  { id: '3', project: 'Centro de salud comunal Sector 4', entity: 'DIRESA Lima', rubro: 'Salud', budget: 1200000, status: 'Finalizado', score: 91, date: '2023-10-05', onTime: true, comment: 'Entrega puntual y calidad superior a lo esperado.' },
  { id: '4', project: 'Sistema de iluminación LED municipal', entity: 'Municipalidad Miraflores', rubro: 'Tecnología', budget: 430000, status: 'Finalizado', score: 96, date: '2023-06-12', onTime: true, comment: 'Proyecto modelo, excelente ejecución.' },
  { id: '5', project: 'Rehabilitación colegio N° 5043', entity: 'UGEL 01', rubro: 'Educación', budget: 780000, status: 'Finalizado', score: 79, date: '2022-11-20', onTime: false, comment: 'Pequeño retraso en etapa final por lluvias.' },
];

export default function EvaluationHistory() {
  const [yearFilter, setYearFilter] = useState('');
  const [rubroFilter, setRubroFilter] = useState('');

  const filtered = HISTORY.filter(h => {
    const matchYear = !yearFilter || h.date.startsWith(yearFilter);
    const matchRubro = !rubroFilter || h.rubro === rubroFilter;
    return matchYear && matchRubro;
  });

  const avgScore = Math.round(filtered.reduce((a, b) => a + b.score, 0) / (filtered.length || 1));
  const onTimeRate = Math.round((filtered.filter(h => h.onTime).length / (filtered.length || 1)) * 100);
  const rubros = [...new Set(HISTORY.map(h => h.rubro))];

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="lg" color="gray.800" fontWeight="700">Historial de evaluaciones</Heading>
        <Text color="gray.500" fontSize="sm">Registro completo de participaciones y resultados</Text>
      </Box>

      {/* Summary stats */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4}>
        <Box bg="white" borderRadius="lg" p={5} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
          <Text fontSize="sm" color="gray.500" mb={1}>Score IA promedio</Text>
          <HStack align="baseline" spacing={1}>
            <Text fontSize="2xl" fontWeight="700" color={avgScore >= 90 ? 'green.600' : avgScore >= 75 ? 'orange.500' : 'red.500'}>{avgScore}</Text>
            <Text fontSize="sm" color="gray.400">/100</Text>
          </HStack>
          <Progress value={avgScore} colorScheme={avgScore >= 90 ? 'green' : avgScore >= 75 ? 'orange' : 'red'} size="xs" borderRadius="full" mt={2} />
        </Box>
        <Box bg="white" borderRadius="lg" p={5} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
          <Text fontSize="sm" color="gray.500" mb={1}>Proyectos completados</Text>
          <Text fontSize="2xl" fontWeight="700" color="gray.800">{HISTORY.filter(h => h.status === 'Finalizado').length}</Text>
        </Box>
        <Box bg="white" borderRadius="lg" p={5} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
          <Text fontSize="sm" color="gray.500" mb={1}>Tasa cumplimiento</Text>
          <Text fontSize="2xl" fontWeight="700" color="blue.600">{onTimeRate}%</Text>
          <Progress value={onTimeRate} colorScheme="blue" size="xs" borderRadius="full" mt={2} />
        </Box>
        <Box bg="white" borderRadius="lg" p={5} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
          <Text fontSize="sm" color="gray.500" mb={1}>Monto total adjudicado</Text>
          <Text fontSize="2xl" fontWeight="700" color="gray.800">S/ 5.76M</Text>
        </Box>
      </SimpleGrid>

      {/* Filters */}
      <Box bg="white" borderRadius="lg" p={4} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
        <HStack spacing={3} flexWrap="wrap">
          <Select placeholder="Todos los años" value={yearFilter} onChange={e => setYearFilter(e.target.value)} maxW="160px" focusBorderColor="brand.primary" size="sm">
            {['2024', '2023', '2022'].map(y => <option key={y} value={y}>{y}</option>)}
          </Select>
          <Select placeholder="Todos los rubros" value={rubroFilter} onChange={e => setRubroFilter(e.target.value)} maxW="220px" focusBorderColor="brand.primary" size="sm">
            {rubros.map(r => <option key={r} value={r}>{r}</option>)}
          </Select>
        </HStack>
      </Box>

      {/* Table */}
      <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.100" overflow="hidden">
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead bg="gray.50">
              <Tr>
                <Th textTransform="none" fontSize="xs" color="gray.500">Proyecto</Th>
                <Th textTransform="none" fontSize="xs" color="gray.500">Entidad</Th>
                <Th textTransform="none" fontSize="xs" color="gray.500">Estado</Th>
                <Th textTransform="none" fontSize="xs" color="gray.500">Monto</Th>
                <Th textTransform="none" fontSize="xs" color="gray.500">Score IA</Th>
                <Th textTransform="none" fontSize="xs" color="gray.500">A tiempo</Th>
                <Th textTransform="none" fontSize="xs" color="gray.500">Fecha</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map(h => (
                <Tr key={h.id} _hover={{ bg: 'gray.50' }}>
                  <Td>
                    <Text fontSize="sm" fontWeight="500" color="gray.800" maxW="220px" noOfLines={1}>{h.project}</Text>
                    <Text fontSize="xs" color="gray.400">{h.rubro}</Text>
                  </Td>
                  <Td><Text fontSize="sm" color="gray.600" maxW="150px" noOfLines={1}>{h.entity}</Text></Td>
                  <Td><StatusBadge status={h.status} size="sm" /></Td>
                  <Td><Text fontSize="sm">{formatCurrency(h.budget)}</Text></Td>
                  <Td>
                    <HStack spacing={1}>
                      <Icon as={FiStar} color="yellow.400" boxSize={3} />
                      <Text fontSize="sm" fontWeight="600" color={h.score >= 90 ? 'green.600' : h.score >= 75 ? 'orange.500' : 'red.500'}>{h.score}</Text>
                    </HStack>
                  </Td>
                  <Td>
                    <Badge colorScheme={h.onTime ? 'green' : 'red'} variant="subtle" borderRadius="full" fontSize="xs">
                      {h.onTime ? 'Sí' : 'No'}
                    </Badge>
                  </Td>
                  <Td><Text fontSize="sm" color="gray.500">{formatDate(h.date)}</Text></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </VStack>
  );
}
