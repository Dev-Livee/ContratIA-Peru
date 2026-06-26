import { Badge, HStack, Text } from '@chakra-ui/react';
import { riskScoreColor, riskScoreLabel } from '@/utils/helpers';

interface Props { score: number; showLabel?: boolean; }

const EMOJI: Record<string, string> = { green: '🟢', yellow: '🟡', red: '🔴' };

export default function RiskScoreBadge({ score, showLabel = true }: Props) {
  const color = riskScoreColor(score);
  const label = riskScoreLabel(score);
  return (
    <HStack spacing={1.5}>
      <Text fontSize="sm">{EMOJI[color]}</Text>
      <Badge
        colorScheme={color}
        variant="subtle"
        borderRadius="full"
        px={2} py={0.5}
        fontSize="xs"
        fontWeight="600"
      >
        {showLabel ? `${label} (${score})` : score}
      </Badge>
    </HStack>
  );
}
