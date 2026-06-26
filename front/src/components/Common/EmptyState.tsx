import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import Viz, { VizPose } from './Viz';

interface Props {
  icon?: IconType;
  title: string;
  description?: string;
  ctaLabel?: string;
  onCta?: () => void;
  vizPose?: VizPose;
}

export default function EmptyState({ title, description, ctaLabel, onCta, vizPose = 'sitting' }: Props) {
  return (
    <Box textAlign="center" py={12} px={8} bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.100">
      <VStack spacing={3}>
        <Viz pose={vizPose} size={100} />
        <Text fontWeight="600" color="gray.700" fontSize="lg">{title}</Text>
        {description && <Text color="gray.500" fontSize="sm" maxW="340px" fontStyle="italic">{description}</Text>}
        {ctaLabel && onCta && (
          <Button mt={2} onClick={onCta} size="sm">
            {ctaLabel}
          </Button>
        )}
      </VStack>
    </Box>
  );
}
