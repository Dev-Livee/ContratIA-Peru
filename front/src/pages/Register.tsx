import { Box, Container, Flex, Heading, Text, VStack, Link } from '@chakra-ui/react';
import { Link as RouterLink, Navigate } from 'react-router-dom';
import RegisterForm from '@/components/Auth/RegisterForm';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/Common/LoadingSpinner';

export default function RegisterPage() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (isAuthenticated && user) {
    const redirect = user.role === 'entity' ? '/entidad' : user.role === 'company' ? '/empresa' : '/ciudadano';
    return <Navigate to={redirect} replace />;
  }

  return (
    <Flex minH="100vh" bg="gray.50" align="center" justify="center" py={12} px={4}>
      <Container maxW="520px">
        <VStack spacing={8}>
          <VStack spacing={2} textAlign="center">
            <Flex align="center" justify="center" w="56px" h="56px" bg="brand.primaryDark" borderRadius="xl">
              <Text color="white" fontWeight="800" fontSize="2xl">C</Text>
            </Flex>
            <Heading size="xl" color="brand.primaryDark" fontWeight="800">ContrataIA</Heading>
            <Text color="gray.500" fontSize="sm">Crea tu cuenta y empieza hoy</Text>
          </VStack>

          <Box w="100%" bg="white" borderRadius="xl" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={8}>
            <VStack spacing={6} align="stretch">
              <Box>
                <Heading size="md" color="gray.800" fontWeight="700">Crear cuenta</Heading>
                <Text color="gray.500" fontSize="sm" mt={1}>Completa el formulario para registrarte</Text>
              </Box>
              <RegisterForm />
            </VStack>
          </Box>

          <Text fontSize="sm" color="gray.600">
            ¿Ya tienes cuenta?{' '}
            <Link as={RouterLink} to="/login" color="brand.primary" fontWeight="600">
              Inicia sesión
            </Link>
          </Text>
        </VStack>
      </Container>
    </Flex>
  );
}
