import {
  Box, Button, Flex, FormControl, FormLabel, Grid, Heading, HStack,
  Icon, Input, Select, SimpleGrid, Text, VStack, useToast, Badge,
  Table, Tbody, Td, Th, Thead, Tr, IconButton,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiPlus, FiTrash2, FiUpload, FiAward, FiCheckCircle } from 'react-icons/fi';

interface Cert {
  id: string;
  name: string;
  issuer: string;
  year: string;
  expiry: string;
  status: 'Vigente' | 'Vencido' | 'Por vencer';
}

const MOCK_CERTS: Cert[] = [
  { id: '1', name: 'ISO 9001:2015 Gestión de calidad', issuer: 'Bureau Veritas', year: '2022', expiry: '2025-06-30', status: 'Vigente' },
  { id: '2', name: 'Certificado RNP - Ejecutor de obras', issuer: 'OSCE', year: '2023', expiry: '2026-12-31', status: 'Vigente' },
  { id: '3', name: 'OHSAS 18001 Seguridad laboral', issuer: 'SGS', year: '2020', expiry: '2023-12-31', status: 'Vencido' },
];

export default function CertificationsForm() {
  const toast = useToast();
  const [certs, setCerts] = useState<Cert[]>(MOCK_CERTS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', issuer: '', year: '', expiry: '' });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const addCert = () => {
    if (!form.name || !form.issuer || !form.year) {
      toast({ title: 'Completa los campos requeridos', status: 'error', duration: 2000 });
      return;
    }
    const now = new Date();
    const expDate = form.expiry ? new Date(form.expiry) : null;
    const status: Cert['status'] = !expDate ? 'Vigente' : expDate < now ? 'Vencido' :
      expDate.getTime() - now.getTime() < 90 * 24 * 60 * 60 * 1000 ? 'Por vencer' : 'Vigente';

    setCerts(c => [...c, { id: crypto.randomUUID(), ...form, status }]);
    setForm({ name: '', issuer: '', year: '', expiry: '' });
    setShowForm(false);
    toast({ title: 'Certificación añadida', status: 'success', duration: 2000, position: 'top-right' });
  };

  const removeCert = (id: string) => setCerts(c => c.filter(x => x.id !== id));

  const statusColor = (s: Cert['status']) =>
    s === 'Vigente' ? 'green' : s === 'Por vencer' ? 'orange' : 'red';

  return (
    <VStack spacing={6} align="stretch">
      <Flex justify="space-between" align={{ base: 'flex-start', md: 'center' }} flexWrap="wrap" gap={3}>
        <Box>
          <Heading size="lg" color="gray.800" fontWeight="700">Certificaciones</Heading>
          <Text color="gray.500" fontSize="sm">Gestiona tus certificados y habilitaciones</Text>
        </Box>
        <Button leftIcon={<Icon as={FiPlus} />} bg="brand.primaryDark" color="white" _hover={{ bg: 'brand.800' }} borderRadius="md" onClick={() => setShowForm(s => !s)}>
          Nueva certificación
        </Button>
      </Flex>

      {/* Stats */}
      <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4}>
        {(['Vigente', 'Por vencer', 'Vencido'] as const).map(s => (
          <Box key={s} bg="white" borderRadius="lg" p={4} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.500">{s}</Text>
              <Icon as={s === 'Vigente' ? FiCheckCircle : FiAward} color={s === 'Vigente' ? 'green.500' : s === 'Por vencer' ? 'orange.400' : 'red.400'} />
            </HStack>
            <Text fontSize="2xl" fontWeight="700" color="gray.800">{certs.filter(c => c.status === s).length}</Text>
          </Box>
        ))}
      </SimpleGrid>

      {/* Add form */}
      {showForm && (
        <Box bg="white" borderRadius="lg" p={6} boxShadow="sm" borderWidth="1px" borderColor="brand.200">
          <Heading size="sm" color="gray.700" fontWeight="600" mb={4}>Añadir certificación</Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
            <FormControl isRequired>
              <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Nombre del certificado</FormLabel>
              <Input placeholder="Ej: ISO 9001:2015" value={form.name} onChange={set('name')} focusBorderColor="brand.primary" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Entidad emisora</FormLabel>
              <Input placeholder="Ej: OSCE, Bureau Veritas" value={form.issuer} onChange={set('issuer')} focusBorderColor="brand.primary" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Año de obtención</FormLabel>
              <Input type="number" placeholder="2024" value={form.year} onChange={set('year')} focusBorderColor="brand.primary" min="2000" max="2099" />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Fecha de vencimiento</FormLabel>
              <Input type="date" value={form.expiry} onChange={set('expiry')} focusBorderColor="brand.primary" />
            </FormControl>
          </Grid>
          <Box mt={4} border="2px dashed" borderColor="gray.200" borderRadius="lg" p={4} textAlign="center" cursor="pointer" _hover={{ borderColor: 'brand.primary' }}>
            <Icon as={FiUpload} color="gray.400" boxSize={5} />
            <Text fontSize="sm" color="gray.400" mt={1}>Adjuntar documento (PDF)</Text>
          </Box>
          <HStack mt={4} justify="flex-end" spacing={3}>
            <Button variant="ghost" color="gray.500" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button bg="brand.primaryDark" color="white" _hover={{ bg: 'brand.800' }} onClick={addCert}>Guardar</Button>
          </HStack>
        </Box>
      )}

      {/* Table */}
      <Box bg="white" borderRadius="lg" boxShadow="sm" borderWidth="1px" borderColor="gray.100" overflow="hidden">
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th textTransform="none" fontSize="xs" color="gray.500">Certificación</Th>
                <Th textTransform="none" fontSize="xs" color="gray.500">Emisor</Th>
                <Th textTransform="none" fontSize="xs" color="gray.500">Año</Th>
                <Th textTransform="none" fontSize="xs" color="gray.500">Vencimiento</Th>
                <Th textTransform="none" fontSize="xs" color="gray.500">Estado</Th>
                <Th w="60px" />
              </Tr>
            </Thead>
            <Tbody>
              {certs.length === 0 && (
                <Tr><Td colSpan={6} textAlign="center" py={8} color="gray.400">No hay certificaciones registradas</Td></Tr>
              )}
              {certs.map(c => (
                <Tr key={c.id} _hover={{ bg: 'gray.50' }}>
                  <Td><Text fontSize="sm" fontWeight="500" color="gray.800">{c.name}</Text></Td>
                  <Td><Text fontSize="sm" color="gray.600">{c.issuer}</Text></Td>
                  <Td><Text fontSize="sm">{c.year}</Text></Td>
                  <Td><Text fontSize="sm" color="gray.600">{c.expiry || '—'}</Text></Td>
                  <Td><Badge colorScheme={statusColor(c.status)} variant="subtle" borderRadius="full">{c.status}</Badge></Td>
                  <Td>
                    <IconButton aria-label="Eliminar" icon={<FiTrash2 />} variant="ghost" size="sm" color="red.400" _hover={{ bg: 'red.50' }} onClick={() => removeCert(c.id)} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </VStack>
  );
}
