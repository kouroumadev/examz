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
import Link from 'next/link'

export function ModalExitTest({ isOpen, onClose, url }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="medium" >Warning</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="text-sm">
          Are you sure to leave this Test ?
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="mr-4 test-sm cursor-pointer" onClick={onClose}>
            Cancel
          </div>
          <Link href={url}>
            <a>
              <button className={`bg-red-1 text-white py-2 px-4 font-semibold text-sm rounded hover:bg-red-800 hover:filter hover:drop-shadow-xl`}>Yes, Im Sure</button>
            </a>
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
