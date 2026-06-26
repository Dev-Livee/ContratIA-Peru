import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalFooter, Button, Text,
} from '@chakra-ui/react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen, onClose, onConfirm, title, message,
  confirmLabel = 'Confirmar', isDestructive, isLoading,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="lg">
        <ModalHeader fontSize="lg" fontWeight="700" color="gray.800">{title}</ModalHeader>
        <ModalBody>
          <Text color="gray.600">{message}</Text>
        </ModalBody>
        <ModalFooter gap={3}>
          <Button variant="ghost" onClick={onClose} color="gray.600">Cancelar</Button>
          <Button
            bg={isDestructive ? 'red.500' : 'brand.700'}
            color="white"
            _hover={{ bg: isDestructive ? 'red.600' : 'brand.800' }}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
