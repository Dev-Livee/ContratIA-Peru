import { Flex } from '@chakra-ui/react';
import VizMessage from './VizMessage';

interface Props {
  label?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ label = 'Las mejores decisiones toman unos segundos más.', fullScreen }: Props) {
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
