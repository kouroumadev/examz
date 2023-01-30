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
  
  export function ModalNextSectionCompulsory({isOpen, onClose, onDelete, onNextSection }) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="medium">Warning</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="text-sm">
              You have to answer to all the compulsory questions !
            </div>
          </ModalBody>
          <ModalFooter>
            {/* <div className="mr-4 test-sm cursor-pointer" onClick={onClose}>
              Cancel
            </div> */}
            <div onClick={() => {
              // onNextSection()
              onClose()
            }}><Button title="Okay" /></div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }
  