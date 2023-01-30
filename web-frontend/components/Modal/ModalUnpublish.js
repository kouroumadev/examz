
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import Button from '../Button/button'

export function ModalUnPublish({ isConfirmModal, onCloseConfirmModal, selectedData, onUnpublish}) {
  return (
    <Modal isOpen={isConfirmModal} onClose={onCloseConfirmModal} isCentered size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader><center>Confirmation</center></ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="flex flex-col text-center ">
            <p>Are you sure to unpublish ? </p>
            <div className="self-center flex gap-4 mt-2">
              <button className=" rounded-lg text-black-4  block align-center p-2" onClick={() => {
                onCloseConfirmModal()
              }}>Cancel</button>
              <div onClick={() => {
                onCloseConfirmModal()
                onUnpublish(selectedData)
              }}><Button title="Yes, I'm Sure" /></div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
