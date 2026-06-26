import { Box, Button, Icon, Text, VStack } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { FiInbox } from 'react-icons/fi';

interface Props {
  icon?: IconType;
  title: string;
  description?: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export default function EmptyState({ icon = FiInbox, title, description, ctaLabel, onCta }: Props) {
  return (
    <Box textAlign="center" py={16} px={8} bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.100">
      <VStack spacing={3}>
        <Box p={4} bg="gray.100" borderRadius="full" display="inline-flex">
          <Icon as={icon} boxSize={8} color="gray.400" />
        </Box>
        <Text fontWeight="600" color="gray.700" fontSize="lg">{title}</Text>
        {description && <Text color="gray.500" fontSize="sm" maxW="340px">{description}</Text>}
        {ctaLabel && onCta && (
          <Button mt={2} onClick={onCta} size="sm">
            {ctaLabel}
          </Button>
        )}
      </VStack>
    </Box>
  );
}
