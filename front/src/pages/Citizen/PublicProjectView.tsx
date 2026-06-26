import {
  Box, Button, Divider, Flex, Grid, Heading, HStack, Icon, Image,
  Link, Progress, SimpleGrid, Text, VStack, Badge,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FiArrowLeft, FiCalendar, FiCheckCircle, FiCircle, FiClock,
  FiDollarSign, FiDownload, FiFileText, FiMapPin,
} from 'react-icons/fi';
import { useProjects } from '@/context/ProjectContext';
import StatusBadge from '@/components/Common/StatusBadge';
import { formatCurrency, formatDate } from '@/utils/helpers';

const GALLERY = [
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=70',
  'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&q=70',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70',
];

const TIMELINE = [
  { label: 'Proyecto registrado', done: true },
  { label: 'En evaluación', done: true },
  { label: 'Empresa seleccionada', done: true },
  { label: 'Contrato firmado', done: true },
  { label: 'Inicio de obra', done: true },
  { label: 'En ejecución', done: false },
  { label: 'Entrega final', done: false },
];

export default function PublicProjectView() {
  const { id } = useParams();
  const { projects } = useProjects();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <Box textAlign="center" py={16}>
        <Text color="gray.400">Proyecto no encontrado.</Text>
        <Button mt={4} variant="ghost" color="brand.primary" onClick={() => navigate('/ciudadano')}>Volver</Button>
      </Box>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <Button variant="ghost" leftIcon={<Icon as={FiArrowLeft} />} color="gray.500" alignSelf="flex-start" size="sm" onClick={() => navigate(-1)}>
        Volver
      </Button>

      {/* Header */}
      <Box bg="white" borderRadius="xl" p={6} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
        <Flex justify="space-between" align="flex-start" flexWrap="wrap" gap={3}>
          <Box flex={1}>
            <HStack spacing={2} mb={2}>
              <Text fontSize="xs" fontFamily="mono" color="gray.400">{project.code}</Text>
              <StatusBadge status={project.status} />
            </HStack>
            <Heading size="lg" color="gray.800" fontWeight="700" mb={2}>{project.name}</Heading>
            <Text color="gray.600" fontSize="sm" mb={4}>{project.description}</Text>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4}>
              <InfoCard icon={FiMapPin} label="Ubicación" value={project.district} />
              <InfoCard icon={FiDollarSign} label="Presupuesto" value={formatCurrency(project.budget)} />
              <InfoCard icon={FiCalendar} label="Plazo" value={formatDate(project.deadline)} />
              <InfoCard icon={FiFileText} label="Rubro" value={project.rubro} />
            </SimpleGrid>
          </Box>
        </Flex>

        <Divider my={4} borderColor="gray.100" />

        <Box>
          <Flex justify="space-between" mb={2}>
            <Text fontSize="sm" fontWeight="600" color="gray.700">Avance de la obra</Text>
            <Text fontSize="sm" fontWeight="700" color="brand.primaryDark">{project.progress}%</Text>
          </Flex>
          <Progress value={project.progress} colorScheme="green" borderRadius="full" h="12px" />
        </Box>
      </Box>

      <Grid templateColumns={{ base: '1fr', lg: '1fr 320px' }} gap={6}>
        <VStack spacing={5} align="stretch">
          {/* Gallery */}
          <Box bg="white" borderRadius="lg" p={5} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
            <Heading size="sm" color="gray.700" fontWeight="600" mb={3}>Galería de fotos</Heading>
            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={3}>
              {GALLERY.map((src, i) => (
                <Box key={i} borderRadius="md" overflow="hidden" h="120px">
                  <Image src={src} alt={`Foto ${i + 1}`} w="100%" h="100%" objectFit="cover" fallback={<Box h="120px" bg="gray.200" />} />
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          {/* Documents */}
          <Box bg="white" borderRadius="lg" p={5} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
            <Heading size="sm" color="gray.700" fontWeight="600" mb={3}>Documentos públicos</Heading>
            <VStack spacing={2} align="stretch">
              {['Expediente técnico', 'Contrato de obra', 'Bases del proceso', 'Informe de avance mensual', 'Acta de inicio de obra'].map(doc => (
                <HStack key={doc} justify="space-between" p={2.5} borderRadius="md" _hover={{ bg: 'gray.50' }} transition="background 0.15s">
                  <HStack spacing={3}>
                    <Icon as={FiFileText} color="gray.400" boxSize={4} />
                    <Text fontSize="sm" color="gray.700">{doc}</Text>
                  </HStack>
                  <Link href="#" display="flex" alignItems="center" gap={1} color="brand.primary" fontSize="xs" fontWeight="600">
                    <Icon as={FiDownload} boxSize={3} />
                    PDF
                  </Link>
                </HStack>
              ))}
            </VStack>
          </Box>
        </VStack>

        {/* Right column */}
        <VStack spacing={4} align="stretch">
          {/* Timeline */}
          <Box bg="white" borderRadius="lg" p={5} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
            <Heading size="sm" color="gray.700" fontWeight="600" mb={4}>Línea de tiempo</Heading>
            <VStack spacing={0} align="stretch">
              {TIMELINE.map((step, i) => {
                const isPast = step.done;
                const isCurrent = !step.done && (i === 0 || TIMELINE[i - 1].done);
                return (
                  <HStack key={step.label} spacing={3} align="flex-start" pb={i < TIMELINE.length - 1 ? 3 : 0}>
                    <VStack spacing={0} align="center" minW="20px">
                      <Icon
                        as={isPast ? FiCheckCircle : isCurrent ? FiClock : FiCircle}
                        boxSize={5}
                        color={isPast ? 'brand.primaryDark' : isCurrent ? 'orange.400' : 'gray.300'}
                      />
                      {i < TIMELINE.length - 1 && (
                        <Box w="2px" h="20px" bg={isPast ? 'brand.200' : 'gray.200'} mt={0.5} />
                      )}
                    </VStack>
                    <Text
                      fontSize="sm"
                      pt={0.5}
                      fontWeight={isCurrent ? '700' : '400'}
                      color={isPast ? 'gray.700' : isCurrent ? 'orange.600' : 'gray.400'}
                    >
                      {step.label}
                    </Text>
                  </HStack>
                );
              })}
            </VStack>
          </Box>

          {/* Company info */}
          {project.company && (
            <Box bg="white" borderRadius="lg" p={5} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
              <Heading size="sm" color="gray.700" fontWeight="600" mb={3}>Empresa ejecutora</Heading>
              <Text fontWeight="600" color="gray.800">{project.company}</Text>
              <Badge colorScheme="green" variant="subtle" mt={1}>Verificada OSCE</Badge>
            </Box>
          )}
        </VStack>
      </Grid>
    </VStack>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <Box bg="gray.50" borderRadius="md" p={3}>
      <HStack spacing={2} mb={0.5}>
        <Icon as={icon} boxSize={3.5} color="gray.400" />
        <Text fontSize="xs" color="gray.400">{label}</Text>
      </HStack>
      <Text fontSize="sm" fontWeight="600" color="gray.800">{value}</Text>
    </Box>
  );
}
