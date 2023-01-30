
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import Button from '../Button/button'

export function ModalSuccessCreateEdit({isSuccessModal, onCloseSuccessModal, update, setUpdate}) {
  return (
    <Modal isOpen={isSuccessModal} onClose={onCloseSuccessModal} isCentered size="sm">
    <ModalOverlay />
    <ModalContent>
      <ModalHeader><center>Success</center></ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <div className="flex flex-col text-center ">
          <p> {update ? 'Update' : 'Create'} Successfully </p>
          <div className="self-center">
            <div onClick={() => {
              onCloseSuccessModal()
              setUpdate(false)
            }}>
              <Button title="Okay" className="mt-4" />
            </div>
          </div>
        </div>
      </ModalBody>
    </ModalContent>
  </Modal>
  )
}
