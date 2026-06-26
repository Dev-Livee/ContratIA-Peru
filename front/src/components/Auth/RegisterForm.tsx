import {
  Box, Button, FormControl, FormLabel, Input, VStack, Select,
  FormErrorMessage, Alert, AlertIcon, HStack, Checkbox, Text, Textarea,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/utils/constants';

export default function RegisterForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: '' as Role | '', organizationName: '', ruc: '', description: '',
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const set = (field: string, value: string | boolean) =>
    setForm(f => ({ ...f, [field]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name) e.name = 'Nombre requerido';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Correo inválido';
    if (!form.role) e.role = 'Selecciona un tipo de cuenta';
    if ((form.role === 'entity' || form.role === 'company') && !form.organizationName) e.organizationName = 'Nombre de organización requerido';
    if (form.role === 'company' && !form.ruc) e.ruc = 'RUC requerido';
    if (!form.password || form.password.length < 8) e.password = 'Mínimo 8 caracteres';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden';
    if (!form.acceptTerms) e.acceptTerms = 'Debes aceptar los términos';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setServerError('');
    try {
      await login(form.email, form.password);
      const redirect = form.role === 'entity' ? '/entidad' : form.role === 'company' ? '/empresa' : '/ciudadano';
      navigate(redirect);
    } catch {
      setServerError('Error al crear la cuenta. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} noValidate>
      <VStack spacing={4}>
        {serverError && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {serverError}
          </Alert>
        )}

        <FormControl isInvalid={!!errors.role} isRequired>
          <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Tipo de cuenta</FormLabel>
          <Select placeholder="Selecciona tu rol" value={form.role} onChange={e => set('role', e.target.value)} focusBorderColor="brand.primary">
            <option value="entity">Entidad Pública</option>
            <option value="company">Empresa Privada / Proveedor</option>
            <option value="citizen">Ciudadano</option>
          </Select>
          <FormErrorMessage>{errors.role}</FormErrorMessage>
        </FormControl>

        <HStack w="100%" spacing={3}>
          <FormControl isInvalid={!!errors.name} isRequired>
            <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Nombre completo</FormLabel>
            <Input placeholder="Juan Pérez" value={form.name} onChange={e => set('name', e.target.value)} focusBorderColor="brand.primary" />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>
        </HStack>

        {(form.role === 'entity' || form.role === 'company') && (
          <FormControl isInvalid={!!errors.organizationName} isRequired>
            <FormLabel fontSize="sm" fontWeight="500" color="gray.700">
              {form.role === 'entity' ? 'Nombre de la entidad' : 'Razón social'}
            </FormLabel>
            <Input
              placeholder={form.role === 'entity' ? 'Municipalidad de Lima' : 'Empresa ABC SAC'}
              value={form.organizationName}
              onChange={e => set('organizationName', e.target.value)}
              focusBorderColor="brand.primary"
            />
            <FormErrorMessage>{errors.organizationName}</FormErrorMessage>
          </FormControl>
        )}

        {form.role === 'company' && (
          <FormControl isInvalid={!!errors.ruc} isRequired>
            <FormLabel fontSize="sm" fontWeight="500" color="gray.700">RUC</FormLabel>
            <Input placeholder="20512345678" value={form.ruc} onChange={e => set('ruc', e.target.value)} focusBorderColor="brand.primary" maxLength={11} />
            <FormErrorMessage>{errors.ruc}</FormErrorMessage>
          </FormControl>
        )}

        <FormControl isInvalid={!!errors.email} isRequired>
          <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Correo electrónico</FormLabel>
          <Input type="email" placeholder="correo@ejemplo.com" value={form.email} onChange={e => set('email', e.target.value)} focusBorderColor="brand.primary" />
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>

        <HStack w="100%" spacing={3}>
          <FormControl isInvalid={!!errors.password} isRequired>
            <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Contraseña</FormLabel>
            <Input type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} focusBorderColor="brand.primary" />
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.confirmPassword} isRequired>
            <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Confirmar contraseña</FormLabel>
            <Input type="password" placeholder="••••••••" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} focusBorderColor="brand.primary" />
            <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
          </FormControl>
        </HStack>

        {form.role === 'company' && (
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="500" color="gray.700">Descripción breve de la empresa</FormLabel>
            <Textarea placeholder="Especialidad, años de experiencia, proyectos destacados..." value={form.description} onChange={e => set('description', e.target.value)} focusBorderColor="brand.primary" rows={3} />
          </FormControl>
        )}

        <FormControl isInvalid={!!errors.acceptTerms}>
          <Checkbox
            isChecked={form.acceptTerms}
            onChange={e => set('acceptTerms', e.target.checked)}
            colorScheme="green"
          >
            <Text fontSize="sm" color="gray.600">Acepto los <Text as="span" color="brand.primary" fontWeight="600">términos y condiciones</Text></Text>
          </Checkbox>
          <FormErrorMessage>{errors.acceptTerms}</FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          w="100%"
          size="lg"
          bg="brand.primaryDark"
          color="white"
          _hover={{ bg: 'brand.800' }}
          isLoading={isLoading}
          loadingText="Creando cuenta..."
          borderRadius="md"
          fontWeight="600"
        >
          Crear cuenta
        </Button>
      </VStack>
    </Box>
  );
}
