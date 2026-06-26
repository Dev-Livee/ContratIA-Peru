import {
  Box, Button, Flex, Heading, HStack, Icon, Input, InputGroup,
  InputLeftElement, Progress, Select, Table, Tbody, Td, Text,
  Th, Thead, Tr, VStack, Badge,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiPlus, FiFilter } from 'react-icons/fi';
import { useProjects } from '@/context/ProjectContext';
import StatusBadge from '@/components/Common/StatusBadge';
import { formatCurrency, formatDate } from '@/utils/helpers';

export default function ProjectList() {
  const { projects } = useProjects();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [rubroFilter, setRubroFilter] = useState('');

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || p.status === statusFilter;
    const matchRubro = !rubroFilter || p.rubro === rubroFilter;
    return matchSearch && matchStatus && matchRubro;
  });

  const rubros = [...new Set(projects.map(p => p.rubro))];

  return (
    <VStack spacing={6} align="stretch">
      <Flex justify="space-between" align={{ base: 'flex-start', md: 'center' }} flexWrap="wrap" gap={3}>
        <Box>
          <Heading size="lg" color="gray.800" fontWeight="700">Mis proyectos</Heading>
          <Text color="gray.500" fontSize="sm">{filtered.length} proyecto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</Text>
        </Box>
        <Button leftIcon={<Icon as={FiPlus} />} bg="brand.primaryDark" color="white" _hover={{ bg: 'brand.800' }} borderRadius="md" onClick={() => navigate('/entidad/proyectos/nuevo')}>
          Nuevo proyecto
        </Button>
      </Flex>

      {/* Filters */}
      <Box bg="white" borderRadius="lg" p={4} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
        <Flex gap={3} flexWrap="wrap">
          <InputGroup maxW="320px">
            <InputLeftElement><Icon as={FiSearch} color="gray.400" /></InputLeftElement>
            <Input placeholder="Buscar por nombre o código..." value={search} onChange={e => setSearch(e.target.value)} focusBorderColor="brand.primary" />
          </InputGroup>
          <Select placeholder="Todos los estados" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} maxW="200px" focusBorderColor="brand.primary">
            {['Borrador', 'Evaluación', 'Adjudicado', 'En ejecución', 'Finalizado', 'Cancelado'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
          <Select placeholder="Todos los rubros" value={rubroFilter} onChange={e => setRubroFilter(e.target.value)} maxW="220px" focusBorderColor="brand.primary">
            {rubros.map(r => <option key={r} value={r}>{r}</option>)}
          </Select>
          {(search || statusFilter || rubroFilter) && (
            <Button variant="ghost" size="md" color="gray.500" onClick={() => { setSearch(''); setStatusFilter(''); setRubroFilter(''); }}>
              Limpiar filtros
            </Button>
          )}
        </Flex>
      </Box>

      {/* Table */}
      <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.100" overflow="hidden">
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th color="gray.500" fontSize="xs" textTransform="none">Código</Th>
                <Th color="gray.500" fontSize="xs" textTransform="none">Proyecto</Th>
                <Th color="gray.500" fontSize="xs" textTransform="none">Estado</Th>
                <Th color="gray.500" fontSize="xs" textTransform="none">Presupuesto</Th>
                <Th color="gray.500" fontSize="xs" textTransform="none">Avance</Th>
                <Th color="gray.500" fontSize="xs" textTransform="none">Fecha límite</Th>
                <Th color="gray.500" fontSize="xs" textTransform="none">Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.length === 0 && (
                <Tr><Td colSpan={7} textAlign="center" py={10} color="gray.400">No se encontraron proyectos</Td></Tr>
              )}
              {filtered.map(p => (
                <Tr key={p.id} _hover={{ bg: 'gray.50' }} cursor="pointer" onClick={() => navigate(`/entidad/proyectos/${p.id}`)}>
                  <Td><Text fontSize="xs" fontFamily="mono" color="gray.500">{p.code}</Text></Td>
                  <Td>
                    <Text fontWeight="500" color="gray.800" noOfLines={1} maxW="220px">{p.name}</Text>
                    <HStack spacing={2} mt={0.5}>
                      <Text fontSize="xs" color="gray.400">{p.rubro}</Text>
                      <Text fontSize="xs" color="gray.300">·</Text>
                      <Text fontSize="xs" color="gray.400">{p.district}</Text>
                    </HStack>
                  </Td>
                  <Td><StatusBadge status={p.status} size="sm" /></Td>
                  <Td><Text fontSize="sm">{formatCurrency(p.budget)}</Text></Td>
                  <Td minW="140px">
                    <VStack spacing={1} align="start">
                      <Text fontSize="xs" color="gray.500">{p.progress}%</Text>
                      <Progress value={p.progress} size="xs" w="110px" colorScheme="green" borderRadius="full" />
                    </VStack>
                  </Td>
                  <Td><Text fontSize="sm" color="gray.600">{formatDate(p.deadline)}</Text></Td>
                  <Td onClick={e => e.stopPropagation()}>
                    <HStack spacing={1}>
                      <Button size="xs" variant="ghost" color="brand.primary" onClick={() => navigate(`/entidad/proyectos/${p.id}`)}>Ver</Button>
                      <Button size="xs" variant="ghost" color="gray.500">Editar</Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </VStack>
  );
}
