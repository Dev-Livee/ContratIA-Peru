import {
  Alert, AlertIcon, Badge, Box, Button, Flex, FormControl, FormErrorMessage,
  FormLabel, Heading, HStack, Icon, Input, Select, Spinner, Text, useToast, VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FiCheck, FiLink } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { registroSchema, type RegistroSchema } from '@/utils/validators';

const STEPS = ['Datos', 'Verificación', 'Listo'];

function StepIndicator({ current }: { current: number }) {
  return (
    <HStack spacing={0} justify="center" mb={6}>
      {STEPS.map((label, i) => (
        <HStack key={label} spacing={0}>
          <VStack spacing={1} align="center" minW="70px">
            <Flex
              w="28px" h="28px" borderRadius="full"
              bg={i <= current ? 'brand.700' : 'gray.200'}
              color={i <= current ? 'white' : 'gray.400'}
              align="center" justify="center"
              fontSize="xs" fontWeight="700"
              transition="all 0.2s"
            >
              {i < current ? <Icon as={FiCheck} boxSize={3} /> : i + 1}
            </Flex>
            <Text fontSize="xs" color={i <= current ? 'brand.700' : 'gray.400'} fontWeight={i === current ? '600' : '400'}>
              {label}
            </Text>
          </VStack>
          {i < STEPS.length - 1 && (
            <Box h="2px" w="40px" bg={i < current ? 'brand.700' : 'gray.200'} mb={4} transition="background 0.2s" />
          )}
        </HStack>
      ))}
    </HStack>
  );
}

export default function Registro() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [sunatLoading, setSunatLoading] = useState(false);
  const [sunatVerified, setSunatVerified] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegistroSchema>({ resolver: zodResolver(registroSchema), mode: 'onChange' });

  const ruc = watch('ruc');

  const verifyRuc = async () => {
    if (!ruc || ruc.length !== 11) return;
    setSunatLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setValue('razonSocial', ruc.startsWith('20') ? 'Constructora Demo S.A.C.' : 'Entidad Pública Demo');
    setSunatVerified(true);
    setSunatLoading(false);
    toast({ title: 'RUC verificado con SUNAT', status: 'success', duration: 2000, position: 'top-right' });
  };

  const onSubmit = async (data: RegistroSchema) => {
    setApiError('');
    try {
      setStep(1);
      await new Promise(r => setTimeout(r, 1000));
      setStep(2);
      await login(data.correo, data.password);
      await new Promise(r => setTimeout(r, 800));
      navigate(data.tipoCuenta === 'empresa' ? '/empresa/dashboard' : '/entidad/dashboard');
    } catch {
      setApiError('Error al crear la cuenta. Inténtalo nuevamente.');
      setStep(0);
    }
  };

  return (
    <Box w="100%" maxW="520px">
      <Box bg="white" borderRadius="2xl" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={8}>
        <VStack spacing={1} align="center" mb={6}>
          <Heading size="md" color="gray.800" fontWeight="700">Crear cuenta</Heading>
          <Text fontSize="sm" color="gray.500">Solo para entidades y empresas</Text>
        </VStack>

        <StepIndicator current={step} />

        {step === 2 ? (
          <VStack spacing={4} align="center" py={6}>
            <Flex w="60px" h="60px" bg="brand.100" borderRadius="full" align="center" justify="center">
              <Icon as={FiCheck} boxSize={7} color="brand.700" />
            </Flex>
            <Heading size="md" color="gray.800">¡Cuenta creada!</Heading>
            <Text color="gray.500" fontSize="sm" textAlign="center">Redirigiendo a tu dashboard...</Text>
            <Spinner color="brand.700" />
          </VStack>
        ) : step === 1 ? (
          <VStack spacing={4} align="center" py={8}>
            <Spinner size="xl" color="brand.700" thickness="3px" />
            <Text color="gray.600">Verificando información...</Text>
          </VStack>
        ) : (
          <Box as="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <VStack spacing={4} align="stretch">
              {apiError && (
                <Alert status="error" borderRadius="lg" fontSize="sm">
                  <AlertIcon />{apiError}
                </Alert>
              )}

              <FormControl isInvalid={!!errors.tipoCuenta} isRequired>
                <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Tipo de cuenta</FormLabel>
                <Controller
                  name="tipoCuenta"
                  control={control}
                  render={({ field }) => (
                    <Select placeholder="Selecciona..." {...field}>
                      <option value="entidad">Entidad Pública</option>
                      <option value="empresa">Empresa Privada</option>
                    </Select>
                  )}
                />
                <FormErrorMessage fontSize="xs">{errors.tipoCuenta?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.ruc} isRequired>
                <FormLabel fontSize="sm" fontWeight="500" color="gray.700">RUC</FormLabel>
                <HStack>
                  <Input
                    placeholder="20512345678"
                    {...register('ruc')}
                    maxLength={11}
                    fontFamily="mono"
                  />
                  <Button
                    size="md" variant="outline" px={4} flexShrink={0}
                    onClick={verifyRuc}
                    isLoading={sunatLoading}
                    isDisabled={!ruc || ruc.length !== 11}
                    leftIcon={sunatVerified ? <Icon as={FiCheck} color="brand.700" /> : undefined}
                  >
                    {sunatVerified ? 'Verificado' : 'Verificar'}
                  </Button>
                </HStack>
                <FormErrorMessage fontSize="xs">{errors.ruc?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.razonSocial} isRequired>
                <FormLabel fontSize="sm" fontWeight="500" color="gray.700">
                  Razón social
                  {sunatVerified && <Badge colorScheme="green" ml={2} fontSize="xs">SUNAT</Badge>}
                </FormLabel>
                <Input
                  {...register('razonSocial')}
                  isReadOnly={sunatVerified}
                  bg={sunatVerified ? 'gray.50' : 'white'}
                />
                <FormErrorMessage fontSize="xs">{errors.razonSocial?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.correo} isRequired>
                <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Correo institucional</FormLabel>
                <Input type="email" placeholder="correo@entidad.gob.pe" {...register('correo')} />
                <FormErrorMessage fontSize="xs">{errors.correo?.message}</FormErrorMessage>
              </FormControl>

              <HStack spacing={3} align="flex-start">
                <FormControl isInvalid={!!errors.dniRepresentante} isRequired>
                  <FormLabel fontSize="sm" fontWeight="500" color="gray.700">DNI representante</FormLabel>
                  <Input placeholder="12345678" {...register('dniRepresentante')} maxLength={8} fontFamily="mono" />
                  <FormErrorMessage fontSize="xs">{errors.dniRepresentante?.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.nombreRepresentante} isRequired>
                  <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Nombre representante</FormLabel>
                  <Input placeholder="Juan Pérez" {...register('nombreRepresentante')} />
                  <FormErrorMessage fontSize="xs">{errors.nombreRepresentante?.message}</FormErrorMessage>
                </FormControl>
              </HStack>

              <HStack spacing={3} align="flex-start">
                <FormControl isInvalid={!!errors.password} isRequired>
                  <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Contraseña</FormLabel>
                  <Input type="password" placeholder="••••••••" {...register('password')} />
                  <FormErrorMessage fontSize="xs">{errors.password?.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.confirmPassword} isRequired>
                  <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Confirmar</FormLabel>
                  <Input type="password" placeholder="••••••••" {...register('confirmPassword')} />
                  <FormErrorMessage fontSize="xs">{errors.confirmPassword?.message}</FormErrorMessage>
                </FormControl>
              </HStack>

              <Button type="submit" w="100%" size="md" isLoading={isSubmitting} loadingText="Creando cuenta..." mt={2}>
                Crear cuenta
              </Button>

              <Text fontSize="sm" color="gray.500" textAlign="center">
                ¿Ya tienes cuenta?{' '}
                <RouterLink to="/auth/login" style={{ color: 'var(--chakra-colors-brand-700)', fontWeight: 600 }}>
                  Inicia sesión
                </RouterLink>
              </Text>
            </VStack>
          </Box>
        )}
      </Box>
    </Box>
  );
}

