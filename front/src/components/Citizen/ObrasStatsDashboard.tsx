import { Box, HStack, Icon, SimpleGrid, Stat, StatLabel, StatNumber, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiActivity, FiBriefcase, FiCheckCircle, FiDollarSign } from 'react-icons/fi';
import { IconType } from 'react-icons';
import type { Obra } from '@/components/hooks/useObras';
import { formatCurrency } from '@/utils/helpers';

const MotionBox = motion(Box);

interface Props {
  obras: Obra[];
}

interface StatItem {
  icon: IconType;
  label: string;
  value: string;
  hint?: string;
  accent: string;
  iconBg: string;
}

function compactCurrency(amount: number): string {
  if (amount >= 1_000_000_000) return `S/ ${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `S/ ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `S/ ${(amount / 1_000).toFixed(0)}K`;
  return formatCurrency(amount);
}

export default function ObrasStatsDashboard({ obras }: Props) {
  const total = obras.length;
  const presupuestoTotal = obras.reduce((sum, o) => sum + o.presupuesto, 0);
  const enEjecucion = obras.filter(o => o.status === 'En ejecución').length;
  const finalizadas = obras.filter(o => o.status === 'Finalizado').length;
  const avancePromedio = total > 0
    ? Math.round(obras.reduce((sum, o) => sum + o.avance, 0) / total)
    : 0;

  const stats: StatItem[] = [
    {
      icon: FiBriefcase,
      label: 'Obras encontradas',
      value: total.toString(),
      hint: total === 1 ? '1 resultado' : `${total} resultados`,
      accent: 'gray.800',
      iconBg: 'gray.100',
    },
    {
      icon: FiDollarSign,
      label: 'Presupuesto total',
      value: compactCurrency(presupuestoTotal),
      hint: 'Suma de todas las obras',
      accent: 'brand.700',
      iconBg: 'brand.100',
    },
    {
      icon: FiActivity,
      label: 'En ejecución',
      value: enEjecucion.toString(),
      hint: total > 0 ? `${Math.round((enEjecucion / total) * 100)}% del total` : '—',
      accent: 'blue.600',
      iconBg: 'blue.50',
    },
    {
      icon: FiCheckCircle,
      label: 'Avance promedio',
      value: `${avancePromedio}%`,
      hint: `${finalizadas} finalizada${finalizadas !== 1 ? 's' : ''}`,
      accent: 'green.600',
      iconBg: 'green.50',
    },
  ];

  return (
    <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={3} mb={5}>
      {stats.map((stat, i) => (
        <MotionBox
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
          bg="white"
          borderRadius="xl"
          p={4}
          borderWidth="1px"
          borderColor="gray.100"
          boxShadow="sm"
          _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
          transition-property="box-shadow, transform"
        >
          <HStack spacing={3} mb={2}>
            <Box p={2} bg={stat.iconBg} borderRadius="lg">
              <Icon as={stat.icon} boxSize={4} color={stat.accent} />
            </Box>
            <Text fontSize="xs" fontWeight="600" color="gray.500" textTransform="uppercase" letterSpacing="0.5px">
              {stat.label}
            </Text>
          </HStack>
          <Stat>
            <StatNumber fontSize={{ base: 'xl', md: '2xl' }} fontWeight="800" color={stat.accent} lineHeight="1">
              {stat.value}
            </StatNumber>
            {stat.hint && (
              <StatLabel fontSize="xs" color="gray.400" mt={1} fontWeight="500">
                {stat.hint}
              </StatLabel>
            )}
          </Stat>
        </MotionBox>
      ))}
    </SimpleGrid>
  );
}
