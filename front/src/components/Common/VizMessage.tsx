import { Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Viz, { VizPose } from './Viz';

const MotionVStack = motion(VStack);

interface VizMessageProps {
  pose: VizPose;
  message: string;
  size?: number;
  animate?: boolean;
}

export default function VizMessage({ pose, message, size = 120, animate = true }: VizMessageProps) {
  const Wrapper = animate ? MotionVStack : VStack;
  const animProps = animate
    ? { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } }
    : {};

  return (
    <Wrapper spacing={3} align="center" py={6} {...animProps}>
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
    </Wrapper>
  );
}
