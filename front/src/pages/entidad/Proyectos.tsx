import {
  Box, Button, Flex, Heading, HStack, Icon, Input, InputGroup, InputLeftElement,
  Progress, Select, Table, Tbody, Td, Text, Th, Thead, Tr, VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { useObras } from '@/components/hooks/useObras';
import StatusBadge from '@/components/Common/StatusBadge';
import { SkeletonTable } from '@/components/Common/SkeletonCard';
import EmptyState from '@/components/Common/EmptyState';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { OBRA_STATUS, RUBROS } from '@/utils/constants';

export default function Proyectos() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [rubroFilter, setRubroFilter] = useState('');
  const { data: obras, isLoading } = useObras({ status: statusFilter, rubro: rubroFilter, search });

  return (
    <VStack spacing={5} align="stretch">
      <Flex justify="space-between" align={{ base: 'flex-start', md: 'center' }} flexWrap="wrap" gap={3}>
        <Box>
          <Heading size="lg" color="gray.800" fontWeight="700">Mis proyectos</Heading>
          <Text color="gray.500" fontSize="sm">{obras?.length ?? 0} proyecto(s)</Text>
        </Box>
        <Button leftIcon={<Icon as={FiPlus} />} onClick={() => navigate('/entidad/proyectos/nuevo')}>
          Nuevo proyecto
        </Button>
      </Flex>

      <Box bg="white" borderRadius="xl" p={4} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
        <HStack gap={3} flexWrap="wrap">
          <InputGroup maxW="300px" size="sm">
            <InputLeftElement><Icon as={FiSearch} color="gray.400" boxSize={3.5} /></InputLeftElement>
            <Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} />
          </InputGroup>
          <Select size="sm" placeholder="Todos los estados" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} maxW="180px">
            {Object.values(OBRA_STATUS).map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Select size="sm" placeholder="Todos los rubros" value={rubroFilter} onChange={e => setRubroFilter(e.target.value)} maxW="200px">
            {RUBROS.map(r => <option key={r} value={r}>{r}</option>)}
          </Select>
          {(search || statusFilter || rubroFilter) && (
            <Button size="sm" variant="ghost" color="gray.500" onClick={() => { setSearch(''); setStatusFilter(''); setRubroFilter(''); }}>
              Limpiar
            </Button>
          )}
        </HStack>
      </Box>

      {isLoading && <SkeletonTable rows={5} />}

      {!isLoading && (obras ?? []).length === 0 && (
        <EmptyState
          icon={FiSearch}
          title="No tienes proyectos aún"
          description="Crea tu primer proyecto de contratación."
          ctaLabel="+ Crear tu primer proyecto"
          onCta={() => navigate('/entidad/proyectos/nuevo')}
        />
      )}

      {!isLoading && (obras ?? []).length > 0 && (
        <Box bg="white" borderRadius="xl" borderWidth="1px" borderColor="gray.100" boxShadow="sm" overflow="hidden">
          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead bg="gray.50">
                <Tr>
                  <Th textTransform="none" fontSize="xs" color="gray.500">Código</Th>
                  <Th textTransform="none" fontSize="xs" color="gray.500">Proyecto</Th>
                  <Th textTransform="none" fontSize="xs" color="gray.500">Estado</Th>
                  <Th textTransform="none" fontSize="xs" color="gray.500">Empresa</Th>
                  <Th textTransform="none" fontSize="xs" color="gray.500">Avance</Th>
                  <Th textTransform="none" fontSize="xs" color="gray.500">Plazo</Th>
                  <Th />
                </Tr>
              </Thead>
              <Tbody>
                {(obras ?? []).map(o => (
                  <Tr key={o.id} _hover={{ bg: 'gray.50' }} cursor="pointer"
                    onClick={() => navigate(`/entidad/proyectos/${o.id}`)}>
                    <Td><Text fontSize="xs" fontFamily="mono" color="gray.400">{o.codigo}</Text></Td>
                    <Td>
                      <Text fontWeight="500" fontSize="sm" color="gray.800" maxW="200px" noOfLines={1}>{o.nombre}</Text>
                      <Text fontSize="xs" color="gray.400">{o.rubro} · {o.distrito}</Text>
                    </Td>
                    <Td><StatusBadge status={o.status} size="sm" /></Td>
                    <Td><Text fontSize="sm" color="gray.600" noOfLines={1} maxW="140px">{o.empresa || '—'}</Text></Td>
                    <Td minW="120px">
                      <VStack spacing={1} align="start">
                        <Text fontSize="xs" color="gray.500">{o.avance}%</Text>
                        <Progress value={o.avance} size="xs" w="90px" colorScheme="brand" borderRadius="full" />
                      </VStack>
                    </Td>
                    <Td><Text fontSize="sm" color="gray.500">{o.fechaFin ? formatDate(o.fechaFin) : '—'}</Text></Td>
                    <Td onClick={e => e.stopPropagation()}>
                      <HStack spacing={1}>
                        <Button size="xs" variant="ghost" color="brand.700" onClick={() => navigate(`/entidad/proyectos/${o.id}`)}>Ver</Button>
                        <Button size="xs" variant="ghost" color="gray.500">Editar</Button>
                      </HStack>
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
