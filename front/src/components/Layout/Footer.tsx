import { Box, Flex, Text, Link, Divider } from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box as="footer" bg="white" borderTopWidth="1px" borderColor="gray.200" mt="auto">
      <Box maxW="1280px" mx="auto" px={6} py={4}>
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="center" gap={2}>
          <Text fontSize="sm" color="gray.500">
            © 2024 ContrataIA Perú — Plataforma de contrataciones inteligentes
          </Text>
          <Flex gap={4}>
            <Link fontSize="sm" color="gray.500" _hover={{ color: 'brand.primary' }}>Términos</Link>
            <Link fontSize="sm" color="gray.500" _hover={{ color: 'brand.primary' }}>Privacidad</Link>
            <Link fontSize="sm" color="gray.500" _hover={{ color: 'brand.primary' }}>Soporte</Link>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
