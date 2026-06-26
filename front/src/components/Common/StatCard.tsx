import { Box, Flex, Icon, Text, Stat, StatNumber, StatHelpText, StatArrow } from '@chakra-ui/react';
import { IconType } from 'react-icons';

interface Props {
  label: string;
  value: string | number;
  icon: IconType;
  iconBg?: string;
  iconColor?: string;
  change?: number;
  helpText?: string;
}

export default function StatCard({ label, value, icon, iconBg = 'brand.light', iconColor = 'brand.primaryDark', change, helpText }: Props) {
  return (
    <Box bg="white" borderRadius="lg" p={5} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
      <Flex justify="space-between" align="flex-start">
        <Box>
          <Text fontSize="sm" color="gray.500" fontWeight="500" mb={1}>{label}</Text>
          <Stat>
            <StatNumber fontSize="2xl" fontWeight="700" color="gray.800">{value}</StatNumber>
            {(change !== undefined || helpText) && (
              <StatHelpText mb={0} color="gray.500" fontSize="xs">
                {change !== undefined && <StatArrow type={change >= 0 ? 'increase' : 'decrease'} />}
                {helpText ?? `${Math.abs(change ?? 0)}% vs mes anterior`}
              </StatHelpText>
            )}
          </Stat>
        </Box>
        <Box p={3} bg={iconBg} borderRadius="lg">
          <Icon as={icon} boxSize={6} color={iconColor} />
        </Box>
      </Flex>
    </Box>
  );
}
