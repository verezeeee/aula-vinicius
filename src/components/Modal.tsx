import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

type ModalComponentProps = {
  isOpen: boolean;
  header: string;
  onClose: () => void; // Assuming onClose is a function that takes no arguments and returns nothing
  children: React.ReactNode; // This type is appropriate for children in React components
};

export default function ModalComponent({
  isOpen,
  onClose,
  children,
  header,
}: ModalComponentProps) {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{header}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
}

export const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  header,
  body,
}: ModalComponentProps & { onConfirm: () => void; body: string }) => {
  return (
    <ModalComponent isOpen={isOpen} onClose={onClose} header={header}>
      <p>{body}</p>
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md mt-4 w-full"
        onClick={onConfirm}
      >
        Confirmar
      </button>
    </ModalComponent>
  );
};
