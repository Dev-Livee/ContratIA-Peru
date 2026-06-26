import {
  Box, Button, Divider, Flex, Grid, Heading, HStack, Icon, Progress,
  Table, Tbody, Td, Text, Th, Thead, Tr, VStack, Badge, Alert, AlertIcon,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiStar, FiCheck, FiAlertTriangle } from 'react-icons/fi';
import { useProviders } from '@/components/hooks/useProviders';
import { riskColor } from '@/utils/helpers';

export default function ProviderComparison() {
  const { providers, selected, setSelected } = useProviders();
  const navigate = useNavigate();
  const compared = providers.filter(p => selected.includes(p.id));

  if (selected.length < 2) {
    return (
      <VStack spacing={6} align="stretch">
        <Button variant="ghost" leftIcon={<Icon as={FiArrowLeft} />} color="gray.500" alignSelf="flex-start" onClick={() => navigate('/entidad/proveedores')}>
          Volver a búsqueda
        </Button>
        <Alert status="warning" borderRadius="lg">
          <AlertIcon />
          Debes seleccionar al menos 2 proveedores para comparar. Ve a la búsqueda y selecciona proveedores.
        </Alert>
        <Button bg="brand.primaryDark" color="white" _hover={{ bg: 'brand.800' }} alignSelf="flex-start" onClick={() => navigate('/entidad/proveedores')}>
          Buscar proveedores
        </Button>
      </VStack>
    );
  }

  // AI recommendation: lowest risk + most experience
  const recommended = [...compared].sort((a, b) => {
    const riskScore = { Bajo: 0, Medio: 1, Alto: 2 };
    const rd = (riskScore[a.risk as keyof typeof riskScore] ?? 2) - (riskScore[b.risk as keyof typeof riskScore] ?? 2);
    if (rd !== 0) return rd;
    return b.experience - a.experience;
  })[0];

  const rows = [
    { label: 'Riesgo', render: (p: typeof compared[0]) => <Badge colorScheme={riskColor(p.risk)} variant="subtle" borderRadius="full" px={2}>{p.risk}</Badge> },
    { label: 'Años de experiencia', render: (p: typeof compared[0]) => <Text fontWeight="600">{p.experience} años</Text> },
    { label: 'Contratos completados', render: (p: typeof compared[0]) => <Text fontWeight="600">{p.contracts}</Text> },
    { label: 'Tiempo promedio (días)', render: (p: typeof compared[0]) => <Text fontWeight="600">{p.avgDays}</Text> },
    { label: 'Rating', render: (p: typeof compared[0]) => (
      <HStack spacing={1}>
        <Icon as={FiStar} color="yellow.400" />
        <Text fontWeight="600">{p.rating.toFixed(1)}</Text>
        <Progress value={p.rating * 20} size="xs" w="60px" colorScheme="yellow" borderRadius="full" />
      </HStack>
    )},
    { label: 'Regiones', render: (p: typeof compared[0]) => <Text>{p.region}</Text> },
    { label: 'Rubros', render: (p: typeof compared[0]) => <Text fontSize="xs" color="gray.600">{p.rubro.join(', ')}</Text> },
  ];

  return (
    <VStack spacing={6} align="stretch">
      <Flex justify="space-between" align={{ base: 'flex-start', md: 'center' }} flexWrap="wrap" gap={3}>
        <Box>
          <Button variant="ghost" leftIcon={<Icon as={FiArrowLeft} />} color="gray.500" mb={2} size="sm" onClick={() => navigate('/entidad/proveedores')}>
            Volver
          </Button>
          <Heading size="lg" color="gray.800" fontWeight="700">Comparación de proveedores</Heading>
          <Text color="gray.500" fontSize="sm">Analizando {compared.length} proveedores</Text>
        </Box>
      </Flex>

      <Grid templateColumns={{ base: '1fr', xl: '1fr 320px' }} gap={6} alignItems="start">
        {/* Comparison table */}
        <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.100" overflow="hidden">
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th textTransform="none" fontSize="sm" color="gray.600" w="180px">Criterio</Th>
                  {compared.map(p => (
                    <Th key={p.id} textTransform="none" fontSize="sm">
                      <VStack spacing={1} align="start">
                        <Text fontWeight="700" color="gray.800">{p.name}</Text>
                        <Text fontWeight="400" fontSize="xs" color="gray.400">RUC {p.ruc}</Text>
                        {p.id === recommended.id && (
                          <Badge colorScheme="green" variant="solid" borderRadius="full" fontSize="xs">
                            ⭐ Recomendado IA
                          </Badge>
                        )}
                      </VStack>
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {rows.map(row => (
                  <Tr key={row.label} _hover={{ bg: 'gray.50' }}>
                    <Td fontSize="sm" color="gray.600" fontWeight="500">{row.label}</Td>
                    {compared.map(p => (
                      <Td key={p.id}>{row.render(p)}</Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>

        {/* AI recommendation panel */}
        <VStack spacing={4} align="stretch">
          <Box bg="brand.light" borderRadius="lg" p={5} borderWidth="1px" borderColor="brand.200">
            <HStack spacing={2} mb={3}>
              <Icon as={FiCheck} color="brand.primaryDark" boxSize={5} />
              <Heading size="sm" color="brand.primaryDark" fontWeight="700">Recomendación IA</Heading>
            </HStack>
            <Text fontWeight="700" color="brand.primaryDark" mb={1}>{recommended.name}</Text>
            <Badge colorScheme={riskColor(recommended.risk)} variant="subtle" mb={3}>Riesgo {recommended.risk}</Badge>
            <Text fontSize="sm" color="gray.700" mb={4}>
              {recommended.name} presenta el mejor perfil de riesgo con {recommended.experience} años de experiencia y {recommended.contracts} contratos completados.
              Su tiempo promedio de {recommended.avgDays} días y rating de {recommended.rating.toFixed(1)}/5 la posicionan como la opción más confiable.
            </Text>
            <Button w="100%" bg="brand.primaryDark" color="white" _hover={{ bg: 'brand.800' }} size="sm">
              Seleccionar proveedor
            </Button>
          </Box>

          <Box bg="white" borderRadius="lg" p={5} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
            <HStack spacing={2} mb={3}>
              <Icon as={FiAlertTriangle} color="orange.500" boxSize={4} />
              <Text fontWeight="600" fontSize="sm" color="gray.700">Factores de riesgo</Text>
            </HStack>
            {compared.map(p => (
              <Box key={p.id} mb={3}>
                <Text fontSize="xs" fontWeight="600" color="gray.600" mb={1}>{p.name}</Text>
                <HStack spacing={2} mb={1}>
                  <Badge colorScheme={riskColor(p.risk)} variant="subtle" fontSize="xs">{p.risk}</Badge>
                  <Text fontSize="xs" color="gray.500">Score: {((6 - compared.indexOf(p)) * 20).toFixed(0)}%</Text>
                </HStack>
                <Progress value={(6 - compared.indexOf(p)) * 20} size="xs" colorScheme={riskColor(p.risk)} borderRadius="full" />
              </Box>
            ))}
          </Box>

          <Button variant="outline" borderColor="gray.300" color="gray.600" size="sm" onClick={() => { setSelected([]); navigate('/entidad/proveedores'); }}>
            Nueva búsqueda
          </Button>
        </VStack>
      </Grid>
    </VStack>
  );
}
