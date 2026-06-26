import {
  Alert, AlertIcon, Box, Button, Divider, Flex, Heading, HStack, Icon,
  Input, InputGroup, InputLeftElement, InputRightElement, Link, Progress,
  Text, VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX, FiMapPin, FiCalendar, FiDollarSign, FiFileText } from 'react-icons/fi';
import { useProjects } from '@/context/ProjectContext';
import StatusBadge from '@/components/Common/StatusBadge';
import { formatCurrency, formatDate } from '@/utils/helpers';

export default function CodeSearch() {
  const { projects } = useProjects();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [searched, setSearched] = useState('');
  const [notFound, setNotFound] = useState(false);

  const found = projects.find(p => p.code.toLowerCase() === searched.toLowerCase());

  const handleSearch = () => {
    const trimmed = code.trim();
    if (!trimmed) return;
    setSearched(trimmed);
    setNotFound(!projects.some(p => p.code.toLowerCase() === trimmed.toLowerCase()));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSearch(); };

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="lg" color="gray.800" fontWeight="700">Consulta por código</Heading>
        <Text color="gray.500" fontSize="sm" mt={0.5}>Ingresa el código de la obra para ver su estado</Text>
      </Box>

      {/* Search box */}
      <Box bg="white" borderRadius="xl" p={{ base: 5, md: 8 }} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
        <Text fontWeight="600" color="gray.700" mb={3} fontSize="sm">Código de obra</Text>
        <Flex gap={3} flexDir={{ base: 'column', sm: 'row' }}>
          <InputGroup size="lg" flex={1}>
            <InputLeftElement><Icon as={FiSearch} color="gray.400" /></InputLeftElement>
            <Input
              placeholder="Ej: OBR-2024-001"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              focusBorderColor="brand.primary"
              fontFamily="mono"
              fontSize="md"
            />
            {code && (
              <InputRightElement>
                <Icon as={FiX} color="gray.400" cursor="pointer" onClick={() => { setCode(''); setSearched(''); setNotFound(false); }} />
              </InputRightElement>
            )}
          </InputGroup>
          <Button
            size="lg"
            bg="brand.primaryDark"
            color="white"
            _hover={{ bg: 'brand.800' }}
            px={8}
            borderRadius="md"
            onClick={handleSearch}
            flexShrink={0}
          >
            Buscar
          </Button>
        </Flex>
        <Text fontSize="xs" color="gray.400" mt={2}>
          Puedes encontrar el código en documentos oficiales de la entidad o en avisos públicos de la obra.
        </Text>
      </Box>

      {/* Not found */}
      {notFound && searched && (
        <Alert status="warning" borderRadius="lg">
          <AlertIcon />
          No se encontró ninguna obra con el código <Text as="span" fontFamily="mono" fontWeight="700" mx={1}>{searched}</Text>. Verifica el código e intenta nuevamente.
        </Alert>
      )}

      {/* Result */}
      {found && (
        <VStack spacing={4} align="stretch">
          <Box bg="white" borderRadius="xl" p={6} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
            <Flex justify="space-between" align={{ base: 'flex-start', md: 'center' }} flexWrap="wrap" gap={3}>
              <Box>
                <HStack spacing={2} mb={1}>
                  <Text fontSize="xs" fontFamily="mono" color="gray.400" fontWeight="600">{found.code}</Text>
                  <StatusBadge status={found.status} size="sm" />
                </HStack>
                <Heading size="md" color="gray.800" fontWeight="700">{found.name}</Heading>
              </Box>
              <Button
                size="sm"
                bg="brand.primaryDark"
                color="white"
                _hover={{ bg: 'brand.800' }}
                onClick={() => navigate(`/ciudadano/proyecto/${found.id}`)}
              >
                Ver detalles
              </Button>
            </Flex>

            <Divider my={4} borderColor="gray.100" />

            <HStack spacing={6} flexWrap="wrap" mb={4}>
              <InfoItem icon={FiMapPin} label={`${found.district}`} />
              <InfoItem icon={FiCalendar} label={`Plazo: ${formatDate(found.deadline)}`} />
              <InfoItem icon={FiDollarSign} label={formatCurrency(found.budget)} />
            </HStack>

            {found.company && (
              <Box mb={4}>
                <Text fontSize="xs" color="gray.500" mb={0.5}>Empresa adjudicada</Text>
                <Text fontSize="sm" fontWeight="600" color="gray.800">{found.company}</Text>
              </Box>
            )}

            <Box>
              <Flex justify="space-between" mb={2}>
                <Text fontSize="sm" color="gray.600" fontWeight="500">Progreso de la obra</Text>
                <Text fontSize="sm" fontWeight="700" color="brand.primaryDark">{found.progress}%</Text>
              </Flex>
              <Progress value={found.progress} colorScheme="green" borderRadius="full" h="12px" />
            </Box>
          </Box>

          {/* Documents */}
          <Box bg="white" borderRadius="lg" p={5} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
            <Heading size="sm" color="gray.700" fontWeight="600" mb={3}>Documentos disponibles</Heading>
            <VStack spacing={2} align="stretch">
              {['Expediente técnico', 'Contrato de obra', 'Acta de inicio', 'Informe de avance'].map(doc => (
                <HStack key={doc} justify="space-between" p={2} borderRadius="md" _hover={{ bg: 'gray.50' }}>
                  <HStack spacing={2}>
                    <Icon as={FiFileText} color="gray.400" boxSize={4} />
                    <Text fontSize="sm" color="gray.700">{doc}</Text>
                  </HStack>
                  <Link fontSize="xs" color="brand.primary" fontWeight="600" href="#">Descargar PDF</Link>
                </HStack>
              ))}
            </VStack>
          </Box>
        </VStack>
      )}

      {/* Quick links */}
      {!found && !searched && (
        <Box bg="gray.50" borderRadius="lg" p={5} borderWidth="1px" borderColor="gray.200">
          <Text fontSize="sm" color="gray.600" fontWeight="600" mb={2}>Códigos de ejemplo:</Text>
          <VStack spacing={1} align="start">
            {['OBR-2024-001', 'OBR-2024-002', 'OBR-2024-003', 'OBR-2023-015'].map(c => (
              <Button key={c} variant="link" color="brand.primary" fontSize="sm" fontFamily="mono" onClick={() => { setCode(c); setSearched(c); setNotFound(false); }}>
                {c}
              </Button>
            ))}
          </VStack>
        </Box>
      )}
    </VStack>
  );
}

function InfoItem({ icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <HStack spacing={1.5}>
      <Icon as={icon} boxSize={3.5} color="gray.400" />
      <Text fontSize="sm" color="gray.600">{label}</Text>
    </HStack>
  );
}
