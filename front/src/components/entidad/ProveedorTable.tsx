import {
  Box, Checkbox, HStack, Icon, Table, Tbody, Td, Text, Th, Thead, Tr, VStack,
} from '@chakra-ui/react';
import { FiStar } from 'react-icons/fi';
import type { Proveedor } from '@/components/hooks/useProveedores';
import RiskScoreBadge from '@/components/Common/RiskScoreBadge';
import EmptyState from '@/components/Common/EmptyState';
import { FiSearch } from 'react-icons/fi';

interface Props {
  proveedores: Proveedor[];
  selected: string[];
  onToggle: (id: string) => void;
}

export default function ProveedorTable({ proveedores, selected, onToggle }: Props) {
  if (proveedores.length === 0) {
    return <EmptyState icon={FiSearch} title="No se encontraron proveedores" description="Prueba cambiando los filtros." />;
  }

  return (
    <Box bg="white" borderRadius="xl" borderWidth="1px" borderColor="gray.100" boxShadow="sm" overflow="hidden">
      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead bg="gray.50">
            <Tr>
              <Th w="40px" />
              <Th textTransform="none" fontSize="xs" color="gray.500">Empresa</Th>
              <Th textTransform="none" fontSize="xs" color="gray.500">Risk Score</Th>
              <Th textTransform="none" fontSize="xs" color="gray.500">Contratos</Th>
              <Th textTransform="none" fontSize="xs" color="gray.500">Experiencia</Th>
              <Th textTransform="none" fontSize="xs" color="gray.500">Especializ.</Th>
            </Tr>
          </Thead>
          <Tbody>
            {proveedores.map(p => (
              <Tr key={p.id} _hover={{ bg: 'gray.50' }}>
                <Td>
                  <Checkbox
                    isChecked={selected.includes(p.id)}
                    onChange={() => onToggle(p.id)}
                    colorScheme="brand"
                    isDisabled={!selected.includes(p.id) && selected.length >= 3}
                  />
                </Td>
                <Td>
                  <Text fontWeight="500" color="gray.800" fontSize="sm">{p.nombre}</Text>
                  <Text fontSize="xs" color="gray.400">RUC {p.ruc} · {p.region}</Text>
                </Td>
                <Td><RiskScoreBadge score={p.riskScore} /></Td>
                <Td><Text fontSize="sm">{p.contratos}</Text></Td>
                <Td><Text fontSize="sm">{p.experiencia} años</Text></Td>
                <Td>
                  <HStack spacing={0.5}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Icon key={i} as={FiStar} boxSize={3} color={i < Math.round(p.rating) ? 'yellow.400' : 'gray.200'} />
                    ))}
                    <Text fontSize="xs" color="gray.500" ml={1}>{p.rating.toFixed(1)}</Text>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Box px={4} py={2} bg="gray.50" borderTopWidth="1px" borderColor="gray.100">
        <Text fontSize="xs" color="gray.400">Selecciona hasta 3 empresas para comparar · {selected.length}/3 seleccionadas</Text>
      </Box>
    </Box>
  );
}
