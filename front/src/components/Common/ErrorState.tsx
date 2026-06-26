import { Box, Button, Text, VStack } from '@chakra-ui/react';
import Viz from './Viz';

interface Props {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = 'Parece que perdí la conexión por un momento. Intentémoslo de nuevo.',
  onRetry,
}: Props) {
  return (
    <Box textAlign="center" py={12} px={8} bg="white" borderRadius="lg" borderWidth="1px" borderColor="red.50">
      <VStack spacing={3}>
        <Viz pose="waving" size={100} />
        <Text fontWeight="600" color="gray.700" fontSize="lg">Error de conexión</Text>
        <Text color="gray.500" fontSize="sm" maxW="340px" fontStyle="italic">{message}</Text>
        {onRetry && (
          <Button mt={2} onClick={onRetry} size="sm" colorScheme="brand">
            Reintentar
          </Button>
        )}
      </VStack>
    </Box>
  );
}
