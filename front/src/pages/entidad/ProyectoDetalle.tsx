import {
  Box, Button, Divider, Flex, Grid, Heading, HStack, Icon, Link, Progress,
  Slider, SliderFilledTrack, SliderThumb, SliderTrack, Tab, TabList, TabPanel,
  TabPanels, Tabs, Text, VStack, useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiDownload, FiFileText, FiSave, FiUpload } from 'react-icons/fi';
import { useObra } from '@/components/hooks/useObras';
import ObraTimeline from '@/components/Citizen/ObraTimeline';
import StatusBadge from '@/components/Common/StatusBadge';
import { formatCurrency, formatDate } from '@/utils/helpers';

export default function ProyectoDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { data: obra, isLoading } = useObra(id ?? '');
  const [avance, setAvance] = useState(obra?.avance ?? 0);
  const [isSaving, setIsSaving] = useState(false);

  const saveAvance = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 600));
    toast({ title: `Avance actualizado al ${avance}%`, status: 'success', duration: 2000, position: 'top-right' });
    setIsSaving(false);
  };

  if (isLoading) {
    return <Box textAlign="center" py={16}><Text color="gray.400">Cargando...</Text></Box>;
  }

  if (!obra) {
    return (
      <Box textAlign="center" py={16}>
        <Text color="gray.500">Proyecto no encontrado.</Text>
        <Button mt={4} variant="ghost" onClick={() => navigate('/entidad/proyectos')}>Volver</Button>
      </Box>
    );
  }

  return (
    <VStack spacing={5} align="stretch">
      <Button variant="ghost" leftIcon={<Icon as={FiArrowLeft} />} color="gray.500" alignSelf="flex-start" size="sm" onClick={() => navigate('/entidad/proyectos')}>
        Volver
      </Button>

      {/* Header */}
      <Box bg="white" borderRadius="xl" p={6} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
        <Flex justify="space-between" align={{ base: 'flex-start', md: 'center' }} flexWrap="wrap" gap={3}>
          <Box>
            <HStack spacing={2} mb={1}>
              <Text fontSize="xs" fontFamily="mono" color="gray.400">{obra.codigo}</Text>
              <StatusBadge status={obra.status} size="sm" />
            </HStack>
            <Heading size="md" color="gray.800" fontWeight="700">{obra.nombre}</Heading>
            <Text color="gray.500" fontSize="sm" mt={0.5}>{obra.distrito} · {obra.rubro}</Text>
          </Box>
          <Box textAlign={{ base: 'left', md: 'right' }}>
            <Text fontSize="xs" color="gray.400">Presupuesto</Text>
            <Text fontWeight="700" fontSize="xl" color="brand.700">{formatCurrency(obra.presupuesto)}</Text>
          </Box>
        </Flex>
      </Box>

      {/* Tabs */}
      <Tabs colorScheme="brand" bg="white" borderRadius="xl" borderWidth="1px" borderColor="gray.100" boxShadow="sm" overflow="hidden">
        <TabList px={4} pt={2} borderBottomWidth="1px" borderColor="gray.100">
          <Tab fontSize="sm" fontWeight="500" _selected={{ color: 'brand.700', borderColor: 'brand.700' }}>Información</Tab>
          <Tab fontSize="sm" fontWeight="500" _selected={{ color: 'brand.700', borderColor: 'brand.700' }}>Seguimiento</Tab>
          <Tab fontSize="sm" fontWeight="500" _selected={{ color: 'brand.700', borderColor: 'brand.700' }}>Documentos</Tab>
          <Tab fontSize="sm" fontWeight="500" _selected={{ color: 'brand.700', borderColor: 'brand.700' }}>Historial</Tab>
        </TabList>

        <TabPanels>
          {/* Información */}
          <TabPanel p={6}>
            <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={6}>
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontSize="sm" color="gray.500" fontWeight="500" mb={1}>Descripción</Text>
                  <Text fontSize="sm" color="gray.700">{obra.descripcion}</Text>
                </Box>
                <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                  {[
                    { label: 'Empresa', value: obra.empresa || 'Sin adjudicar' },
                    { label: 'Entidad', value: obra.entidad },
                    { label: 'Fecha inicio', value: obra.fechaInicio ? formatDate(obra.fechaInicio) : '—' },
                    { label: 'Fecha fin', value: obra.fechaFin ? formatDate(obra.fechaFin) : '—' },
                  ].map(f => (
                    <Box key={f.label} bg="gray.50" borderRadius="lg" p={3}>
                      <Text fontSize="xs" color="gray.400" mb={0.5}>{f.label}</Text>
                      <Text fontSize="sm" fontWeight="600" color="gray.800">{f.value}</Text>
                    </Box>
                  ))}
                </Grid>
              </VStack>
              <Box>
                <Heading size="xs" color="gray.600" mb={3}>Línea de tiempo</Heading>
                <ObraTimeline hitos={obra.hitos} />
              </Box>
            </Grid>
          </TabPanel>

          {/* Seguimiento */}
          <TabPanel p={6}>
            <VStack spacing={5} align="stretch">
              <Box bg="gray.50" borderRadius="xl" p={4}>
                <Text fontSize="sm" fontWeight="600" color="gray.700" mb={3}>Actualizar % de avance</Text>
                <Flex align="center" gap={4} mb={3}>
                  <Slider
                    value={avance} min={0} max={100} step={5}
                    onChange={setAvance} colorScheme="brand" flex={1}
                  >
                    <SliderTrack><SliderFilledTrack /></SliderTrack>
                    <SliderThumb boxSize={5}>
                      <Box bg="brand.700" borderRadius="full" w="100%" h="100%" />
                    </SliderThumb>
                  </Slider>
                  <Text fontWeight="700" color="brand.700" w="40px" textAlign="right">{avance}%</Text>
                </Flex>
                <Progress value={avance} colorScheme="brand" borderRadius="full" h="10px" mb={3} />
                <Button size="sm" leftIcon={<Icon as={FiSave} />} isLoading={isSaving} onClick={saveAvance}>
                  Guardar avance
                </Button>
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="600" color="gray.700" mb={3}>Subir fotografías de avance</Text>
                <Box
                  border="2px dashed" borderColor="gray.200" borderRadius="xl" p={6}
                  textAlign="center" cursor="pointer"
                  _hover={{ borderColor: 'brand.700', bg: 'brand.50' }}
                  transition="all 0.15s"
                >
                  <Icon as={FiUpload} boxSize={6} color="gray.300" mb={2} />
                  <Text fontSize="sm" color="gray.500">Arrastra fotos aquí o haz clic</Text>
                </Box>
              </Box>
            </VStack>
          </TabPanel>

          {/* Documentos */}
          <TabPanel p={6}>
            <VStack spacing={3} align="stretch">
              <Button size="sm" variant="outline" leftIcon={<Icon as={FiUpload} />} alignSelf="flex-start">
                Subir documento
              </Button>
              {obra.documentos.map(doc => (
                <Flex key={doc.nombre} justify="space-between" align="center" p={3} bg="gray.50" borderRadius="lg">
                  <HStack spacing={3}>
                    <Icon as={FiFileText} color="gray.400" boxSize={4} />
                    <Text fontSize="sm" color="gray.700">{doc.nombre}</Text>
                  </HStack>
                  <Link href={doc.url} color="brand.700" fontSize="xs" fontWeight="600" display="flex" alignItems="center" gap={1}>
                    <Icon as={FiDownload} boxSize={3} /> Descargar
                  </Link>
                </Flex>
              ))}
            </VStack>
          </TabPanel>

          {/* Historial */}
          <TabPanel p={6}>
            <VStack spacing={2} align="stretch">
              {obra.historial.map((h, i) => (
                <Flex key={i} justify="space-between" align="center" py={3}
                  borderBottomWidth={i < obra.historial.length - 1 ? '1px' : '0'}
                  borderColor="gray.100">
                  <Text fontSize="sm" color="gray.700">{h.descripcion}</Text>
                  <Text fontSize="xs" color="gray.400" ml={4} flexShrink={0}>{formatDate(h.fecha)}</Text>
                </Flex>
              ))}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
}
