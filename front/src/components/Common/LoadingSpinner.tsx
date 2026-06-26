import { Flex } from '@chakra-ui/react';
import VizMessage from './VizMessage';
import { VIZ_MESSAGES } from './vizMessages';

interface Props {
  label?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ label = VIZ_MESSAGES.meditating, fullScreen }: Props) {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH={fullScreen ? '100vh' : '200px'}
      w="100%"
    >
      <VizMessage pose="meditating" message={label} size={100} />
    </Flex>
  );
}
