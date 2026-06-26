import {
  Badge, Box, Button, Flex, FormControl, FormErrorMessage, FormLabel,
  Grid, Heading, HStack, Icon, Input, Select, Tag, TagCloseButton,
  TagLabel, Textarea, Text, useToast, VStack,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiPlus, FiSave } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { useEmpresaPerfil } from '@/components/hooks/useObras';
import api from '@/services/api';
import { perfilEmpresaSchema, type PerfilEmpresaSchema } from '@/utils/validators';
import { RUBROS, REGIONES } from '@/utils/constants';

export default function EmpresaPerfil() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const { data: perfil } = useEmpresaPerfil();
  const [rubros, setRubros] = useState<string[]>([]);
  const [regiones, setRegiones] = useState<string[]>(['Lima']);
  const [rubroInput, setRubroInput] = useState('');
  const [regionInput, setRegionInput] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PerfilEmpresaSchema>({
    resolver: zodResolver(perfilEmpresaSchema),
    defaultValues: {
      representante: '',
      correoContacto: user?.email ?? '',
      rubros: [],
      regiones: ['Lima'],
      descripcion: '',
    },
  });

  useEffect(() => {
    if (perfil) {
      reset({
        representante: perfil.representanteLegal ?? '',
        correoContacto: perfil.email ?? user?.email ?? '',
        rubros,
        regiones,
        descripcion: perfil.descripcion ?? '',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perfil]);

  const addRubro = () => {
    if (rubroInput && !rubros.includes(rubroInput)) { setRubros(r => [...r, rubroInput]); }
    setRubroInput('');
  };
  const addRegion = () => {
    if (regionInput && !regiones.includes(regionInput)) { setRegiones(r => [...r, regionInput]); }
    setRegionInput('');
  };

  const onSubmit = async (data: PerfilEmpresaSchema) => {
    try {
      await api.put('/empresa/perfil', {
        representanteLegal: data.representante,
        descripcion: data.descripcion,
        telefono: perfil?.telefono ?? '',
        sitioWeb: perfil?.sitioWeb ?? '',
        sector: perfil?.sector ?? 'Construccion',
      });
      updateUser({ name: data.representante });
      toast({ title: 'Perfil actualizado', status: 'success', duration: 2500, position: 'top-right' });
    } catch {
      toast({ title: 'Error al guardar', status: 'error', duration: 2500, position: 'top-right' });
    }
  };

  const completeness = Math.min(100, [perfil?.razonSocial, perfil?.ruc, rubros.length > 0, perfil?.descripcion].filter(Boolean).length * 25);

  return (
    <VStack spacing={5} align="stretch">
      <Flex justify="space-between" align={{ base: 'flex-start', md: 'center' }} flexWrap="wrap" gap={3}>
        <Box>
          <Heading size="lg" color="gray.800" fontWeight="700">Mi perfil</Heading>
          <Text color="gray.500" fontSize="sm">Gestiona la información de tu empresa</Text>
        </Box>
        <Badge
          colorScheme={completeness === 100 ? 'green' : 'yellow'}
          variant="subtle"
          fontSize="sm" px={3} py={1} borderRadius="full"
        >
          Perfil {completeness}% completo
        </Badge>
      </Flex>

      <Box as="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={5}>
          <VStack spacing={4} align="stretch">
            {/* Información general */}
            <Box bg="white" borderRadius="xl" p={6} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
              <Heading size="sm" color="gray.700" fontWeight="600" mb={4}>Información general</Heading>
              <VStack spacing={4} align="stretch">
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Razón social</FormLabel>
                    <Input value={user?.razonSocial ?? ''} isReadOnly bg="gray.50" />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="500" color="gray.700">RUC</FormLabel>
                    <Input value={user?.ruc ?? ''} isReadOnly bg="gray.50" />
                  </FormControl>
                </Grid>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl isInvalid={!!errors.representante} isRequired>
                    <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Representante legal</FormLabel>
                    <Input {...register('representante')} />
                    <FormErrorMessage fontSize="xs">{errors.representante?.message}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors.correoContacto} isRequired>
                    <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Correo de contacto</FormLabel>
                    <Input type="email" {...register('correoContacto')} />
                    <FormErrorMessage fontSize="xs">{errors.correoContacto?.message}</FormErrorMessage>
                  </FormControl>
                </Grid>
                <FormControl isInvalid={!!errors.descripcion}>
                  <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Descripción breve</FormLabel>
                  <Textarea {...register('descripcion')} rows={3} placeholder="Especialidad, años de experiencia..." />
                  <FormErrorMessage fontSize="xs">{errors.descripcion?.message}</FormErrorMessage>
                </FormControl>
              </VStack>
            </Box>

            {/* Rubros */}
            <Box bg="white" borderRadius="xl" p={6} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
              <Heading size="sm" color="gray.700" fontWeight="600" mb={3}>Rubros de trabajo</Heading>
              <HStack flexWrap="wrap" mb={3} spacing={2}>
                {rubros.map(r => (
                  <Tag key={r} colorScheme="brand" variant="subtle" borderRadius="full">
                    <TagLabel>{r}</TagLabel>
                    <TagCloseButton onClick={() => setRubros(prev => prev.filter(x => x !== r))} />
                  </Tag>
                ))}
              </HStack>
              <HStack>
                <Select size="sm" value={rubroInput} onChange={e => setRubroInput(e.target.value)} placeholder="Agregar rubro">
                  {(RUBROS as readonly string[]).filter(r => !rubros.includes(r)).map(r => <option key={r} value={r}>{r}</option>)}
                </Select>
                <Button size="sm" leftIcon={<Icon as={FiPlus} />} onClick={addRubro} flexShrink={0}>Añadir</Button>
              </HStack>
            </Box>

            {/* Regiones */}
            <Box bg="white" borderRadius="xl" p={6} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
              <Heading size="sm" color="gray.700" fontWeight="600" mb={3}>Regiones de operación</Heading>
              <HStack flexWrap="wrap" mb={3} spacing={2}>
                {regiones.map(r => (
                  <Tag key={r} colorScheme="blue" variant="subtle" borderRadius="full">
                    <TagLabel>{r}</TagLabel>
                    <TagCloseButton onClick={() => setRegiones(prev => prev.filter(x => x !== r))} />
                  </Tag>
                ))}
              </HStack>
              <HStack>
                <Select size="sm" value={regionInput} onChange={e => setRegionInput(e.target.value)} placeholder="Agregar región">
                  {(REGIONES as readonly string[]).filter(r => !regiones.includes(r)).map(r => <option key={r} value={r}>{r}</option>)}
                </Select>
                <Button size="sm" leftIcon={<Icon as={FiPlus} />} onClick={addRegion} flexShrink={0}>Añadir</Button>
              </HStack>
            </Box>
          </VStack>

          {/* Right column */}
          <VStack spacing={4} align="stretch">
            <Box bg="white" borderRadius="xl" p={5} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
              <Heading size="sm" color="gray.700" fontWeight="600" mb={3}>Estado SUNAT</Heading>
              <HStack>
                <Badge colorScheme="green" variant="solid" borderRadius="full" px={3}>Activo</Badge>
                <Text fontSize="xs" color="gray.500">RUC habilitado</Text>
              </HStack>
            </Box>

            <Box bg="brand.100" borderRadius="xl" p={4}>
              <Text fontSize="xs" fontWeight="600" color="brand.700" mb={1}>Tip</Text>
              <Text fontSize="xs" color="brand.800">Un perfil completo aumenta tus probabilidades de ser recomendado por la IA.</Text>
            </Box>

            <Button
              type="submit" w="100%" leftIcon={<Icon as={FiSave} />}
              isLoading={isSubmitting} loadingText="Guardando..."
            >
              Guardar cambios
            </Button>
          </VStack>
        </Grid>
      </Box>
    </VStack>
  );
}
