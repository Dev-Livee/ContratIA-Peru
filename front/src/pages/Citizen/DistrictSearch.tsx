import {
  Box, Button, Flex, Grid, Heading, HStack, Icon, Image, Input,
  InputGroup, InputLeftElement, Progress, Select, SimpleGrid, Text, VStack,
  RangeSlider, RangeSliderFilledTrack, RangeSliderThumb, RangeSliderTrack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiSearch } from 'react-icons/fi';
import { useProjects } from '@/context/ProjectContext';
import StatusBadge from '@/components/Common/StatusBadge';
import { formatCurrency, truncate } from '@/utils/helpers';
import { DISTRICTS } from '@/utils/constants';

export default function DistrictSearch() {
  const { projects } = useProjects();
  const navigate = useNavigate();
  const [district, setDistrict] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [rubroFilter, setRubroFilter] = useState('');
  const [search, setSearch] = useState('');
  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 5000000]);

  const filtered = projects.filter(p => {
    const matchDistrict = !district || p.district === district;
    const matchStatus = !statusFilter || p.status === statusFilter;
    const matchRubro = !rubroFilter || p.rubro === rubroFilter;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchBudget = p.budget >= budgetRange[0] && p.budget <= budgetRange[1];
    return matchDistrict && matchStatus && matchRubro && matchSearch && matchBudget;
  });

  const rubros = [...new Set(projects.map(p => p.rubro))];

  const PROJECT_IMAGES = [
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=70',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=70',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70',
    'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&q=70',
  ];

  return (
    <VStack spacing={6} align="stretch">
      {/* Hero */}
      <Box bg="brand.primaryDark" borderRadius="xl" p={{ base: 6, md: 8 }} color="white">
        <Heading size="lg" fontWeight="800" mb={2}>Obras cerca de ti</Heading>
        <Text fontSize="sm" color="brand.200" mb={5}>Consulta el avance de las obras públicas en tu distrito</Text>
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={3}>
          <Select
            bg="white"
            color="gray.700"
            value={district}
            onChange={e => setDistrict(e.target.value)}
            placeholder="Selecciona tu distrito"
            focusBorderColor="brand.200"
          >
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </Select>
          <InputGroup>
            <InputLeftElement><Icon as={FiSearch} color="gray.400" /></InputLeftElement>
            <Input bg="white" color="gray.700" placeholder="Buscar proyecto..." value={search} onChange={e => setSearch(e.target.value)} focusBorderColor="brand.200" _placeholder={{ color: 'gray.400' }} />
          </InputGroup>
        </Grid>
      </Box>

      {/* Filters */}
      <Box bg="white" borderRadius="lg" p={4} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
        <Flex gap={3} flexWrap="wrap" align="center">
          <Text fontSize="sm" color="gray.500" fontWeight="500">Filtros:</Text>
          <Select size="sm" placeholder="Todos los estados" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} maxW="180px" focusBorderColor="brand.primary">
            {['Evaluación', 'Adjudicado', 'En ejecución', 'Finalizado'].map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Select size="sm" placeholder="Todos los rubros" value={rubroFilter} onChange={e => setRubroFilter(e.target.value)} maxW="200px" focusBorderColor="brand.primary">
            {rubros.map(r => <option key={r} value={r}>{r}</option>)}
          </Select>
          {(district || statusFilter || rubroFilter || search) && (
            <Button size="sm" variant="ghost" color="gray.500" onClick={() => { setDistrict(''); setStatusFilter(''); setRubroFilter(''); setSearch(''); }}>
              Limpiar
            </Button>
          )}
        </Flex>
      </Box>

      {/* Results */}
      <Flex justify="space-between" align="center">
        <Text fontSize="sm" color="gray.500" fontWeight="500">
          {filtered.length} obra{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
          {district && ` en ${district}`}
        </Text>
      </Flex>

      {filtered.length === 0 && (
        <Box textAlign="center" py={16} bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.100">
          <Icon as={FiMapPin} boxSize={10} color="gray.300" mb={3} />
          <Text color="gray.400" fontWeight="500">No se encontraron obras con estos filtros</Text>
          <Text color="gray.300" fontSize="sm">Prueba seleccionando un distrito diferente</Text>
        </Box>
      )}

      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={4}>
        {filtered.map((p, i) => (
          <Box
            key={p.id}
            bg="white"
            borderRadius="lg"
            boxShadow="sm"
            borderWidth="1px"
            borderColor="gray.100"
            overflow="hidden"
            cursor="pointer"
            _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
            transition="all 0.2s"
            onClick={() => navigate(`/ciudadano/proyecto/${p.id}`)}
          >
            <Box h="160px" bg="gray.100" overflow="hidden" position="relative">
              <Image
                src={PROJECT_IMAGES[i % PROJECT_IMAGES.length]}
                alt={p.name}
                w="100%"
                h="100%"
                objectFit="cover"
                fallback={<Box h="160px" bg="gray.200" />}
              />
              <Box position="absolute" top={2} right={2}>
                <StatusBadge status={p.status} size="sm" />
              </Box>
            </Box>
            <Box p={4}>
              <Text fontWeight="600" color="gray.800" fontSize="sm" noOfLines={2} mb={1}>{p.name}</Text>
              <HStack spacing={1} mb={3}>
                <Icon as={FiMapPin} boxSize={3} color="gray.400" />
                <Text fontSize="xs" color="gray.500">{p.district} · {p.rubro}</Text>
              </HStack>
              {p.company && (
                <Text fontSize="xs" color="gray.500" mb={3} noOfLines={1}>Empresa: {p.company}</Text>
              )}
              <Box>
                <Flex justify="space-between" mb={1}>
                  <Text fontSize="xs" color="gray.500">Avance</Text>
                  <Text fontSize="xs" fontWeight="600" color="brand.primaryDark">{p.progress}%</Text>
                </Flex>
                <Progress value={p.progress} colorScheme="green" size="sm" borderRadius="full" />
              </Box>
              <Flex justify="space-between" align="center" mt={3}>
                <Text fontSize="xs" color="gray.400">{formatCurrency(p.budget)}</Text>
                <Button size="xs" bg="brand.primaryDark" color="white" _hover={{ bg: 'brand.800' }} borderRadius="md">Ver detalles</Button>
              </Flex>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </VStack>
  );
}
