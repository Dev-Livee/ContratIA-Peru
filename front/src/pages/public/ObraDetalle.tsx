import {
  Alert, AlertIcon, Box, Button, Container, Divider, Flex, Grid, HStack,
  Icon, Link, Progress, SimpleGrid, Skeleton, SkeletonText,
  Text, VStack, Heading, Badge,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiDownload, FiDollarSign, FiFileText, FiMapPin } from 'react-icons/fi';
import PublicNavbar from '@/components/Layout/PublicNavbar';
import ObraTimeline from '@/components/Citizen/ObraTimeline';
import ObraGaleria from '@/components/Citizen/ObraGaleria';
import StatusBadge from '@/components/Common/StatusBadge';
import { useObra } from '@/components/hooks/useObras';
import { formatCurrency, formatDate } from '@/utils/helpers';

export default function ObraDetalle() {
  const { codigoObra } = useParams<{ codigoObra: string }>();
  const navigate = useNavigate();
  const { data: obra, isLoading, error } = useObra(codigoObra ?? '');

  return (
    <Box minH="100vh" bg="gray.50">
      <PublicNavbar />
      <Container maxW="800px" py={6} px={{ base: 4, md: 6 }}>
        <Button
          variant="ghost" leftIcon={<Icon as={FiArrowLeft} />}
          color="gray.500" mb={4} size="sm"
          onClick={() => navigate(-1)}
        >
          Volver
        </Button>

        {isLoading && (
          <VStack spacing={4} align="stretch">
            <Box bg="white" borderRadius="xl" p={6} borderWidth="1px" borderColor="gray.100">
              <Skeleton h="20px" w="120px" mb={3} />
              <Skeleton h="32px" w="90%" mb={2} />
              <SkeletonText noOfLines={2} spacing={2} mt={3} />
              <Skeleton h="12px" mt={6} borderRadius="full" />
            </Box>
          </VStack>
        )}

        {!isLoading && !obra && (
          <Alert status="warning" borderRadius="xl">
            <AlertIcon />
            No se encontró ninguna obra con el código <Text as="span" fontFamily="mono" fontWeight="700" mx={1}>{codigoObra}</Text>. Verifica el código e intenta nuevamente.
          </Alert>
        )}

        {!isLoading && obra && (
          <VStack spacing={4} align="stretch">
            {/* Header */}
            <Box bg="white" borderRadius="xl" p={6} borderWidth="1px" borderColor="gray.100" boxShadow="sm">
              <HStack spacing={3} mb={3} flexWrap="wrap">
                <StatusBadge status={obra.status} />
                <Text fontSize="xs" fontFamily="mono" color="gray.400" fontWeight="600">
                  Código: {obra.codigo}
                </Text>
              </HStack>
              <Heading size="lg" color="gray.900" fontWeight="700" mb={2}>{obra.nombre}</Heading>
              {obra.empresa && (
                <Text color="gray.500" fontSize="sm" mb={3}>
                  Empresa: <Text as="span" fontWeight="600" color="gray.700">{obra.empresa}</Text>
                  {obra.entidad && <> · Entidad: {obra.entidad}</>}
                </Text>
              )}

              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3} mb={5}>
                <InfoChip icon={FiMapPin} label={`${obra.distrito}, ${obra.region}`} />
                <InfoChip icon={FiDollarSign} label={formatCurrency(obra.presupuesto)} />
                {obra.fechaInicio && <InfoChip icon={FiCalendar} label={`Inicio: ${formatDate(obra.fechaInicio)}`} />}
                {obra.fechaFin && <InfoChip icon={FiCalendar} label={`Fin est.: ${formatDate(obra.fechaFin)}`} />}
              </SimpleGrid>

              {/* Progress bar */}
              <Box>
                <Flex justify="space-between" mb={1.5}>
                  <Text fontSize="sm" fontWeight="500" color="gray.700">Avance actual</Text>
                  <Text fontSize="sm" fontWeight="700" color="brand.700">{obra.avance}%</Text>
                </Flex>
                <Progress value={obra.avance} colorScheme="brand" borderRadius="full" h="14px" />
              </Box>
            </Box>

            {/* Timeline */}
            <Box bg="white" borderRadius="xl" p={6} borderWidth="1px" borderColor="gray.100" boxShadow="sm">
              <Heading size="sm" color="gray.700" fontWeight="600" mb={5}>Línea de tiempo</Heading>
              <ObraTimeline hitos={obra.hitos} />
            </Box>

            {/* Gallery */}
            <Box bg="white" borderRadius="xl" p={6} borderWidth="1px" borderColor="gray.100" boxShadow="sm">
              <Heading size="sm" color="gray.700" fontWeight="600" mb={4}>Galería de fotografías</Heading>
              <ObraGaleria fotos={obra.fotos} />
            </Box>

            {/* Documents */}
            <Box bg="white" borderRadius="xl" p={6} borderWidth="1px" borderColor="gray.100" boxShadow="sm">
              <Heading size="sm" color="gray.700" fontWeight="600" mb={4}>Documentos públicos</Heading>
              <VStack spacing={1} align="stretch">
                {obra.documentos.map(doc => (
                  <Flex
                    key={doc.nombre} justify="space-between" align="center"
                    p={3} borderRadius="lg" _hover={{ bg: 'gray.50' }} transition="background 0.15s"
                  >
                    <HStack spacing={3}>
                      <Icon as={FiFileText} color="gray.400" boxSize={4} />
                      <Text fontSize="sm" color="gray.700">{doc.nombre}</Text>
                    </HStack>
                    <Link href={doc.url} display="flex" alignItems="center" gap={1} color="brand.700" fontSize="xs" fontWeight="600">
                      <Icon as={FiDownload} boxSize={3} />
                      Descargar
                    </Link>
                  </Flex>
                ))}
              </VStack>
            </Box>

            {/* History */}
            <Box bg="white" borderRadius="xl" p={6} borderWidth="1px" borderColor="gray.100" boxShadow="sm">
              <Heading size="sm" color="gray.700" fontWeight="600" mb={4}>Historial de cambios</Heading>
              <VStack spacing={2} align="stretch">
                {obra.historial.map((h, i) => (
                  <Flex key={i} justify="space-between" align="center" py={2}
                    borderBottomWidth={i < obra.historial.length - 1 ? '1px' : '0'}
                    borderColor="gray.50">
                    <Text fontSize="sm" color="gray.700">{h.descripcion}</Text>
                    <Text fontSize="xs" color="gray.400" flexShrink={0} ml={4}>{formatDate(h.fecha)}</Text>
                  </Flex>
                ))}
              </VStack>
            </Box>
          </VStack>
        )}
      </Container>
    </Box>
  );
}

function InfoChip({ icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <HStack spacing={1.5} bg="gray.50" px={2.5} py={1.5} borderRadius="md">
      <Icon as={icon} boxSize={3.5} color="gray.400" flexShrink={0} />
      <Text fontSize="xs" color="gray.600" noOfLines={1}>{label}</Text>
    </HStack>
  );
}
