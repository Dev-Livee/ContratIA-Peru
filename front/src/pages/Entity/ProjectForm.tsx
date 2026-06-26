import {
  Box, Button, Divider, Flex, FormControl, FormErrorMessage, FormLabel,
  Grid, Heading, Icon, Input, NumberInput, NumberInputField, Select,
  Textarea, Text, VStack, useToast, HStack, Alert, AlertIcon,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiUpload } from 'react-icons/fi';
import { useProjects } from '@/context/ProjectContext';
import { DISTRICTS, RUBROS } from '@/utils/constants';

interface FormData {
  name: string;
  description: string;
  budget: string;
  rubro: string;
  district: string;
  deadline: string;
  requirements: string;
}

const INIT: FormData = { name: '', description: '', budget: '', rubro: '', district: '', deadline: '', requirements: '' };

export default function ProjectForm() {
  const { addProject } = useProjects();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState<FormData>(INIT);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.name.trim()) e.name = 'Nombre requerido';
    if (!form.description.trim()) e.description = 'Descripción requerida';
    if (!form.budget || isNaN(Number(form.budget)) || Number(form.budget) <= 0) e.budget = 'Presupuesto válido requerido';
    if (!form.rubro) e.rubro = 'Selecciona un rubro';
    if (!form.district) e.district = 'Selecciona un distrito';
    if (!form.deadline) e.deadline = 'Fecha límite requerida';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    addProject({
      name: form.name,
      description: form.description,
      budget: Number(form.budget),
      rubro: form.rubro,
      district: form.district,
      deadline: form.deadline,
      requirements: form.requirements,
    });
    toast({
      title: 'Proyecto creado exitosamente',
      description: 'Tu proyecto ha sido registrado y está en evaluación.',
      status: 'success',
      duration: 4000,
      isClosable: true,
      position: 'top-right',
    });
    setIsLoading(false);
    navigate('/entidad/proyectos');
  };

  return (
    <VStack spacing={6} align="stretch">
      <Flex align="center" gap={3}>
        <Button variant="ghost" leftIcon={<Icon as={FiArrowLeft} />} color="gray.500" onClick={() => navigate(-1)} size="sm">
          Volver
        </Button>
      </Flex>

      <Box>
        <Heading size="lg" color="gray.800" fontWeight="700">Nuevo proyecto</Heading>
        <Text color="gray.500" fontSize="sm" mt={0.5}>Completa la información del proyecto de contratación</Text>
      </Box>

      <Box as="form" onSubmit={handleSubmit} noValidate>
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
          {/* Main fields */}
          <VStack spacing={5} align="stretch">
            <Box bg="white" borderRadius="lg" p={6} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
              <Heading size="sm" color="gray.700" fontWeight="600" mb={4}>Información básica</Heading>
              <VStack spacing={4} align="stretch">
                <FormControl isInvalid={!!errors.name} isRequired>
                  <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Nombre del proyecto</FormLabel>
                  <Input placeholder="Ej: Mejoramiento de pistas y veredas..." value={form.name} onChange={set('name')} focusBorderColor="brand.primary" />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.description} isRequired>
                  <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Descripción</FormLabel>
                  <Textarea placeholder="Describe el alcance y objetivos del proyecto..." value={form.description} onChange={set('description')} focusBorderColor="brand.primary" rows={4} />
                  <FormErrorMessage>{errors.description}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.requirements}>
                  <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Requisitos técnicos</FormLabel>
                  <Textarea placeholder="Especifica los requisitos técnicos, certificaciones, experiencia mínima..." value={form.requirements} onChange={set('requirements')} focusBorderColor="brand.primary" rows={4} />
                  <FormErrorMessage>{errors.requirements}</FormErrorMessage>
                </FormControl>
              </VStack>
            </Box>

            {/* File upload */}
            <Box bg="white" borderRadius="lg" p={6} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
              <Heading size="sm" color="gray.700" fontWeight="600" mb={4}>Documentos adjuntos</Heading>
              <Box
                border="2px dashed"
                borderColor="gray.300"
                borderRadius="lg"
                p={8}
                textAlign="center"
                _hover={{ borderColor: 'brand.primary', bg: 'brand.50' }}
                cursor="pointer"
                transition="all 0.15s"
              >
                <Icon as={FiUpload} boxSize={8} color="gray.400" mb={3} />
                <Text color="gray.600" fontWeight="500">Arrastra archivos aquí</Text>
                <Text color="gray.400" fontSize="sm" mt={1}>o haz clic para seleccionar</Text>
                <Text color="gray.400" fontSize="xs" mt={2}>PDF, DOC, XLS (máx. 10MB c/u)</Text>
              </Box>
            </Box>
          </VStack>

          {/* Side fields */}
          <VStack spacing={4} align="stretch">
            <Box bg="white" borderRadius="lg" p={6} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
              <Heading size="sm" color="gray.700" fontWeight="600" mb={4}>Detalles del proyecto</Heading>
              <VStack spacing={4} align="stretch">
                <FormControl isInvalid={!!errors.budget} isRequired>
                  <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Presupuesto (S/)</FormLabel>
                  <NumberInput min={0} value={form.budget} onChange={val => setForm(f => ({ ...f, budget: val }))}>
                    <NumberInputField placeholder="0.00" />
                  </NumberInput>
                  <FormErrorMessage>{errors.budget}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.rubro} isRequired>
                  <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Rubro</FormLabel>
                  <Select placeholder="Selecciona rubro" value={form.rubro} onChange={set('rubro')} focusBorderColor="brand.primary">
                    {RUBROS.map(r => <option key={r} value={r}>{r}</option>)}
                  </Select>
                  <FormErrorMessage>{errors.rubro}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.district} isRequired>
                  <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Distrito</FormLabel>
                  <Select placeholder="Selecciona distrito" value={form.district} onChange={set('district')} focusBorderColor="brand.primary">
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </Select>
                  <FormErrorMessage>{errors.district}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.deadline} isRequired>
                  <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Plazo de ejecución</FormLabel>
                  <Input type="date" value={form.deadline} onChange={set('deadline')} focusBorderColor="brand.primary" min={new Date().toISOString().split('T')[0]} />
                  <FormErrorMessage>{errors.deadline}</FormErrorMessage>
                </FormControl>
              </VStack>
            </Box>

            <Alert status="info" borderRadius="lg" fontSize="sm">
              <AlertIcon />
              <Text>Tu proyecto será revisado por el equipo antes de publicarse.</Text>
            </Alert>

            <Divider />

            <Button
              type="submit"
              w="100%"
              size="lg"
              leftIcon={<Icon as={FiSave} />}
              bg="brand.primaryDark"
              color="white"
              _hover={{ bg: 'brand.800' }}
              isLoading={isLoading}
              loadingText="Guardando..."
              borderRadius="md"
            >
              Crear proyecto
            </Button>
            <Button variant="outline" w="100%" borderColor="gray.300" color="gray.600" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
          </VStack>
        </Grid>
      </Box>
    </VStack>
  );
}
