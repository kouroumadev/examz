import Layout from "../../../Layout/Layout";
import apiInstitute from "../../../action/institute";
import { useEffect, useState, useRef, } from 'react'
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { useForm } from "react-hook-form";
import { FaAngleLeft, FaAngleRight, FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { BackButton } from "../../../components/Button/button";
import Pagination from "../../../components/Pagination/pagination";

export default function Institute() {
  const Router = useRouter()
  const { id } = Router.query
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState('5')
  const [page, setPage] = useState('1')
  const [total, setTotal] = useState()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isCreateModal,
    onOpen: onOpenCreateModal,
    onClose: onCloseCreateModal
  } = useDisclosure()
  const {
    isOpen: isSuccessModal,
    onOpen: onOpenSuccessModal,
    onClose: onCloseSuccessModal
  } = useDisclosure()
  const [selectedData, setSelectedData] = useState(null)
  const [dataInstitute, setDataInstitute] = useState([])
  const [list, setList] = useState([])
  const TableHead = ['Name', 'Address', 'State', 'City', 'Status']
  const { register, handleSubmit, setValue, getValues } = useForm();

  const getData = async () => {
    await apiInstitute.detail(id)
      .then((res) => {
        setDataInstitute(res.data.data)
        setList(res.data.data.branches)
        console.log(res.data.data.branches)
        setPage(res.data.data.current_page)

      })
      .catch((err) => {
        console.log(err)
      })
  }
  useEffect(() => {
    getData(search, limit, page)
  }, [])

  const onSubmit = async (data) => {
    await apiInstitute.create(data)
      .then((res) => {
        // console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
    getData(search, limit, page)
    onCloseCreateModal()
    onOpenSuccessModal()
  }

  const searchBranch = async (keyword) => {
    await apiInstitute.searchBranch(id, keyword)
      .then((res) => {
        setList(res.data.data.branches)
      })
  }

  const onDelete = async (id) => {
    await apiInstitute.deleted(id)
      .then((res) => {
        if (res.data.status) getAll()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div className="mt-12">
      <div className="md:py-4 ">
        <BackButton url="/admin/institution" />
        <div className="bg-white p-4 rounded-lg text-sm">
          <div className="flex flex-auto w-full flex-row gap-4 m-4 space-between">
            <div className="flex">
              <img src="/asset/icon/table/ic_building.svg" alt="icon university " className="bg-cover h-12 w-12" />
            </div>
            <div className="flex flex-col flex-1">
              <h1 className="font-bold">{dataInstitute.name}</h1>
              <span className="text-black-4">Established {dataInstitute.establishment_year}</span>
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-black-4">address</span>
              <p className="text-sm">{dataInstitute.address}</p>
            </div>

            <div className=" hidden md:flex flex-col flex-1">
              <span className="text-black-4">State</span>
              <p className="text-sm">{dataInstitute.state}</p>
            </div>

            <div className="hidden md:flex flex-col flex-1">
              <span className="text-black-4">City</span>
              <p className="text-sm">{dataInstitute.city}</p>
            </div>
          </div>
          <div className="md:hidden flex flex-auto w-full flex-row gap-4 m-4 space-between">
            <div className="flex">
              <div  className="bg-cover h-12 w-12 md:hidden" />
            </div>
            <div className=" md:hidden flex flex-col flex-1">
              <span className="text-black-4">State</span>
              <p className="text-sm">{dataInstitute.state}</p>
            </div>

            <div className="md:hidden flex flex-col flex-1">
              <span className="text-black-4">City</span>
              <p className="text-sm">{dataInstitute.city}</p>
            </div>
          </div>
          <h1 className="font-bold text-1xl my-2">List Branch</h1>
          {/* <input type="text" className="p-2 border rounded-lg w-1/2 mb-4" placeholder="Search Institute" onChange={(e) => {
            setSearch(e.target.value)
            searchBranch(e.target.value)
            // getData(e.target.value, limit, page)
          }} /> */}

          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="table min-w-full divide-y divide-gray-200">
                    <thead className="bg-black-9" >
                      {TableHead.map((item) => (
                        <th key={item} scope="col" className="px-6 py-3 text-left tracking-wider">
                          {item}
                        </th>
                      ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {list.map((item) => (
                        <tr key={item.email}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div>{item.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>{item.state}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span>
                              {item.city}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap ">{item.establishment_year}</td>
                          <td className="px-6 py-4 whitespace-nowrap flex text-right gap-2 text-sm font-medium">
                            {item.status === 'approve' && (
                              <span className="text-green-1">Accepted</span>
                            )}
                            {item.status === 'pending' && (
                              <span className="text-yellow-1">Pending</span>
                            )}
                            {item.status === 'reject' && (
                              <span className="text-red-1">Rejected</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* <Pagination page={page} lastPage={dataInstitute.last_page} limit={limit} total={dataInstitute.total} doLimit={data => setLimit(data)} doPage={data => setPage(data)} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>


      <Modal isOpen={isCreateModal} onClose={onCloseCreateModal} size='xl'
        motionPreset='slideInBottom'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Institute</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)} >
              <div className="flex gap-4">
                <div>
                  <p>Institute Name</p>
                  <input type="text" className="form border p-4 rounded-lg" placeholder="Input Institute Name" {...register("name", { required: true })} />
                </div>
                <div>
                  <p>Address</p>
                  <input type="text" className="form border p-4 rounded-lg" placeholder="Input Institute Address" {...register("address", { required: true })} />
                </div>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="mt-4">State</p>
                  <input type="text" className="form border p-4 rounded-lg" placeholder="Input Institute Name" {...register("state", { required: true })} />
                </div>
                <div>
                  <p className="mt-4">City</p>
                  <input type="text" className="form border p-4 rounded-lg" placeholder="Input Institute Name" {...register("city", { required: true })} />
                </div>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="mt-4">Establishment Year</p>
                  <input type="text" className="form border p-4 rounded-lg" placeholder="Input Establishment Year" {...register("establishment_year", { required: true })} />
                </div>
                <div>
                  <p className="mt-4">Pin Code</p>
                  <input type="number" className="form border p-4 rounded-lg" placeholder="Input 6-Digits Code Number" {...register("pin_code", { required: true })} />
                </div>
              </div>
              <div className="flex flex-row-reverse gap-4 mt-4">
                <button type="submit" className="bg-blue-1 p-3 rounded-lg text-white" >Save Institute</button>
                <button type="button" className="text-black-4 p-3 rounded-lg" onClick={onCloseCreateModal}>Close</button>
              </div>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Success Modal */}
      <Modal isOpen={isSuccessModal} onClose={onCloseSuccessModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader><center>Success</center></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col text-center ">
              <p>{getValues('name')} Created Successfully </p>
              <div className="self-center">
                <button className="bg-blue-1 rounded-lg text-white mt-4 block align-center p-3" onClick={onCloseSuccessModal}>Okay</button>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure to Delete it ?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='red' onClick={() => {
              onDelete(selectedData)
              onClose()
            }} onClose={onClose}>Deleted</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
Institute.layout = Layout