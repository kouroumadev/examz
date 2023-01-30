import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import Button from '../Button/button'

export function ModalNextSection({isOpen, onClose, onDelete, onNextSection }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="medium">Confirmation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="text-sm">
            Are you sure to Continue Next Section?
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="mr-4 test-sm cursor-pointer" onClick={onClose}>
            Cancel
          </div>
          <div onClick={() => {
            onNextSection()
            onClose()
          }}><Button title="Yes, Continue" /></div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
