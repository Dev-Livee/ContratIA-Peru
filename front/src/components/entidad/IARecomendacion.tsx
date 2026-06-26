import { Badge, Box, Button, Divider, Flex, Heading, HStack, Icon, Progress, Text, VStack } from '@chakra-ui/react';
import { FiAlertTriangle, FiCheckCircle, FiCpu } from 'react-icons/fi';
import type { Proveedor } from '@/components/hooks/useProveedores';
import RiskScoreBadge from '@/components/Common/RiskScoreBadge';
import { riskScoreColor, riskScoreLabel } from '@/utils/helpers';

interface Props {
  proveedores: Proveedor[];
  selected: string[];
  onSelect: (id: string) => void;
}

export default function IARecomendacion({ proveedores, selected, onSelect }: Props) {
  const candidates = proveedores.filter(p => selected.includes(p.id));
  const recommended = candidates.length > 0
    ? [...candidates].sort((a, b) => b.riskScore - a.riskScore)[0]
    : null;

  if (candidates.length === 0) {
    return (
      <Box bg="white" borderRadius="xl" p={5} borderWidth="1px" borderColor="gray.100" boxShadow="sm">
        <HStack spacing={2} mb={3}>
          <Icon as={FiCpu} color="gray.400" boxSize={5} />
          <Text fontWeight="600" color="gray.600" fontSize="sm">Recomendación IA</Text>
        </HStack>
        <Text fontSize="sm" color="gray.400" textAlign="center" py={4}>
          Selecciona al menos una empresa para ver la recomendación de IA.
        </Text>
      </Box>
    );
  }

  return (
    <Box bg="brand.800" borderRadius="xl" p={5} color="white">
      <HStack spacing={2} mb={4}>
        <Icon as={FiCpu} boxSize={5} color="brand.300" />
        <Text fontWeight="700" color="brand.100">Recomendación IA</Text>
      </HStack>

      {recommended && (
        <>
          <Text fontSize="xs" color="brand.300" mb={0.5}>Empresa recomendada</Text>
          <Text fontWeight="700" fontSize="md" color="white" mb={2}>{recommended.nombre}</Text>
          <RiskScoreBadge score={recommended.riskScore} />

          <Box bg="brand.700" borderRadius="lg" p={3} mt={3} mb={4}>
            <Text fontSize="xs" color="brand.200" lineHeight="1.6">
              "{recommended.descripcion} Con {recommended.experiencia} años de experiencia y {recommended.contratos} contratos completados, presenta el perfil más sólido."
            </Text>
          </Box>

          <VStack spacing={2} align="stretch" mb={4}>
            <HStack spacing={2}>
              <Icon as={FiCheckCircle} color="brand.300" boxSize={4} />
              <Text fontSize="xs" color="brand.200">Risk Score: {recommended.riskScore}/100</Text>
            </HStack>
            <HStack spacing={2}>
              <Icon as={FiCheckCircle} color="brand.300" boxSize={4} />
              <Text fontSize="xs" color="brand.200">{recommended.experiencia} años de experiencia</Text>
            </HStack>
            <HStack spacing={2}>
              <Icon as={FiCheckCircle} color="brand.300" boxSize={4} />
              <Text fontSize="xs" color="brand.200">{recommended.contratos} contratos completados</Text>
            </HStack>
            {recommended.estadoSunat === 'Activo' && (
              <HStack spacing={2}>
                <Icon as={FiCheckCircle} color="brand.300" boxSize={4} />
                <Text fontSize="xs" color="brand.200">Estado SUNAT: Activo</Text>
              </HStack>
            )}
          </VStack>

          <Divider borderColor="brand.600" mb={4} />

          {/* All candidates score */}
          <Text fontSize="xs" fontWeight="600" color="brand.300" mb={3}>Comparativa de risk score</Text>
          <VStack spacing={2} align="stretch" mb={4}>
            {candidates.map(p => (
              <Box key={p.id}>
                <Flex justify="space-between" mb={1}>
                  <Text fontSize="xs" color="brand.100" noOfLines={1}>{p.nombre.split(' ').slice(0, 2).join(' ')}</Text>
                  <Text fontSize="xs" color="brand.300" fontWeight="600">{p.riskScore}</Text>
                </Flex>
                <Progress
                  value={p.riskScore} max={100} size="xs"
                  colorScheme={riskScoreColor(p.riskScore)}
                  borderRadius="full" bg="brand.700"
                />
              </Box>
            ))}
          </VStack>

          <Button
            w="100%" size="sm" bg="white" color="brand.800"
            _hover={{ bg: 'brand.50' }}
            onClick={() => onSelect(recommended.id)}
          >
            Adjudicar a {recommended.nombre.split(' ').slice(0, 2).join(' ')}
          </Button>
        </>
      )}
    </Box>
  );
}
