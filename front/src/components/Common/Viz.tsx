import { Box, Image } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

/**
 * Viz — mascota de ContrataIA Perú.
 * Poses controladas via animación CSS sobre una imagen única.
 */
export type VizPose =
  | 'greeting'    // Saludo — inicio de sesión
  | 'thinking'    // Pensando — comparando empresas
  | 'laptop'      // Con laptop — recomendación IA
  | 'searching'   // Buscando — lupa
  | 'celebrating' // Celebrando — registro exitoso
  | 'waving'      // Saludando — bienvenida
  | 'sitting'     // Sentado — sin proyectos
  | 'curious'     // Curioso — sin resultados
  | 'checkmark'   // Check — proceso completado
  | 'meditating'; // Meditando — carga

const float = keyframes`
  0%, 100% { transform: translateY(0px) }
  50% { transform: translateY(-6px) }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1) }
  50% { transform: scale(1.04) }
`;

const wiggle = keyframes`
  0%, 100% { transform: rotate(0deg) }
  25% { transform: rotate(-3deg) }
  75% { transform: rotate(3deg) }
`;

const POSE_ANIMATION: Record<VizPose, string> = {
  greeting:    `${wiggle} 2s ease-in-out infinite`,
  thinking:    `${pulse} 3s ease-in-out infinite`,
  laptop:      `${float} 3s ease-in-out infinite`,
  searching:   `${wiggle} 1.5s ease-in-out infinite`,
  celebrating: `${wiggle} 0.8s ease-in-out infinite`,
  waving:      `${wiggle} 2s ease-in-out infinite`,
  sitting:     `${float} 4s ease-in-out infinite`,
  curious:     `${pulse} 2.5s ease-in-out infinite`,
  checkmark:   `${pulse} 2s ease-in-out infinite`,
  meditating:  `${float} 3.5s ease-in-out infinite`,
};

interface VizProps {
  pose: VizPose;
  size?: number | string;
}

export default function Viz({ pose, size = 120 }: VizProps) {
  const pxSize = typeof size === 'number' ? `${size}px` : size;

  return (
    <Box w={pxSize} h={pxSize} flexShrink={0}>
      <Image
        src="/viz.png"
        alt={`Viz — ${pose}`}
        w="100%"
        h="100%"
        objectFit="contain"
        animation={POSE_ANIMATION[pose]}
        draggable={false}
        loading="eager"
      />
    </Box>
  );
}
