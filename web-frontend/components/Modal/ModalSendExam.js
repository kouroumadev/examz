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
  
  export function ModalSendExam({isOpen, onClose, onDelete, onSendExam }) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="medium">Information</ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody>
            <div className="text-sm">
              Click to Submit the Test 
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="mr-4 test-sm cursor-pointer" onClick={onClose}>
              Cancel
            </div>
            <div onClick={() => {
              onSendExam()
              onClose()
            }}><Button title="Submit Test" /></div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }
  