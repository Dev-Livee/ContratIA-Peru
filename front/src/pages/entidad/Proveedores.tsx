import {
  Box, Button, Flex, Grid, Heading, Icon, Select, Slider, SliderFilledTrack,
  SliderThumb, SliderTrack, Text, VStack, useDisclosure, useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiBarChart2 } from 'react-icons/fi';
import { useProveedores, useProveedorSelection } from '@/components/hooks/useProveedores';
import ProveedorTable from '@/components/entidad/ProveedorTable';
import IARecomendacion from '@/components/entidad/IARecomendacion';
import { SkeletonTable } from '@/components/Common/SkeletonCard';
import ConfirmModal from '@/components/Common/ConfirmModal';
import { RUBROS, REGIONES } from '@/utils/constants';

export default function Proveedores() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [rubroFilter, setRubroFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [maxRisk, setMaxRisk] = useState('');
  const [minExp, setMinExp] = useState(0);
  const [adjudicadoId, setAdjudicadoId] = useState('');

  const { data: proveedores, isLoading } = useProveedores({
    rubro: rubroFilter, region: regionFilter, maxRisk, minExp,
  });

  const { selected, toggle, clear } = useProveedorSelection();

  const handleSelectIA = (id: string) => {
    setAdjudicadoId(id);
    onOpen();
  };

  const handleAdjudicar = () => {
    const proveedor = (proveedores ?? []).find(p => p.id === adjudicadoId);
    toast({
      title: `Adjudicado a ${proveedor?.nombre}`,
      status: 'success', duration: 3000, position: 'top-right',
    });
    clear();
    onClose();
  };

  return (
    <VStack spacing={5} align="stretch">
      <Flex justify="space-between" align={{ base: 'flex-start', md: 'center' }} flexWrap="wrap" gap={3}>
        <Box>
          <Heading size="lg" color="gray.800" fontWeight="700">Buscar proveedores</Heading>
          <Text color="gray.500" fontSize="sm">{(proveedores ?? []).length} proveedor(es) disponible(s)</Text>
        </Box>
        {selected.length >= 2 && (
          <Button leftIcon={<Icon as={FiBarChart2} />} size="sm">
            Comparar ({selected.length})
          </Button>
        )}
      </Flex>

      <Grid templateColumns={{ base: '1fr', lg: '220px 1fr 280px' }} gap={5} alignItems="flex-start">
        {/* Filters */}
        <Box bg="white" borderRadius="xl" p={4} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
          <Text fontWeight="600" fontSize="sm" color="gray.700" mb={3}>Filtros</Text>
          <VStack spacing={4} align="stretch">
            <FilterBlock label="Rubro">
              <Select size="sm" placeholder="Todos" value={rubroFilter} onChange={e => setRubroFilter(e.target.value)}>
                {RUBROS.map(r => <option key={r} value={r}>{r}</option>)}
              </Select>
            </FilterBlock>
            <FilterBlock label="Región">
              <Select size="sm" placeholder="Todas" value={regionFilter} onChange={e => setRegionFilter(e.target.value)}>
                {REGIONES.map(r => <option key={r} value={r}>{r}</option>)}
              </Select>
            </FilterBlock>
            <FilterBlock label="Riesgo máximo">
              <Select size="sm" placeholder="Cualquiera" value={maxRisk} onChange={e => setMaxRisk(e.target.value)}>
                <option value="Bajo">Solo bajo riesgo</option>
                <option value="Medio">Bajo o medio</option>
              </Select>
            </FilterBlock>
            <FilterBlock label={`Exp. mínima: ${minExp} años`}>
              <Slider value={minExp} min={0} max={20} step={1} onChange={setMinExp} colorScheme="brand" mt={1}>
                <SliderTrack><SliderFilledTrack /></SliderTrack>
                <SliderThumb />
              </Slider>
            </FilterBlock>
            {(rubroFilter || regionFilter || maxRisk || minExp > 0) && (
              <Button size="sm" variant="ghost" color="gray.500"
                onClick={() => { setRubroFilter(''); setRegionFilter(''); setMaxRisk(''); setMinExp(0); }}>
                Limpiar filtros
              </Button>
            )}
          </VStack>
        </Box>

        {/* Table */}
        {isLoading ? <SkeletonTable rows={5} /> : (
          <ProveedorTable proveedores={proveedores ?? []} selected={selected} onToggle={toggle} />
        )}

        {/* IA recommendation */}
        <IARecomendacion
          proveedores={proveedores ?? []}
          selected={selected}
          onSelect={handleSelectIA}
        />
      </Grid>

      <ConfirmModal
        isOpen={isOpen} onClose={onClose} onConfirm={handleAdjudicar}
        title="Confirmar adjudicación"
        message="Esta acción adjudicará el proyecto a la empresa seleccionada. ¿Deseas continuar? Esta acción no puede revertirse."
        confirmLabel="Adjudicar"
      />
    </VStack>
  );
}

function FilterBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box>
      <Text fontSize="xs" fontWeight="600" color="gray.600" mb={1.5}>{label}</Text>
      {children}
    </Box>
  );
}
