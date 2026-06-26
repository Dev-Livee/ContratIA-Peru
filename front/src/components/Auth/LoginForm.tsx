import {
  Box, Button, FormControl, FormLabel, Input, VStack, Heading,
  Text, Link, FormErrorMessage, Alert, AlertIcon, InputGroup,
  InputRightElement, IconButton, Divider, HStack, Checkbox,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email) e.email = 'El correo es requerido';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Correo inválido';
    if (!password) e.password = 'La contraseña es requerida';
    else if (password.length < 6) e.password = 'Mínimo 6 caracteres';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
      // Role-based redirect
      if (email.includes('entidad') || email.includes('gob')) navigate('/entidad');
      else if (email.includes('empresa') || email.includes('corp')) navigate('/empresa');
      else navigate('/ciudadano');
    } catch {
      setError('Credenciales incorrectas. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} noValidate>
      <VStack spacing={5}>
        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <FormControl isInvalid={!!errors.email}>
          <FormLabel color="gray.700" fontWeight="500" fontSize="sm">Correo electrónico</FormLabel>
          <Input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            size="lg"
            focusBorderColor="brand.primary"
          />
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <FormLabel color="gray.700" fontWeight="500" fontSize="sm">Contraseña</FormLabel>
          <InputGroup size="lg">
            <Input
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              focusBorderColor="brand.primary"
            />
            <InputRightElement>
              <IconButton
                aria-label={showPass ? 'Ocultar' : 'Mostrar'}
                icon={showPass ? <FiEyeOff /> : <FiEye />}
                variant="ghost"
                size="sm"
                onClick={() => setShowPass(s => !s)}
                color="gray.400"
              />
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{errors.password}</FormErrorMessage>
        </FormControl>

        <HStack w="100%" justify="space-between">
          <Checkbox colorScheme="green" size="sm" defaultChecked>
            <Text fontSize="sm" color="gray.600">Recordarme</Text>
          </Checkbox>
          <Link fontSize="sm" color="brand.primary" fontWeight="500">¿Olvidaste tu contraseña?</Link>
        </HStack>

        <Button
          type="submit"
          w="100%"
          size="lg"
          bg="brand.primaryDark"
          color="white"
          _hover={{ bg: 'brand.800' }}
          _active={{ bg: 'brand.900' }}
          isLoading={isLoading}
          loadingText="Ingresando..."
          borderRadius="md"
          fontWeight="600"
        >
          Ingresar
        </Button>

        <Divider borderColor="gray.200" />

        <Text fontSize="sm" color="gray.600">
          ¿No tienes cuenta?{' '}
          <Link as={RouterLink} to="/registro" color="brand.primary" fontWeight="600">
            Regístrate aquí
          </Link>
        </Text>

        <Box bg="gray.50" borderRadius="md" p={3} w="100%">
          <Text fontSize="xs" color="gray.500" fontWeight="600" mb={1}>Demo rápido:</Text>
          <Text fontSize="xs" color="gray.500">Entidad: entidad@gob.pe / 123456</Text>
          <Text fontSize="xs" color="gray.500">Empresa: empresa@corp.com / 123456</Text>
          <Text fontSize="xs" color="gray.500">Ciudadano: ciudadano@mail.com / 123456</Text>
        </Box>
      </VStack>
    </Box>
  );
}
