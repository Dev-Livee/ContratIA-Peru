import {
  Box, Button, Divider, Flex, FormControl, FormLabel, Grid, Heading,
  Icon, Input, Select, SimpleGrid, Textarea, Text, VStack, useToast,
  NumberInput, NumberInputField, HStack, Tag, TagLabel, TagCloseButton,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiSave, FiPlus } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { RUBROS, DISTRICTS } from '@/utils/constants';

export default function ProfileForm() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [rubros, setRubros] = useState<string[]>(['Infraestructura vial']);
  const [rubroInput, setRubroInput] = useState('');

  const [form, setForm] = useState({
    organizationName: user?.organizationName ?? '',
    ruc: '20512345678',
    phone: '+51 999 888 777',
    address: 'Av. Principal 123, Lima',
    region: 'Lima',
    experience: '8',
    description: 'Empresa especializada en obras de infraestructura pública con más de 8 años de trayectoria en el mercado peruano.',
    website: 'https://empresa-demo.com.pe',
    representative: 'Juan Carlos Pérez',
    representativeEmail: user?.email ?? '',
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const addRubro = () => {
    if (rubroInput && !rubros.includes(rubroInput)) {
      setRubros(r => [...r, rubroInput]);
      setRubroInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 700));
    updateUser({ organizationName: form.organizationName });
    toast({ title: 'Perfil actualizado', status: 'success', duration: 3000, position: 'top-right' });
    setIsLoading(false);
  };

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="lg" color="gray.800" fontWeight="700">Mi perfil</Heading>
        <Text color="gray.500" fontSize="sm" mt={0.5}>Gestiona la información de tu empresa</Text>
      </Box>

      <Box as="form" onSubmit={handleSubmit} noValidate>
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
          <VStack spacing={5} align="stretch">
            <Box bg="white" borderRadius="lg" p={6} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
              <Heading size="sm" color="gray.700" fontWeight="600" mb={4}>Datos de la empresa</Heading>
              <VStack spacing={4} align="stretch">
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Razón social</FormLabel>
                    <Input value={form.organizationName} onChange={set('organizationName')} focusBorderColor="brand.primary" />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="500" color="gray.700">RUC</FormLabel>
                    <Input value={form.ruc} onChange={set('ruc')} focusBorderColor="brand.primary" maxLength={11} />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Teléfono</FormLabel>
                    <Input value={form.phone} onChange={set('phone')} focusBorderColor="brand.primary" />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Sitio web</FormLabel>
                    <Input value={form.website} onChange={set('website')} focusBorderColor="brand.primary" />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Región principal</FormLabel>
                    <Select value={form.region} onChange={set('region')} focusBorderColor="brand.primary">
                      {['Lima', 'Callao', 'Arequipa', 'La Libertad', 'Piura', 'Cusco', 'Junín'].map(r => <option key={r}>{r}</option>)}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Años de experiencia</FormLabel>
                    <NumberInput min={0} max={100} value={form.experience} onChange={val => setForm(f => ({ ...f, experience: val }))}>
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                </SimpleGrid>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Dirección</FormLabel>
                  <Input value={form.address} onChange={set('address')} focusBorderColor="brand.primary" />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Descripción de la empresa</FormLabel>
                  <Textarea value={form.description} onChange={set('description')} focusBorderColor="brand.primary" rows={4} />
                </FormControl>
              </VStack>
            </Box>

            <Box bg="white" borderRadius="lg" p={6} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
              <Heading size="sm" color="gray.700" fontWeight="600" mb={4}>Rubros de especialidad</Heading>
              <HStack wrap="wrap" mb={3} spacing={2}>
                {rubros.map(r => (
                  <Tag key={r} colorScheme="green" variant="subtle" borderRadius="full">
                    <TagLabel>{r}</TagLabel>
                    <TagCloseButton onClick={() => setRubros(prev => prev.filter(x => x !== r))} />
                  </Tag>
                ))}
              </HStack>
              <HStack>
                <Select size="sm" value={rubroInput} onChange={e => setRubroInput(e.target.value)} focusBorderColor="brand.primary" placeholder="Añadir rubro">
                  {RUBROS.filter(r => !rubros.includes(r)).map(r => <option key={r} value={r}>{r}</option>)}
                </Select>
                <Button size="sm" leftIcon={<Icon as={FiPlus} />} bg="brand.primaryDark" color="white" _hover={{ bg: 'brand.800' }} onClick={addRubro} flexShrink={0}>
                  Añadir
                </Button>
              </HStack>
            </Box>
          </VStack>

          <VStack spacing={4} align="stretch">
            <Box bg="white" borderRadius="lg" p={6} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
              <Heading size="sm" color="gray.700" fontWeight="600" mb={4}>Representante legal</Heading>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Nombre completo</FormLabel>
                  <Input value={form.representative} onChange={set('representative')} focusBorderColor="brand.primary" />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Correo electrónico</FormLabel>
                  <Input type="email" value={form.representativeEmail} onChange={set('representativeEmail')} focusBorderColor="brand.primary" />
                </FormControl>
              </VStack>
            </Box>

            <Divider />
            <Button type="submit" w="100%" size="lg" leftIcon={<Icon as={FiSave} />} bg="brand.primaryDark" color="white" _hover={{ bg: 'brand.800' }} isLoading={isLoading} borderRadius="md">
              Guardar cambios
            </Button>
          </VStack>
        </Grid>
      </Box>
    </VStack>
  );
}
