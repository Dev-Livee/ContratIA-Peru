import {
  Box, Button, Checkbox, Divider, Flex, Grid, Heading, HStack, Icon,
  Input, InputGroup, InputLeftElement, Progress, Select, SimpleGrid,
  Slider, SliderFilledTrack, SliderThumb, SliderTrack, Table, Tbody,
  Td, Text, Th, Thead, Tr, VStack, Badge,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiBarChart2, FiStar } from 'react-icons/fi';
import { useProviders } from '@/components/hooks/useProviders';
import { RUBROS, DISTRICTS } from '@/utils/constants';
import { riskColor } from '@/utils/helpers';

export default function ProviderSearch() {
  const { providers, selected, toggleSelect } = useProviders();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [rubroFilter, setRubroFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [maxRisk, setMaxRisk] = useState('');
  const [minExp, setMinExp] = useState(0);

  const filtered = providers.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.ruc.includes(search);
    const matchRubro = !rubroFilter || p.rubro.includes(rubroFilter);
    const matchRegion = !regionFilter || p.region === regionFilter;
    const matchRisk = !maxRisk || (maxRisk === 'Bajo' ? p.risk === 'Bajo' : maxRisk === 'Medio' ? p.risk !== 'Alto' : true);
    const matchExp = p.experience >= minExp;
    return matchSearch && matchRubro && matchRegion && matchRisk && matchExp;
  });

  const regions = [...new Set(providers.map(p => p.region))];

  return (
    <VStack spacing={6} align="stretch">
      <Flex justify="space-between" align={{ base: 'flex-start', md: 'center' }} flexWrap="wrap" gap={3}>
        <Box>
          <Heading size="lg" color="gray.800" fontWeight="700">Buscar proveedores</Heading>
          <Text color="gray.500" fontSize="sm">{filtered.length} proveedor{filtered.length !== 1 ? 'es' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</Text>
        </Box>
        {selected.length > 0 && (
          <Button leftIcon={<Icon as={FiBarChart2} />} bg="brand.primaryDark" color="white" _hover={{ bg: 'brand.800' }} borderRadius="md" onClick={() => navigate('/entidad/comparar')}>
            Comparar ({selected.length})
          </Button>
        )}
      </Flex>

      <Grid templateColumns={{ base: '1fr', lg: '260px 1fr' }} gap={6}>
        {/* Filters sidebar */}
        <Box bg="white" borderRadius="lg" p={5} boxShadow="sm" borderWidth="1px" borderColor="gray.100" h="fit-content">
          <Heading size="sm" color="gray.700" fontWeight="600" mb={4} display="flex" alignItems="center" gap={2}>
            Filtros
          </Heading>
          <VStack spacing={5} align="stretch">
            <FormField label="Rubro">
              <Select size="sm" placeholder="Todos" value={rubroFilter} onChange={e => setRubroFilter(e.target.value)} focusBorderColor="brand.primary">
                {RUBROS.map(r => <option key={r} value={r}>{r}</option>)}
              </Select>
            </FormField>
            <FormField label="Región">
              <Select size="sm" placeholder="Todas" value={regionFilter} onChange={e => setRegionFilter(e.target.value)} focusBorderColor="brand.primary">
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </Select>
            </FormField>
            <FormField label={`Experiencia mínima: ${minExp} años`}>
              <Slider value={minExp} min={0} max={20} step={1} onChange={setMinExp} colorScheme="green">
                <SliderTrack><SliderFilledTrack /></SliderTrack>
                <SliderThumb />
              </Slider>
            </FormField>
            <FormField label="Nivel de riesgo máximo">
              <Select size="sm" placeholder="Cualquiera" value={maxRisk} onChange={e => setMaxRisk(e.target.value)} focusBorderColor="brand.primary">
                <option value="Bajo">Solo bajo</option>
                <option value="Medio">Bajo o medio</option>
                <option value="Alto">Todos</option>
              </Select>
            </FormField>
            <Button size="sm" variant="ghost" color="gray.500" onClick={() => { setRubroFilter(''); setRegionFilter(''); setMinExp(0); setMaxRisk(''); }}>
              Limpiar filtros
            </Button>
          </VStack>
        </Box>

        {/* Results */}
        <VStack spacing={4} align="stretch">
          <InputGroup>
            <InputLeftElement><Icon as={FiSearch} color="gray.400" /></InputLeftElement>
            <Input placeholder="Buscar por nombre o RUC..." value={search} onChange={e => setSearch(e.target.value)} bg="white" focusBorderColor="brand.primary" />
          </InputGroup>

          <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.100" overflow="hidden">
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead bg="gray.50">
                  <Tr>
                    <Th w="40px" />
                    <Th textTransform="none" fontSize="xs" color="gray.500">Proveedor</Th>
                    <Th textTransform="none" fontSize="xs" color="gray.500">Riesgo</Th>
                    <Th textTransform="none" fontSize="xs" color="gray.500">Experiencia</Th>
                    <Th textTransform="none" fontSize="xs" color="gray.500">Contratos</Th>
                    <Th textTransform="none" fontSize="xs" color="gray.500">T. promedio</Th>
                    <Th textTransform="none" fontSize="xs" color="gray.500">Rating</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filtered.length === 0 && (
                    <Tr><Td colSpan={7} textAlign="center" py={8} color="gray.400">No se encontraron proveedores</Td></Tr>
                  )}
                  {filtered.map(p => (
                    <Tr key={p.id} _hover={{ bg: 'gray.50' }}>
                      <Td>
                        <Checkbox
                          isChecked={selected.includes(p.id)}
                          onChange={() => toggleSelect(p.id)}
                          colorScheme="green"
                          isDisabled={!selected.includes(p.id) && selected.length >= 3}
                        />
                      </Td>
                      <Td>
                        <Text fontWeight="500" color="gray.800">{p.name}</Text>
                        <Text fontSize="xs" color="gray.400">RUC {p.ruc} · {p.region}</Text>
                      </Td>
                      <Td>
                        <Badge colorScheme={riskColor(p.risk)} variant="subtle" borderRadius="full" px={2}>{p.risk}</Badge>
                      </Td>
                      <Td><Text fontSize="sm">{p.experience} años</Text></Td>
                      <Td><Text fontSize="sm">{p.contracts}</Text></Td>
                      <Td><Text fontSize="sm">{p.avgDays} días</Text></Td>
                      <Td>
                        <HStack spacing={1}>
                          <Icon as={FiStar} color="yellow.400" boxSize={3.5} />
                          <Text fontSize="sm">{p.rating.toFixed(1)}</Text>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
          <Text fontSize="xs" color="gray.400" textAlign="center">
            Selecciona hasta 3 proveedores para comparar
          </Text>
        </VStack>
      </Grid>
    </VStack>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box>
      <Text fontSize="xs" fontWeight="600" color="gray.600" mb={2}>{label}</Text>
      {children}
    </Box>
  );
}
