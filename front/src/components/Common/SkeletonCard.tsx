import { Box, Skeleton, SkeletonText, VStack } from '@chakra-ui/react';

interface Props { lines?: number; hasImage?: boolean; }

export default function SkeletonCard({ lines = 3, hasImage }: Props) {
  return (
    <Box bg="white" borderRadius="lg" overflow="hidden" borderWidth="1px" borderColor="gray.100" boxShadow="sm">
      {hasImage && <Skeleton h="160px" />}
      <Box p={5}>
        <VStack spacing={3} align="stretch">
          <Skeleton h="16px" w="60%" borderRadius="md" />
          <SkeletonText noOfLines={lines} spacing={2} skeletonHeight="12px" />
          <Skeleton h="8px" borderRadius="full" />
        </VStack>
      </Box>
    </Box>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <Box bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.100" overflow="hidden">
      <Box p={4} borderBottomWidth="1px" borderColor="gray.100">
        <Skeleton h="18px" w="200px" borderRadius="md" />
      </Box>
      <VStack spacing={0} align="stretch" divider={<Box borderBottomWidth="1px" borderColor="gray.50" />}>
        {Array.from({ length: rows }).map((_, i) => (
          <Box key={i} px={6} py={4}>
            <SkeletonText noOfLines={1} skeletonHeight="14px" />
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
