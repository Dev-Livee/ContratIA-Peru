import {
  Box, Button, Container, Flex, Grid, Heading, HStack, Icon,
  Input, InputGroup, InputLeftElement, Select, SimpleGrid, Stat,
  StatLabel, StatNumber, Text, VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBarChart2, FiHash, FiMapPin, FiSearch } from 'react-icons/fi';
import PublicNavbar from '@/components/Layout/PublicNavbar';
import Hero3DBackground from '@/components/Common/Hero3DBackground';
import VizMessage from '@/components/Common/VizMessage';
import { DISTRICTS } from '@/utils/constants';

export default function Landing() {
  const navigate = useNavigate();
  const [distrito, setDistrito] = useState('');
  const [codigo, setCodigo] = useState('');

  const goToObras = () => {
    if (distrito) navigate(`/obras?distrito=${encodeURIComponent(distrito)}`);
    else navigate('/obras');
  };

  const goToCodigo = () => {
    if (codigo.trim()) navigate(`/obras/${codigo.trim().toUpperCase()}`);
  };

  return (
    <Box minH="100vh" bg="white">
      <PublicNavbar />

      {/* Hero */}
      <Box position="relative" bg="white" py={{ base: 16, md: 24 }} textAlign="center" overflow="hidden">
        <Hero3DBackground />
        <Container maxW="720px" position="relative" zIndex={1}>
          <VStack spacing={5}>
            <Box px={3} py={1} bg="brand.100" borderRadius="full" display="inline-flex" backdropFilter="blur(8px)">
              <Text fontSize="xs" fontWeight="600" color="brand.700">Plataforma de transparencia pública</Text>
            </Box>
            <Heading
              size={{ base: '2xl', md: '3xl' }}
              color="gray.900"
              fontWeight="800"
              lineHeight="1.1"
            >
              Conoce las obras públicas de tu distrito
            </Heading>
            <Text color="gray.600" fontSize={{ base: 'md', md: 'lg' }} maxW="480px">
              Transparencia en tiempo real. Sin necesidad de registrarte.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Action cards */}
      <Container maxW="900px" pb={16}>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={5}>
          {/* Card 1: District search */}
          <Box bg="white" borderRadius="xl" p={6} borderWidth="2px" borderColor="brand.100" boxShadow="sm">
            <HStack spacing={3} mb={4}>
              <Box p={2} bg="brand.100" borderRadius="lg">
                <Icon as={FiMapPin} boxSize={5} color="brand.700" />
              </Box>
              <Box>
                <Text fontWeight="700" color="gray.800">Buscar por distrito</Text>
                <Text fontSize="xs" color="gray.500">Encuentra obras en tu zona</Text>
              </Box>
            </HStack>
            <VStack spacing={3} align="stretch">
              <Select
                placeholder="Selecciona tu distrito"
                value={distrito}
                onChange={e => setDistrito(e.target.value)}
                bg="gray.50"
              >
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </Select>
              <Button onClick={goToObras} w="100%">
                Ver obras
              </Button>
            </VStack>
          </Box>

          {/* Card 2: Code search */}
          <Box bg="white" borderRadius="xl" p={6} borderWidth="2px" borderColor="gray.200" boxShadow="sm">
            <HStack spacing={3} mb={4}>
              <Box p={2} bg="gray.100" borderRadius="lg">
                <Icon as={FiHash} boxSize={5} color="gray.600" />
              </Box>
              <Box>
                <Text fontWeight="700" color="gray.800">Tengo un código de obra</Text>
                <Text fontSize="xs" color="gray.500">Busca directamente con el código</Text>
              </Box>
            </HStack>
            <VStack spacing={3} align="stretch">
              <InputGroup>
                <InputLeftElement><Icon as={FiSearch} color="gray.400" /></InputLeftElement>
                <Input
                  placeholder="COD-2025-XXXX"
                  value={codigo}
                  onChange={e => setCodigo(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && goToCodigo()}
                  bg="gray.50"
                  fontFamily="mono"
                />
              </InputGroup>
              <Button variant="outline" onClick={goToCodigo} w="100%" isDisabled={!codigo.trim()}>
                Buscar obra
              </Button>
            </VStack>
          </Box>
        </Grid>

        {/* Stats */}
        <SimpleGrid columns={{ base: 3 }} spacing={4} mt={10}>
          {[
            { label: 'Obras activas', value: '1,248', icon: FiBarChart2 },
            { label: 'Presupuesto total', value: 'S/ 8.3B', icon: FiBarChart2 },
            { label: 'Distritos cubiertos', value: '195', icon: FiMapPin },
          ].map(stat => (
            <Box key={stat.label} textAlign="center" py={5} px={3} bg="gray.50" borderRadius="xl">
              <Stat>
                <StatNumber fontSize={{ base: 'xl', md: '2xl' }} fontWeight="800" color="brand.700">{stat.value}</StatNumber>
                <StatLabel fontSize="xs" color="gray.500" mt={0.5}>{stat.label}</StatLabel>
              </Stat>
            </Box>
          ))}
        </SimpleGrid>
      </Container>

      {/* Viz greeting */}
      <Container maxW="900px" pb={10}>
        <Flex justify="center">
          <VizMessage pose="greeting" message="¡Hola! Soy Viz, tu asistente de transparencia. Te ayudo a encontrar información de obras públicas." size={90} />
        </Flex>
      </Container>

      {/* Footer bar */}
      <Box bg="gray.900" py={5} textAlign="center">
        <Text fontSize="sm" color="gray.400">
          ContrataIA Perú — Plataforma de transparencia en contrataciones públicas
        </Text>
      </Box>
    </Box>
  );
}
