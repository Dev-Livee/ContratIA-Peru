import { Badge } from '@chakra-ui/react';
import { statusColor } from '@/utils/helpers';

const LABELS: Record<string, string> = {
  EN_EVALUACION: 'En evaluación',
  ADJUDICADO: 'Adjudicado',
  EN_EJECUCION: 'En ejecución',
  FINALIZADO: 'Finalizado',
  CANCELADO: 'Cancelado',
  BORRADOR: 'Borrador',
};

interface Props {
  status: string;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: Props) {
  const { bg, color } = statusColor(status);
  const label = LABELS[status] ?? status;
  return (
    <Badge
      bg={bg}
      color={color}
      px={size === 'sm' ? 2 : 3}
      py={size === 'sm' ? 0.5 : 1}
      borderRadius="full"
      fontSize={size === 'sm' ? 'xs' : 'sm'}
      fontWeight="600"
    >
      {label}
    </Badge>
  );
}
