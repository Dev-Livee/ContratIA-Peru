import { Box, Container, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { Navigate } from 'react-router-dom';
import LoginForm from '@/components/Auth/LoginForm';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/Common/LoadingSpinner';

export default function LoginPage() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (isAuthenticated && user) {
    const redirect = user.role === 'entity' ? '/entidad' : user.role === 'company' ? '/empresa' : '/ciudadano';
    return <Navigate to={redirect} replace />;
  }

  return (
    <Flex minH="100vh" bg="gray.50" align="center" justify="center" py={12} px={4}>
      <Container maxW="440px">
        <VStack spacing={8}>
          {/* Logo */}
          <VStack spacing={2} textAlign="center">
            <Flex align="center" justify="center" w="56px" h="56px" bg="brand.primaryDark" borderRadius="xl">
              <Text color="white" fontWeight="800" fontSize="2xl">C</Text>
            </Flex>
            <Heading size="xl" color="brand.primaryDark" fontWeight="800">ContrataIA</Heading>
            <Text color="gray.500" fontSize="sm">Plataforma de contrataciones inteligentes</Text>
          </VStack>

          {/* Card */}
          <Box w="100%" bg="white" borderRadius="xl" boxShadow="sm" borderWidth="1px" borderColor="gray.200" p={8}>
            <VStack spacing={6} align="stretch">
              <Box>
                <Heading size="md" color="gray.800" fontWeight="700">Inicia sesión</Heading>
                <Text color="gray.500" fontSize="sm" mt={1}>Bienvenido de vuelta</Text>
              </Box>
              <LoginForm />
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Flex>
  );
}
