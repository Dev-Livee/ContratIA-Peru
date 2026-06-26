import {
  Alert, AlertIcon, Box, Button, Flex, FormControl, FormErrorMessage, FormLabel,
  Grid, Heading, HStack, Icon, Input, NumberInput, NumberInputField,
  Select, Text, Textarea, useToast, VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiCheck, FiSave, FiUpload } from 'react-icons/fi';
import { proyectoSchema, type ProyectoSchema } from '@/utils/validators';
import { DISTRICTS, RUBROS } from '@/utils/constants';
import { formatCurrency } from '@/utils/helpers';

const STEPS = ['Información', 'Requisitos', 'Confirmar'];

function StepBar({ current }: { current: number }) {
  return (
    <HStack spacing={0} mb={6}>
      {STEPS.map((label, i) => (
        <HStack key={label} spacing={0} flex={i < STEPS.length - 1 ? 1 : 0}>
          <VStack spacing={1} align="center" minW="90px">
            <Flex
              w="32px" h="32px" borderRadius="full"
              bg={i <= current ? 'brand.700' : 'gray.200'}
              color={i <= current ? 'white' : 'gray.400'}
              align="center" justify="center" fontWeight="700" fontSize="sm"
              transition="all 0.2s"
            >
              {i < current ? <Icon as={FiCheck} /> : i + 1}
            </Flex>
            <Text fontSize="xs" color={i <= current ? 'brand.700' : 'gray.400'} fontWeight={i === current ? '600' : '400'}>
              {label}
            </Text>
          </VStack>
          {i < STEPS.length - 1 && (
            <Box h="2px" flex={1} bg={i < current ? 'brand.700' : 'gray.200'} mb={4} transition="background 0.2s" />
          )}
        </HStack>
      ))}
    </HStack>
  );
}

export default function ProyectoNuevo() {
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(0);

  const {
    register,
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<ProyectoSchema>({ resolver: zodResolver(proyectoSchema), mode: 'onChange' });

  const values = watch();

  const nextStep = async () => {
    const step1Fields: Array<keyof ProyectoSchema> = ['nombre', 'descripcion', 'rubro', 'distrito', 'presupuesto', 'fechaInicio', 'fechaFin'];
    const valid = await trigger(step === 0 ? step1Fields : []);
    if (valid) setStep(s => s + 1);
  };

  const onSubmit = async (data: ProyectoSchema) => {
    await new Promise(r => setTimeout(r, 900));
    toast({
      title: 'Proyecto publicado exitosamente',
      description: `"${data.nombre}" está ahora en evaluación.`,
      status: 'success', duration: 4000, isClosable: true, position: 'top-right',
    });
    navigate('/entidad/proyectos');
  };

  return (
    <VStack spacing={5} align="stretch">
      <Flex align="center" gap={3}>
        <Button variant="ghost" leftIcon={<Icon as={FiArrowLeft} />} color="gray.500" size="sm" onClick={() => navigate(-1)}>
          Volver
        </Button>
      </Flex>

      <Box>
        <Heading size="lg" color="gray.800" fontWeight="700">Nuevo proyecto</Heading>
        <Text color="gray.500" fontSize="sm">Completa los 3 pasos para publicar tu proyecto</Text>
      </Box>

      <Box as="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box bg="white" borderRadius="xl" p={6} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
          <StepBar current={step} />

          {/* Step 0: Información básica */}
          {step === 0 && (
            <VStack spacing={4} align="stretch">
              <Heading size="sm" color="gray.700" fontWeight="600">Información básica</Heading>

              <FormControl isInvalid={!!errors.nombre} isRequired>
                <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Nombre del proyecto</FormLabel>
                <Input placeholder="Ej: Mejoramiento de pistas Av. Principal" {...register('nombre')} />
                <FormErrorMessage fontSize="xs">{errors.nombre?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.descripcion} isRequired>
                <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Descripción</FormLabel>
                <Textarea placeholder="Describe el alcance y objetivos del proyecto..." {...register('descripcion')} rows={4} />
                <FormErrorMessage fontSize="xs">{errors.descripcion?.message}</FormErrorMessage>
              </FormControl>

              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                <FormControl isInvalid={!!errors.rubro} isRequired>
                  <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Rubro</FormLabel>
                  <Select placeholder="Selecciona..." {...register('rubro')}>
                    {RUBROS.map(r => <option key={r} value={r}>{r}</option>)}
                  </Select>
                  <FormErrorMessage fontSize="xs">{errors.rubro?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.distrito} isRequired>
                  <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Distrito</FormLabel>
                  <Select placeholder="Selecciona..." {...register('distrito')}>
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </Select>
                  <FormErrorMessage fontSize="xs">{errors.distrito?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.presupuesto} isRequired>
                  <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Presupuesto (S/.)</FormLabel>
                  <Controller
                    name="presupuesto"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <NumberInput min={0} value={value ?? ''} onChange={(_str, num) => onChange(num)}>
                        <NumberInputField placeholder="0" />
                      </NumberInput>
                    )}
                  />
                  <FormErrorMessage fontSize="xs">{errors.presupuesto?.message}</FormErrorMessage>
                </FormControl>

                <Box />

                <FormControl isInvalid={!!errors.fechaInicio} isRequired>
                  <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Fecha inicio estimada</FormLabel>
                  <Input type="date" {...register('fechaInicio')} />
                  <FormErrorMessage fontSize="xs">{errors.fechaInicio?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.fechaFin} isRequired>
                  <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Fecha fin estimada</FormLabel>
                  <Input type="date" {...register('fechaFin')} />
                  <FormErrorMessage fontSize="xs">{errors.fechaFin?.message}</FormErrorMessage>
                </FormControl>
              </Grid>
            </VStack>
          )}

          {/* Step 1: Requisitos técnicos */}
          {step === 1 && (
            <VStack spacing={4} align="stretch">
              <Heading size="sm" color="gray.700" fontWeight="600">Requisitos técnicos</Heading>

              <FormControl isInvalid={!!errors.descripcionTecnica}>
                <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Descripción técnica</FormLabel>
                <Textarea placeholder="Especificaciones técnicas detalladas del proyecto..." {...register('descripcionTecnica')} rows={5} />
                <FormErrorMessage fontSize="xs">{errors.descripcionTecnica?.message}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Experiencia mínima (años)</FormLabel>
                <Controller
                  name="experienciaMinima"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <NumberInput min={0} max={50} value={value ?? 0} onChange={(_str, num) => onChange(num)} maxW="160px">
                      <NumberInputField />
                    </NumberInput>
                  )}
                />
              </FormControl>

              {/* File dropzone */}
              <Box>
                <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Archivos adjuntos</FormLabel>
                <Box
                  border="2px dashed" borderColor="gray.200" borderRadius="xl" p={8}
                  textAlign="center" cursor="pointer"
                  _hover={{ borderColor: 'brand.700', bg: 'brand.50' }}
                  transition="all 0.15s"
                >
                  <Icon as={FiUpload} boxSize={8} color="gray.300" mb={2} />
                  <Text color="gray.600" fontWeight="500" fontSize="sm">Arrastra archivos aquí</Text>
                  <Text color="gray.400" fontSize="xs" mt={1}>PDF, DOC, DOCX — máx. 10 MB c/u</Text>
                </Box>
              </Box>
            </VStack>
          )}

          {/* Step 2: Confirmar */}
          {step === 2 && (
            <VStack spacing={4} align="stretch">
              <Heading size="sm" color="gray.700" fontWeight="600">Confirmar publicación</Heading>
              <Alert status="info" borderRadius="lg" fontSize="sm">
                <AlertIcon />
                Revisa la información antes de publicar. El proyecto será visible para las empresas registradas.
              </Alert>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                {[
                  { label: 'Nombre', value: values.nombre },
                  { label: 'Rubro', value: values.rubro },
                  { label: 'Distrito', value: values.distrito },
                  { label: 'Presupuesto', value: values.presupuesto ? formatCurrency(values.presupuesto) : '—' },
                  { label: 'Fecha inicio', value: values.fechaInicio },
                  { label: 'Fecha fin', value: values.fechaFin },
                ].map(f => (
                  <Box key={f.label} bg="gray.50" borderRadius="lg" p={3}>
                    <Text fontSize="xs" color="gray.500" mb={0.5}>{f.label}</Text>
                    <Text fontSize="sm" fontWeight="600" color="gray.800">{f.value || '—'}</Text>
                  </Box>
                ))}
              </Grid>
              {values.descripcion && (
                <Box bg="gray.50" borderRadius="lg" p={3}>
                  <Text fontSize="xs" color="gray.500" mb={0.5}>Descripción</Text>
                  <Text fontSize="sm" color="gray.700">{values.descripcion}</Text>
                </Box>
              )}
            </VStack>
          )}

          {/* Navigation */}
          <HStack justify="space-between" mt={6}>
            <Button
              variant="outline" size="md"
              onClick={() => step > 0 ? setStep(s => s - 1) : navigate(-1)}
              leftIcon={<Icon as={FiArrowLeft} />}
            >
              {step === 0 ? 'Cancelar' : 'Anterior'}
            </Button>
            {step < 2 ? (
              <Button size="md" rightIcon={<Icon as={FiArrowRight} />} onClick={nextStep}>
                Siguiente
              </Button>
            ) : (
              <Button
                type="submit" size="md"
                leftIcon={<Icon as={FiSave} />}
                isLoading={isSubmitting} loadingText="Publicando..."
              >
                Publicar proyecto
              </Button>
            )}
          </HStack>
        </Box>
      </Box>
    </VStack>
  );
}
