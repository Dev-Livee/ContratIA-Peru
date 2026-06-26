import {
  Box, Grid, Image, Modal, ModalContent, ModalOverlay, SimpleGrid,
  Text, useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';

interface Props { fotos: string[]; }

export default function ObraGaleria({ fotos }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelected] = useState('');

  if (fotos.length === 0) {
    return (
      <Box bg="gray.50" borderRadius="lg" p={8} textAlign="center" borderWidth="1px" borderColor="gray.100">
        <Text color="gray.400" fontSize="sm">No hay fotografías disponibles aún</Text>
      </Box>
    );
  }

  const open = (url: string) => { setSelected(url); onOpen(); };

  return (
    <>
      <SimpleGrid columns={{ base: 2, md: 3 }} spacing={3}>
        {fotos.map((foto, i) => (
          <Box
            key={i} borderRadius="lg" overflow="hidden" h="130px"
            cursor="pointer" _hover={{ opacity: 0.85 }} transition="opacity 0.15s"
            onClick={() => open(foto)}
          >
            <Image src={foto} alt={`Foto ${i + 1}`} w="100%" h="100%" objectFit="cover"
              fallback={<Box h="130px" bg="gray.200" />} />
          </Box>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg="transparent" shadow="none" maxW="90vw">
          <Image src={selected} alt="Foto ampliada" borderRadius="xl" maxH="80vh" objectFit="contain" />
        </ModalContent>
      </Modal>
    </>
  );
}
