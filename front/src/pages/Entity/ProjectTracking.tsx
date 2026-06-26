import {
  Box, Button, Flex, Grid, Heading, HStack, Icon, Progress, Text, VStack, Badge,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiCircle, FiClock } from 'react-icons/fi';
import { useProjects } from '@/context/ProjectContext';
import StatusBadge from '@/components/Common/StatusBadge';
import { formatCurrency, formatDate } from '@/utils/helpers';

const TIMELINE_STEPS = [
  { key: 'created', label: 'Proyecto creado', threshold: 0 },
  { key: 'evaluation', label: 'En evaluación', threshold: 0 },
  { key: 'awarded', label: 'Empresa seleccionada', threshold: 0 },
  { key: 'contract', label: 'Contrato firmado', threshold: 1 },
  { key: 'start', label: 'Inicio de obra', threshold: 5 },
  { key: 'p25', label: '25% completado', threshold: 25 },
  { key: 'p50', label: '50% completado', threshold: 50 },
  { key: 'p75', label: '75% completado', threshold: 75 },
  { key: 'done', label: 'Obra finalizada', threshold: 100 },
];

export default function ProjectTracking() {
  const { id } = useParams();
  const { projects } = useProjects();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <Box textAlign="center" py={16}>
        <Text color="gray.500">Proyecto no encontrado.</Text>
        <Button mt={4} onClick={() => navigate('/entidad/proyectos')} color="brand.primary" variant="ghost">Volver</Button>
      </Box>
    );
  }

  const getStepStatus = (threshold: number) => {
    if (project.progress >= threshold && project.status !== 'Evaluación' && project.status !== 'Borrador') return 'done';
    if (threshold === 0 && ['Evaluación', 'Adjudicado', 'En ejecución', 'Finalizado'].includes(project.status)) return 'done';
    return 'pending';
  };

  return (
    <VStack spacing={6} align="stretch">
      <Flex align="center" gap={3}>
        <Button variant="ghost" leftIcon={<Icon as={FiArrowLeft} />} color="gray.500" size="sm" onClick={() => navigate('/entidad/proyectos')}>
          Volver
        </Button>
      </Flex>

      {/* Header */}
      <Box bg="white" borderRadius="lg" p={6} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
        <Flex justify="space-between" align={{ base: 'flex-start', md: 'center' }} flexWrap="wrap" gap={3}>
          <Box>
            <HStack spacing={2} mb={1}>
              <Text fontSize="xs" fontFamily="mono" color="gray.400">{project.code}</Text>
              <StatusBadge status={project.status} size="sm" />
            </HStack>
            <Heading size="md" color="gray.800" fontWeight="700">{project.name}</Heading>
            <Text color="gray.500" fontSize="sm" mt={1}>{project.district} · {project.rubro}</Text>
          </Box>
          <Box textAlign={{ base: 'left', md: 'right' }}>
            <Text fontSize="xs" color="gray.400">Presupuesto</Text>
            <Text fontWeight="700" fontSize="xl" color="brand.primaryDark">{formatCurrency(project.budget)}</Text>
          </Box>
        </Flex>

        <Box mt={4}>
          <Flex justify="space-between" mb={1}>
            <Text fontSize="sm" color="gray.600" fontWeight="500">Progreso general</Text>
            <Text fontSize="sm" fontWeight="700" color="brand.primaryDark">{project.progress}%</Text>
          </Flex>
          <Progress value={project.progress} colorScheme="green" borderRadius="full" h="10px" />
        </Box>
      </Box>

      <Grid templateColumns={{ base: '1fr', lg: '1fr 320px' }} gap={6}>
        {/* Timeline */}
        <Box bg="white" borderRadius="lg" p={6} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
          <Heading size="sm" color="gray.700" fontWeight="600" mb={5}>Línea de tiempo</Heading>
          <VStack spacing={0} align="stretch">
            {TIMELINE_STEPS.map((step, i) => {
              const isDone = getStepStatus(step.threshold) === 'done';
              const isCurrent = !isDone && (i === 0 || getStepStatus(TIMELINE_STEPS[i - 1].threshold) === 'done');
              return (
                <HStack key={step.key} spacing={4} align="flex-start" pb={i < TIMELINE_STEPS.length - 1 ? 4 : 0}>
                  <VStack spacing={0} align="center" minW="24px">
                    <Icon
                      as={isDone ? FiCheckCircle : isCurrent ? FiClock : FiCircle}
                      boxSize={6}
                      color={isDone ? 'brand.primaryDark' : isCurrent ? 'orange.400' : 'gray.300'}
                    />
                    {i < TIMELINE_STEPS.length - 1 && (
                      <Box w="2px" h="32px" bg={isDone ? 'brand.200' : 'gray.200'} mt={0.5} />
                    )}
                  </VStack>
                  <Box pt={0.5}>
                    <Text
                      fontSize="sm"
                      fontWeight={isCurrent ? '700' : isDone ? '500' : '400'}
                      color={isDone ? 'gray.800' : isCurrent ? 'orange.600' : 'gray.400'}
                    >
                      {step.label}
                    </Text>
                    {isCurrent && (
                      <Badge colorScheme="orange" variant="subtle" fontSize="xs" mt={0.5}>Etapa actual</Badge>
                    )}
                  </Box>
                </HStack>
              );
            })}
          </VStack>
        </Box>

        {/* Details */}
        <VStack spacing={4} align="stretch">
          <Box bg="white" borderRadius="lg" p={5} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
            <Heading size="sm" color="gray.700" fontWeight="600" mb={4}>Información del proyecto</Heading>
            <VStack spacing={3} align="stretch">
              <DetailRow label="Empresa adjudicada" value={project.company ?? 'Sin adjudicar'} />
              <DetailRow label="Plazo límite" value={formatDate(project.deadline)} />
              <DetailRow label="Creado el" value={formatDate(project.createdAt)} />
              <DetailRow label="Rubro" value={project.rubro} />
              <DetailRow label="Distrito" value={project.district} />
            </VStack>
          </Box>
          {project.description && (
            <Box bg="white" borderRadius="lg" p={5} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
              <Heading size="sm" color="gray.700" fontWeight="600" mb={2}>Descripción</Heading>
              <Text fontSize="sm" color="gray.600">{project.description}</Text>
            </Box>
          )}
        </VStack>
      </Grid>
    </VStack>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Flex justify="space-between" align="flex-start" gap={3}>
      <Text fontSize="sm" color="gray.500" minW="120px">{label}</Text>
      <Text fontSize="sm" color="gray.800" fontWeight="500" textAlign="right">{value}</Text>
    </Flex>
  );
}
