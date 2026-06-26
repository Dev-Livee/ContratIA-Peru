import {
  Box, Button, Flex, Heading, HStack, Icon, Progress, Table, Tbody, Td,
  Text, Th, Thead, Tr, VStack,
} from '@chakra-ui/react';
import { FiFolder } from 'react-icons/fi';
import StatusBadge from '@/components/Common/StatusBadge';
import EmptyState from '@/components/Common/EmptyState';
import { formatCurrency, formatDate } from '@/utils/helpers';

const MOCK = [
  { id: '1', nombre: 'Mejoramiento de pistas Av. Principal', entidad: 'Municipalidad Miraflores', status: 'En ejecución', avance: 75, monto: 2450000, inicio: '2025-03-15', fin: '2025-08-15', score: 92 },
  { id: '2', nombre: 'Parque recreativo Los Jardines', entidad: 'Municipalidad San Borja', status: 'Adjudicado', avance: 10, monto: 850000, inicio: '2025-02-01', fin: '2025-07-31', score: 88 },
  { id: '3', nombre: 'Centro de salud comunal', entidad: 'DIRESA Lima', status: 'Finalizado', avance: 100, monto: 1200000, inicio: '2024-03-01', fin: '2024-10-31', score: 91 },
];

export default function EmpresaProyectos() {
  return (
    <VStack spacing={5} align="stretch">
      <Box>
        <Heading size="lg" color="gray.800" fontWeight="700">Mis proyectos</Heading>
        <Text color="gray.500" fontSize="sm">{MOCK.length} proyecto(s)</Text>
      </Box>

      {MOCK.length === 0 ? (
        <EmptyState icon={FiFolder} title="Sin proyectos aún" description="Cuando seas adjudicado en un proyecto, aparecerá aquí." />
      ) : (
        <Box bg="white" borderRadius="xl" borderWidth="1px" borderColor="gray.100" boxShadow="sm" overflow="hidden">
          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead bg="gray.50">
                <Tr>
                  <Th textTransform="none" fontSize="xs" color="gray.500">Proyecto</Th>
                  <Th textTransform="none" fontSize="xs" color="gray.500">Entidad</Th>
                  <Th textTransform="none" fontSize="xs" color="gray.500">Estado</Th>
                  <Th textTransform="none" fontSize="xs" color="gray.500">Avance</Th>
                  <Th textTransform="none" fontSize="xs" color="gray.500">Monto</Th>
                  <Th textTransform="none" fontSize="xs" color="gray.500">Plazo</Th>
                  <Th textTransform="none" fontSize="xs" color="gray.500">Score IA</Th>
                </Tr>
              </Thead>
              <Tbody>
                {MOCK.map(p => (
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
                    <Td><Text fontSize="sm" color="gray.500">{formatDate(p.fin)}</Text></Td>
                    <Td>
                      <Text fontSize="sm" fontWeight="700" color={p.score >= 90 ? 'green.600' : p.score >= 75 ? 'orange.500' : 'red.500'}>
                        {p.score}/100
                      </Text>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      )}
    </VStack>
  );
}
