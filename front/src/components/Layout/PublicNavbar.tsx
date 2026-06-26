import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

export default function PublicNavbar() {
  const navigate = useNavigate();
  return (
    <Box as="nav" bg="white" borderBottomWidth="1px" borderColor="gray.200" h="60px" position="sticky" top={0} zIndex={100}>
      <Flex maxW="1200px" mx="auto" px={{ base: 4, md: 6 }} h="100%" align="center" justify="space-between">
        <RouterLink to="/">
          <HStack spacing={2}>
            <Flex w="30px" h="30px" bg="brand.800" borderRadius="md" align="center" justify="center">
              <Text color="white" fontWeight="800" fontSize="sm">C</Text>
            </Flex>
            <Text fontWeight="700" fontSize="lg" color="brand.800">ContrataIA</Text>
            <Text fontWeight="400" fontSize="sm" color="gray.400" display={{ base: 'none', sm: 'block' }}>Perú</Text>
          </HStack>
        </RouterLink>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate('/auth/login')}
        >
          Soy entidad / empresa
        </Button>
      </Flex>
    </Box>
  );
}
