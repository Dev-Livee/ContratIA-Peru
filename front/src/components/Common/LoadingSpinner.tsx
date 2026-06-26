import { Flex, Spinner, Text } from '@chakra-ui/react';

interface Props {
  label?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ label = 'Cargando...', fullScreen }: Props) {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      gap={3}
      minH={fullScreen ? '100vh' : '200px'}
      w="100%"
    >
      <Spinner size="xl" color="brand.primaryDark" thickness="3px" />
      <Text color="gray.500" fontSize="sm">{label}</Text>
    </Flex>
  );
}
