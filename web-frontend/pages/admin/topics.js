import { useState, useEffect } from "react";
import Card from "../../components/Cards/Card";
import Image from "next/image";
import apiTopic from "../../action/topics";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import { useForm } from "react-hook-form";
import Pagination from "../../components/Pagination/pagination";
import Layout from "../../Layout/Layout";
import Button from "../../components/Button/button";
import { ModalDelete } from "../../components/Modal/ModalDelete";

export default function Topics() {
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState('5')
  const [page, setPage] = useState('1')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedData, setSelectedData] = useState(null)
  const [topics, setTopics] = useState([])
  const [list, setList] = useState([])
  const [update, setUpdate] = useState(false)
  const {
    isOpen: isCreateModal,
    onOpen: onOpenCreateModal,
    onClose: onCloseCreateModal
  } = useDisclosure()
  const { register, handleSubmit, setValue} = useForm();
  const [render, setRender] = useState(false)

  useEffect(async () => {
    const getData = async () => {
      await apiTopic.all(search, limit, page)
        .then((res) => {
          setTopics(res.data.data)
          setList(res.data.data.data)
          setPage(res.data.data.current_page)

        })
        .catch((err) => {
          console.log(err)
        })
    }
    getData()
  }, [search, limit, page, render])

  const onSubmit = async (data) => {
    update ? await apiTopic.update(selectedData, data)
      .then((res) => {
        setUpdate(false)
        setRender(!render)
      }) :
      await apiTopic.create(data)
        .then(() => setRender(!render))
    onCloseCreateModal()
  }

  const onDelete = async (id) => {
    await apiTopic.deleted(id)
      .then((res) => setRender(!render))
      .catch((err) => {
        console.log(err)
      })
  }
  return (
    <div className="mt-12">
      <Card
        title="Topics"
        right={(
          <div onClick={() => {
            setValue("name", "")
            onOpenCreateModal()
          }}>

            <Button title="+ Create Topic" />
          </div>
        )}
      >
        <input type="text" className="p-2 border rounded w-1/2 mb-4 text-sm" placeholder="Search Topic" onChange={(e) => {
          setSearch(e.target.value)
        }} />

        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="table min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-black-9" >
                    <th
                      scope="col"
                      className="px-6 h-12 text-left tracking-wider"
                    >
                      Topic Name
                    </th>
                    <th scope="col" className="text-left px-6 tracking-wider h-12">
                      Action
                    </th>
                    {/* </tr> */}
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {list.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 h-12 whitespace-nowrap">
                          <div>{item.name}</div>
                        </td>
                        <td className="px-6 h-12 whitespace-nowrap flex text-right gap-2 text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => {
                              setValue("name", item.name)
                              setSelectedData(item.id)
                              setUpdate(true)
                              onOpenCreateModal()
                            }}>
                            <Image src="/asset/icon/table/fi_edit.svg" width={16} height={16} alt="icon edit" />
                          </button>
                          <button href="#" className="text-indigo-600 hover:text-indigo-900">
                            <Image src="/asset/icon/table/fi_trash-2.svg" width={16} height={16} alt="icon edit" onClick={() => {
                              setSelectedData(item.id),
                                onOpen()
                            }} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={page} lastPage={topics.last_page} limit={limit} search={search} total={topics.total} doLimit={data => setLimit(data)} doPage={data => setPage(data)} />
            </div>
          </div>
        </div>
      </Card>

      <Modal isOpen={isCreateModal} onClose={onCloseCreateModal} size='xl'
        motionPreset='slideInBottom' isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{update ? 'Update' : 'Create'} Topic</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)} className="pb-4">
              <div>
                <p>Topic Name</p>
                <input type="text" className="form border w-full p-2 text-sm rounded" placeholder="Input Topic Name" {...register("name", { required: true })} />
              </div>
              <div className="flex flex-row-reverse gap-4 mt-4">
                <Button title="Save Topic" />
                <button type="button" className="text-black-4 p-3 rounded-lg" onClick={onCloseCreateModal}>Close</button>
              </div>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
      <ModalDelete isOpen={isOpen} onClose={onClose} onDelete={(data) => onDelete(data)} selectedData={selectedData} />
    </div>
  )
}
Topics.layout = Layout