import { Box, Flex, HStack, Link, Text } from '@chakra-ui/react';
import { Link as RouterLink, Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <Flex direction="column" minH="100vh" bg="gray.50">
      <Box as="nav" bg="white" borderBottomWidth="1px" borderColor="gray.200" h="60px">
        <Flex maxW="1200px" mx="auto" px={6} h="100%" align="center" justify="space-between">
          <RouterLink to="/">
            <HStack spacing={2}>
              <Flex w="28px" h="28px" bg="brand.800" borderRadius="md" align="center" justify="center">
                <Text color="white" fontWeight="800" fontSize="xs">C</Text>
              </Flex>
              <Text fontWeight="700" color="brand.800">ContrataIA Perú</Text>
            </HStack>
          </RouterLink>
          <Link as={RouterLink} to="/" fontSize="sm" color="gray.500" _hover={{ color: 'brand.700' }}>
            Ver obras públicas
          </Link>
        </Flex>
      </Box>
      <Flex flex={1} align="center" justify="center" py={12} px={4}>
        <Outlet />
      </Flex>
    </Flex>
  );
}
