import {
  Alert, AlertIcon, Box, Button, Flex, FormControl, FormErrorMessage,
  FormLabel, Heading, Icon, IconButton, Input, InputGroup, InputRightElement,
  Link, Text, useToast, VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { loginSchema, type LoginSchema } from '@/utils/validators';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [showPass, setShowPass] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginSchema) => {
    setApiError('');
    try {
      await login(data.email, data.password);
      // role comes from backend response stored in AuthContext
      const stored = localStorage.getItem('contratia_auth');
      const parsed = stored ? JSON.parse(stored) : null;
      const role = parsed?.user?.role;
      navigate(role === 'company' ? '/empresa/dashboard' : '/entidad/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setApiError(msg ?? 'Credenciales incorrectas. Por favor, inténtalo nuevamente.');
    }
  };

  return (
    <Box w="100%" maxW="440px">
      <Box bg="white" borderRadius="2xl" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={8}>
        <VStack spacing={6} align="stretch">
          {/* Logo */}
          <VStack spacing={1} align="center">
            <Flex w="44px" h="44px" bg="brand.800" borderRadius="xl" align="center" justify="center">
              <Text color="white" fontWeight="800" fontSize="xl">C</Text>
            </Flex>
            <Heading size="md" color="gray.800" fontWeight="700" mt={1}>Iniciar sesión</Heading>
            <Text fontSize="sm" color="gray.500">Bienvenido de vuelta</Text>
          </VStack>

          {apiError && (
            <Alert status="error" borderRadius="lg" fontSize="sm">
              <AlertIcon />
              {apiError}
            </Alert>
          )}

          <Box as="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <VStack spacing={4} align="stretch">
              <FormControl isInvalid={!!errors.email} isRequired>
                <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Correo institucional</FormLabel>
                <Input
                  type="email"
                  placeholder="correo@entidad.gob.pe"
                  {...register('email')}
                  size="md"
                />
                <FormErrorMessage fontSize="xs">{errors.email?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password} isRequired>
                <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Contraseña</FormLabel>
                <InputGroup>
                  <Input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password')}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPass ? 'Ocultar' : 'Mostrar'}
                      icon={<Icon as={showPass ? FiEyeOff : FiEye} />}
                      variant="ghost" size="sm"
                      onClick={() => setShowPass(s => !s)}
                      color="gray.400"
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage fontSize="xs">{errors.password?.message}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                w="100%"
                size="md"
                isLoading={isSubmitting}
                loadingText="Ingresando..."
                mt={2}
              >
                Ingresar
              </Button>
            </VStack>
          </Box>

          <VStack spacing={2} align="center">
            <Link fontSize="sm" color="brand.700" fontWeight="500">¿Olvidaste tu contraseña?</Link>
            <Text fontSize="sm" color="gray.500">
              ¿No tienes cuenta?{' '}
              <Link as={RouterLink} to="/auth/registro" color="brand.700" fontWeight="600">
                Regístrate
              </Link>
            </Text>
          </VStack>

          {/* Demo hint */}
          <Box bg="gray.50" borderRadius="lg" p={3}>
            <Text fontSize="xs" color="gray.500" fontWeight="600" mb={1}>Demo: registra tu cuenta en /auth/registro</Text>
            <Text fontSize="xs" color="gray.500">El sistema no requiere verificación por correo.</Text>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
