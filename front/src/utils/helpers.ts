export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 }).format(amount);

export const formatDate = (date: string | Date): string =>
  new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    typeof date === 'string' ? new Date(date) : date
  );

export const formatDateShort = (date: string | Date): string =>
  new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short' }).format(
    typeof date === 'string' ? new Date(date) : date
  );

export const statusColor = (status: string): { bg: string; color: string } => {
  const map: Record<string, { bg: string; color: string }> = {
    'En evaluación': { bg: 'yellow.100', color: 'yellow.800' },
    'Adjudicado': { bg: 'blue.100', color: 'blue.800' },
    'En ejecución': { bg: 'brand.100', color: 'brand.800' },
    'Finalizado': { bg: 'gray.100', color: 'gray.700' },
    'Suspendido': { bg: 'red.100', color: 'red.800' },
    'Borrador': { bg: 'gray.100', color: 'gray.600' },
    'Cancelado': { bg: 'red.100', color: 'red.700' },
  };
  return map[status] ?? { bg: 'gray.100', color: 'gray.700' };
};

export const riskScoreColor = (score: number): string => {
  if (score >= 71) return 'green';
  if (score >= 41) return 'yellow';
  return 'red';
};

export const riskScoreLabel = (score: number): string => {
  if (score >= 71) return 'Bajo';
  if (score >= 41) return 'Medio';
  return 'Alto';
};

export const truncate = (str: string, max = 60): string =>
  str.length > max ? str.slice(0, max) + '…' : str;

export const riskColor = (score: string | number): string => {
  const n = typeof score === 'string' ? parseInt(score, 10) : score;
  return riskScoreColor(n);
};
