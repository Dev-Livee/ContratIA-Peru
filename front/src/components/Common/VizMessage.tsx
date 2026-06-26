import { Text, VStack } from '@chakra-ui/react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import Viz, { VizPose } from './Viz';

const MotionDiv = motion.div;

interface VizMessageProps {
  pose: VizPose;
  message: string;
  size?: number;
  animate?: boolean;
}

export default function VizMessage({ pose, message, size = 120, animate = true }: VizMessageProps) {
  const animProps: HTMLMotionProps<'div'> = animate
    ? { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } }
    : {};

  return (
    <MotionDiv style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0' }} {...animProps}>
      <VStack spacing={3} align="center">
        <Viz pose={pose} size={size} />
        <Text
          fontSize="sm"
          color="gray.500"
          fontWeight="500"
          textAlign="center"
          maxW="280px"
          fontStyle="italic"
        >
          {message}
        </Text>
      </VStack>
    </MotionDiv>
  );
}
