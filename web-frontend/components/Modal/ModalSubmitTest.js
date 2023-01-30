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

export function ModalSubmitTest({ isSuccessModal, onCloseSuccessModal, submitTest, reviewSubmit, isQuiz = false }) {
  return (
    <Modal isOpen={isSuccessModal} onClose={onCloseSuccessModal} size="2xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="medium"><center>Submit Test</center></ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="bg-red-100 overflow-auto">
            <table className="table min-w-full divide-y divide-gray-200 text-sm text-center">
              <thead className="bg-black-9 text-center" >
                {!isQuiz && (
                  <th
                    scope="col"
                    className="px-6 h-12  tracking-wider"
                  >Section
                  </th>
                )}
                <th scope="col" className=" px-6 tracking-wider h-12">
                  No.of Question
                </th>
                <th scope="col" className=" px-6 tracking-wider h-12">
                  Answered
                </th>
                <th scope="col" className=" px-6 tracking-wider h-12">
                  Not Answered
                </th>
                <th scope="col" className="px-6 tracking-wider h-12">
                  Marked for Review
                </th>
                {/* </tr> */}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isQuiz ? (
                  <>
                    <tr>
                      <td className="px-6 h-12 whitespace-nowrap">
                        <div>{reviewSubmit.total}</div>
                      </td>
                      <td className="px-6 h-12 whitespace-nowrap">
                        <div>{reviewSubmit.answered}</div>
                      </td>
                      <td className="px-6 h-12 whitespace-nowrap">
                        <div>{reviewSubmit.notAnswered}</div>
                      </td>
                      <td className="px-6 h-12 whitespace-nowrap">
                        <div>{reviewSubmit.marked}</div>
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    {reviewSubmit.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 h-12 whitespace-nowrap">
                          <div>{item.name}</div>
                        </td>
                        <td className="px-6 h-12 whitespace-nowrap">
                          <div>{item.total}</div>
                        </td>
                        <td className="px-6 h-12 whitespace-nowrap">
                          <div>{item.answered}</div>
                        </td>
                        <td className="px-6 h-12 whitespace-nowrap">
                          <div>{item.notAnswered}</div>
                        </td>
                        <td className="px-6 h-12 whitespace-nowrap">
                          <div>{item.marked}</div>
                        </td>
                      </tr>
                    ))}
                  </>
                )}

              </tbody>
            </table>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="mr-4 test-sm cursor-pointer" onClick={onCloseSuccessModal}>
            Cancel
          </div>
          <div onClick={submitTest}><Button title="Submit Test" /></div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
