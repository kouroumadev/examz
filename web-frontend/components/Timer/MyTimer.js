import { useTimer } from "react-timer-hook";
import { useEffect } from "react";
import { FaStopCircle, FaPlayCircle } from 'react-icons/fa'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure
} from '@chakra-ui/react'
import Button from "../Button/button";

export default function MyTimer({ expired, newExpiry = false, rerender = false, isPractice = false, isLastSection, onFinish, onNextSection, remaining = false }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isOpenFinish,
    onOpen: onOpenFinish,
    onClose: onCloseFinish
  } = useDisclosure()
  const expiryTimestamp = newExpiry === false ? expired : newExpiry
  // const time = new Date();
  // time.setSeconds(time.getSeconds() + duration * 60);
  const {
    seconds,
    minutes,
    hours,
    restart,
  } = useTimer({
    expiryTimestamp, onExpire: () => {
      isLastSection ? onFinish() : onOpen()
    }
  });

  useEffect(() => {
    if (newExpiry !== false) {
      restart(expiryTimestamp)
    }
  }, [rerender])



  useEffect(() => {
    if (remaining !== false) {
      remaining(hours * 60 + minutes * 60 + seconds)
    }
  }, [expiryTimestamp])

  const onCloseModal = () => {
    return null
  }
  return (
    <>
      <div className={`${minutes < 6 && hours === 0 ? 'text-red-1' : 'text-blue-1'} text-center font-bold text-xl`}>
        <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      </div>
      <Modal isOpen={isOpen} onClose={onCloseModal} isCentered size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="medium">Time Out</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="text-sm">
              Time in this section has run out
            </div>
          </ModalBody>
          <ModalFooter>
            <div onClick={() => {
              onClose()
              onNextSection()
            }}><Button title="Continue to Next Section" /></div>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenFinish} onClose={onCloseModal} isCentered size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="medium text-red-1">Time out</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          </ModalBody>
          <ModalFooter>
            <div onClick={onFinish}><Button title="View Result" /></div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}




export function MyTimerPractice({ expired, newExpiry = false, rerender = false, remaining, isLastSection, onNextSection, onFinish, onPause }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isOpenSection,
    onOpen: onOpenSection,
    onClose: onCloseSection
  } = useDisclosure()
  const {
    isOpen: isOpenFinish,
    onOpen: onOpenFinish,
    onClose: onCloseFinish
  } = useDisclosure()
  const expiryTimestamp = newExpiry === false ? expired : newExpiry
  // console.log(expiryTimestamp)
  // const time = new Date();
  // time.setSeconds(time.getSeconds() + duration * 60);
  const {
    seconds,
    minutes,
    hours,
    isRunning,
    restart,
    pause,
    resume,
  } = useTimer({
    expiryTimestamp, onExpire: () => {
      isLastSection ? onFinish() : onOpenSection()
    }
  });

  useEffect(() => {
    remaining(hours * 60 + minutes)
  }, [expiryTimestamp])

  useEffect(() => {
    // console.log("start new timer")
    // console.log(expiryTimestamp)
    if (newExpiry !== false) {
      restart(expiryTimestamp)
    }
  }, [rerender])
  const onCloseModal = () => {
    return null
  }
  return (
    <div className="flex">
      <div className={`${minutes < 5 && hours === 0 ? 'text-red-1' : 'text-blue-1'} flex gap-2 mx-auto text-center font-bold text-xl`}>
        <div className="flex my-auto cursor-pointer">
          {isRunning ? (
            <FaStopCircle onClick={() => {
              pause()
              onPause()
            }} />
          ) : (
            <FaPlayCircle onClick={() => {
              resume()
              onPause()
            }} />
          )}
        </div>
        <div>
          <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={onCloseModal} isCentered size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="medium">Pause</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="text-sm">
              Practice is Paused
            </div>
          </ModalBody>
          <ModalFooter>
            <div onClick={() => {
              onClose()
              resume()
            }}><Button title="Resume" /></div>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenSection} onClose={onCloseModal} isCentered size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="medium">Time Out</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="text-sm">
              Time in this section has run out
            </div>
          </ModalBody>
          <ModalFooter>
            <div onClick={() => {
              onCloseSection()
              onNextSection()
            }}><Button title="Continue to Next Section" /></div>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenFinish} onClose={onCloseModal} isCentered size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="medium text-red-1">Time out</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          </ModalBody>
          <ModalFooter>
            <div onClick={onFinish}><Button title="View Result" /></div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
