import {
  Badge, Box, Button, Flex, HStack, Icon, Image, Progress, Text, VStack,
} from '@chakra-ui/react';
import { FiCalendar, FiDollarSign, FiMapPin } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import type { Obra } from '@/components/hooks/useObras';
import StatusBadge from '@/components/Common/StatusBadge';
import { formatCurrency, formatDate } from '@/utils/helpers';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=65',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=65',
  'https://images.unsplash.com/photo-1574169208507-84376144848b?w=500&q=65',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=65',
];

interface Props { obra: Obra; index?: number; }

export default function ObraCard({ obra, index = 0 }: Props) {
  const navigate = useNavigate();
  const img = obra.fotos[0] ?? FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

  return (
    <Box
      bg="white" borderRadius="xl" overflow="hidden"
      borderWidth="1px" borderColor="gray.100" boxShadow="sm"
      cursor="pointer"
      _hover={{ boxShadow: 'md', transform: 'translateY(-2px)', borderColor: 'brand.200' }}
      transition="all 0.2s"
      onClick={() => navigate(`/obras/${obra.codigo}`)}
    >
      <Box h="160px" overflow="hidden" position="relative">
        <Image src={img} alt={obra.nombre} w="100%" h="100%" objectFit="cover" fallback={<Box h="160px" bg="gray.200" />} />
        <Box position="absolute" top={3} left={3}>
          <StatusBadge status={obra.status} size="sm" />
        </Box>
      </Box>
      <Box p={4}>
        <Text fontWeight="600" color="gray.800" fontSize="sm" noOfLines={2} mb={1}>{obra.nombre}</Text>
        {obra.empresa && <Text fontSize="xs" color="gray.500" noOfLines={1} mb={3}>{obra.empresa}</Text>}

        <VStack spacing={1.5} align="stretch" mb={3}>
          <HStack spacing={1.5}>
            <Icon as={FiMapPin} boxSize={3.5} color="gray.400" flexShrink={0} />
            <Text fontSize="xs" color="gray.500">{obra.distrito}, {obra.region}</Text>
          </HStack>
          <HStack spacing={1.5}>
            <Icon as={FiDollarSign} boxSize={3.5} color="gray.400" flexShrink={0} />
            <Text fontSize="xs" color="gray.500">{formatCurrency(obra.presupuesto)}</Text>
          </HStack>
          {obra.fechaInicio && obra.fechaFin && (
            <HStack spacing={1.5}>
              <Icon as={FiCalendar} boxSize={3.5} color="gray.400" flexShrink={0} />
              <Text fontSize="xs" color="gray.500">
                {formatDate(obra.fechaInicio)} — {formatDate(obra.fechaFin)}
              </Text>
            </HStack>
          )}
        </VStack>

        <Box mb={3}>
          <Flex justify="space-between" mb={1}>
            <Text fontSize="xs" color="gray.500">Avance</Text>
            <Text fontSize="xs" fontWeight="700" color="brand.700">{obra.avance}%</Text>
          </Flex>
          <Progress value={obra.avance} colorScheme="brand" size="sm" borderRadius="full" />
        </Box>

        <Button w="100%" size="sm" variant="outline">Ver detalle →</Button>
      </Box>
    </Box>
  );
}
