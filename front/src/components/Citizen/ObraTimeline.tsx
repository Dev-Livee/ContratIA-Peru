import { keyframes } from '@emotion/react';
import { Box, Flex, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import { FiCheckCircle, FiCircle, FiClock } from 'react-icons/fi';
import type { Hito } from '@/components/hooks/useObras';
import { formatDate } from '@/utils/helpers';

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(4, 120, 87, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(4, 120, 87, 0); }
`;

interface Props { hitos: Hito[]; }

export default function ObraTimeline({ hitos }: Props) {
  return (
    <VStack spacing={0} align="stretch">
      {hitos.map((hito, i) => {
        const isDone = hito.completado;
        const isCurrent = hito.actual;
        const isLast = i === hitos.length - 1;

        return (
          <HStack key={i} spacing={4} align="flex-start" pb={isLast ? 0 : 2}>
            <VStack spacing={0} align="center" minW="24px">
              {isCurrent ? (
                <Box
                  w="22px" h="22px" borderRadius="full"
                  bg="brand.700" border="3px solid" borderColor="brand.300"
                  animation={`${pulse} 2s infinite`}
                  flexShrink={0}
                />
              ) : (
                <Icon
                  as={isDone ? FiCheckCircle : FiCircle}
                  boxSize={6}
                  color={isDone ? 'brand.700' : 'gray.300'}
                  flexShrink={0}
                />
              )}
              {!isLast && (
                <Box w="2px" h="28px" bg={isDone ? 'brand.200' : 'gray.200'} mt={0.5} />
              )}
            </VStack>
            <Box pt={0.5} pb={2}>
              <Flex align="center" gap={2} flexWrap="wrap">
                <Text
                  fontSize="sm"
                  fontWeight={isCurrent ? '700' : isDone ? '500' : '400'}
                  color={isCurrent ? 'brand.800' : isDone ? 'gray.800' : 'gray.400'}
                >
                  {hito.label}
                </Text>
                {isCurrent && (
                  <Box px={2} py={0.5} bg="brand.100" borderRadius="full">
                    <Text fontSize="xs" color="brand.700" fontWeight="600">← Actual</Text>
                  </Box>
                )}
              </Flex>
              {hito.fecha && (
                <Text fontSize="xs" color="gray.400" mt={0.5}>
                  {isDone ? '✓ ' : ''}{formatDate(hito.fecha)}
                </Text>
              )}
            </Box>
          </HStack>
        );
      })}
    </VStack>
  );
}
