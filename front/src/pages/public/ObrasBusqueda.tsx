import {
  Box, Button, Container, Flex, Grid, Heading, Icon, Input, InputGroup,
  InputLeftElement, Select, SimpleGrid, Slider, SliderFilledTrack,
  SliderThumb, SliderTrack, Text, VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import PublicNavbar from '@/components/Layout/PublicNavbar';
import ObraCard from '@/components/Citizen/ObraCard';
import ObrasStatsDashboard from '@/components/Citizen/ObrasStatsDashboard';
import SkeletonCard from '@/components/Common/SkeletonCard';
import EmptyState from '@/components/Common/EmptyState';
import { useObras } from '@/components/hooks/useObras';
import { DISTRICTS, RUBROS, OBRA_STATUS } from '@/utils/constants';
import { formatCurrency } from '@/utils/helpers';

export default function ObrasBusqueda() {
  const [params] = useSearchParams();
  const [distrito, setDistrito] = useState(params.get('distrito') ?? '');
  const [status, setStatus] = useState('');
  const [rubro, setRubro] = useState('');
  const [search, setSearch] = useState('');
  const [maxBudget, setMaxBudget] = useState(10);

  const { data: obras, isLoading } = useObras({ distrito, status, rubro, search });

  const filtered = (obras ?? []).filter(o => o.presupuesto <= maxBudget * 1_000_000);

  return (
    <Box minH="100vh" bg="gray.50">
      <PublicNavbar />
      <Container maxW="1200px" py={6} px={{ base: 4, md: 6 }}>
        <Flex direction={{ base: 'column', lg: 'row' }} gap={6} align="flex-start">

          {/* Sidebar filters */}
          <Box
            w={{ base: '100%', lg: '260px' }}
            bg="white" borderRadius="xl" p={5}
            borderWidth="1px" borderColor="gray.100" boxShadow="sm"
            flexShrink={0}
          >
            <Heading size="sm" color="gray.700" fontWeight="600" mb={4}>Filtros</Heading>
            <VStack spacing={4} align="stretch">
              <FilterField label="Buscar">
                <InputGroup size="sm">
                  <InputLeftElement><Icon as={FiSearch} color="gray.400" boxSize={3.5} /></InputLeftElement>
                  <Input placeholder="Nombre o código..." value={search} onChange={e => setSearch(e.target.value)} />
                </InputGroup>
              </FilterField>

              <FilterField label="Distrito">
                <Select size="sm" placeholder="Todos" value={distrito} onChange={e => setDistrito(e.target.value)}>
                  {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </Select>
              </FilterField>

              <FilterField label="Estado">
                <Select size="sm" placeholder="Todos" value={status} onChange={e => setStatus(e.target.value)}>
                  {Object.values(OBRA_STATUS).map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
              </FilterField>

              <FilterField label="Rubro">
                <Select size="sm" placeholder="Todos" value={rubro} onChange={e => setRubro(e.target.value)}>
                  {RUBROS.map(r => <option key={r} value={r}>{r}</option>)}
                </Select>
              </FilterField>

              <FilterField label={`Presupuesto máx.: ${formatCurrency(maxBudget * 1_000_000)}`}>
                <Slider value={maxBudget} min={0.5} max={20} step={0.5} onChange={setMaxBudget} colorScheme="brand" mt={2}>
                  <SliderTrack><SliderFilledTrack /></SliderTrack>
                  <SliderThumb />
                </Slider>
              </FilterField>

              {(distrito || status || rubro || search) && (
                <Button size="sm" variant="ghost" color="gray.500" onClick={() => { setDistrito(''); setStatus(''); setRubro(''); setSearch(''); }}>
                  Limpiar filtros
                </Button>
              )}
            </VStack>
          </Box>

          {/* Results */}
          <Box flex={1} minW={0}>
            {!isLoading && filtered.length > 0 && (
              <ObrasStatsDashboard obras={filtered} />
            )}

            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md" color="gray.800">
                {isLoading ? 'Buscando...' : `${filtered.length} obra${filtered.length !== 1 ? 's' : ''} encontrada${filtered.length !== 1 ? 's' : ''}`}
                {distrito && ` en ${distrito}`}
              </Heading>
            </Flex>

            {isLoading && (
              <SimpleGrid columns={{ base: 1, sm: 2, xl: 3 }} spacing={4}>
                {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} hasImage lines={3} />)}
              </SimpleGrid>
            )}

            {!isLoading && filtered.length === 0 && (
              <EmptyState
                title="No encontré coincidencias"
                description="Probemos otra búsqueda o cambia los filtros."
                vizPose="curious"
              />
            )}

            {!isLoading && filtered.length > 0 && (
              <SimpleGrid columns={{ base: 1, sm: 2, xl: 3 }} spacing={4}>
                {filtered.map((obra, i) => <ObraCard key={obra.id} obra={obra} index={i} />)}
              </SimpleGrid>
            )}
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box>
      <Text fontSize="xs" fontWeight="600" color="gray.600" mb={1.5}>{label}</Text>
      {children}
    </Box>
  );
}
