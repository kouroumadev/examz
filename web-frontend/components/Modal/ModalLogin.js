
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import Link from 'next/link'
import Button from '../Button/button'

export function ModalLogin({ isOpen, onClose}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="medium">Please Login First</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="text-sm">
            Are you sure to Login?
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="mr-4 test-sm cursor-pointer" onClick={onClose}>
            Cancel
          </div>
          <Link href="/landing">
            <a>
              <Button title="Yes" />
            </a>
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
