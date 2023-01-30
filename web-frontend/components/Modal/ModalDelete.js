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

export function ModalDelete({isOpen, onClose, onDelete, selectedData }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="medium">Confirmation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="text-sm">
            Are you sure to Delete?
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="mr-4 test-sm cursor-pointer" onClick={onClose}>
            Cancel
          </div>
          <div onClick={() => {
            onDelete(selectedData)
            onClose()
          }}><Button title="Delete" /></div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
