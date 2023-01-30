import Card from "../../components/Cards/Card";
import { useState, useEffect } from "react";
import apiAdmin from "../../action/admin";
import Image from "next/image";
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
import { FaEye, FaEyeSlash } from "react-icons/fa";
import apiInstitute from "../../action/institute";
import Pagination from "../../components/Pagination/pagination";
import Layout from "../../Layout/Layout";
import Button from "../../components/Button/button";
import { ModalDelete } from "../../components/Modal/ModalDelete";

export default function InstituteAdmin(props) {
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState('5')
  const [page, setPage] = useState('1')
  const [dataInstitute, setDataInstitute] = useState([])
  const [detail, setDetail] = useState()
  const [allInstitute, setAllInstitute] = useState([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedData, setSelectedData] = useState(null)
  const [allAdmin, setAllAdmin] = useState([])
  const [list, setList] = useState([])
  const [update, setUpdate] = useState(false)
  const [passwdLogin, setPasswdLogin] = useState(true)
  const tableHead = ['Employee ID', 'Name', 'Email', 'Phone', 'Institute', 'Action']
  const [errors, setErrors] = useState()
  const [render, setRender] = useState(false)
  const { register, handleSubmit, setValue, getValues, reset } = useForm();
  const {
    isOpen: isCreateModal,
    onOpen: onOpenCreateModal,
    onClose: onCloseCreateModal
  } = useDisclosure()
  const {
    isOpen: isUpdateModal,
    onOpen: onOpenUpdateModal,
    onClose: onCloseUpdateModal
  } = useDisclosure()
  const {
    isOpen: isSuccessModal,
    onOpen: onOpenSuccessModal,
    onClose: onCloseSuccessModal
  } = useDisclosure()

  const {
    isOpen: isDetailModal,
    onOpen: onOpenDetailModal,
    onClose: onCloseDetailModal
  } = useDisclosure()


  const getInstitute = async () => {
    await apiInstitute.index()
      .then((res) => setAllInstitute(res.data.data))
  }

  useEffect(() => {
    getInstitute()
  }, [])

  useEffect(() => {
    const getData = async () => {
      await apiAdmin.all(search, limit, page)
        .then((res) => {
          setDataInstitute(res.data.data)
          setList(res.data.data.data)
          setPage(res.data.data.current_page)

        })
        .catch((err) => {
          console.log(err)
        })
    }
    getData()
  }, [search, limit, page, render])

  const onDelete = async (id) => {
    await apiAdmin.deleted(id)
      .then(() => setRender(!render))
      .catch((err) => {
        console.log(err)
      })
  }

  const onSubmit = async (data) => {
    await apiAdmin.create(data)
      .then((res) => {
        setRender(!render)
        onCloseCreateModal()
        onOpenSuccessModal()
        setErrors(null)
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setErrors(err.response.data.data)
        }
      })
  }

  const onUpdate = async (data) => {
    await apiAdmin.update(selectedData, data)
      .then((res) => {
        setRender(!render)
        onCloseCreateModal()
        onOpenSuccessModal()
        setErrors(null)
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setErrors(err.response.data.data)
        }
      })
  }

  const getDetail = async (id) => {
    await apiAdmin.detail(id)
      .then((res) => {
        const data = res.data.data
        setValue("name", data.name)
        setValue("email", data.email)
        setValue("phone", data.phone)
        setValue("employee_id", data.employee_id)
        setValue("gender", data.gender)
        setValue("institute", data.institute?.name)
        setDetail(data)
      })
  }

  return (
    <div className="mt-12">
      <Card
        title="Institute Admin"
        right={(
          <div onClick={() => {
            setUpdate(false)
            reset()
            setErrors(null)
            onOpenCreateModal()
          }}>
            <Button title="+ Create Admin" />
          </div>
        )}
      >
        <input type="text" className="p-2 border rounded w-1/2 mb-4" placeholder="Search Admin" onChange={(e) => {
          setSearch(e.target.value)
        }} />
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="table min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-black-9" >
                    {tableHead.map((item) => (
                      <th key={item} scope="col" className="px-6 h-12 text-left tracking-wider">
                        {item}
                      </th>
                    ))}
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {list.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 h-12 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div>{item.employee_id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 h-12 whitespace-nowrap">
                          <div>{item.name}</div>
                        </td>
                        <td className="px-6 h-12 whitespace-nowrap">
                          <span>
                            {item.email}
                          </span>
                        </td>
                        <td className="px-6 h-12 whitespace-nowrap ">{item.phone}</td>
                        <td className="px-6 h-12 whitespace-nowrap ">{item.institute.name}</td>

                        <td className="px-6 h-12 min-w-max whitespace-nowrap flex text-right gap-2 text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => {
                              getDetail(item.id)
                              setDetail(item)
                              onOpenDetailModal()
                            }}>
                            <Image src="/asset/icon/table/fi_eye.svg" width={16} height={16} alt="icon edit" />
                          </button>

                          <button className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => {
                              getDetail(item.id)
                              setSelectedData(item.id)
                              setUpdate(true)
                              onOpenCreateModal()
                              setErrors(null)
                            }}>
                            <Image src="/asset/icon/table/fi_edit.svg" width={16} height={16} alt="icon edit" />
                          </button>
                          <button href="#" className="text-indigo-600 my-autp hover:text-indigo-900">
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
              <Pagination page={page} lastPage={dataInstitute.last_page} limit={limit} total={dataInstitute.total} doLimit={data => setLimit(data)} doPage={data => setPage(data)} />
            </div>
          </div>
        </div>
      </Card>

      <Modal isOpen={isCreateModal} onClose={onCloseCreateModal} size='xl'
        motionPreset='slideInBottom'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{update ? 'Edit' : 'Create'} Institute Admin</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!update ? (
              <form onSubmit={handleSubmit(onSubmit)} className="pb-4">
                <div className="w-full">
                  <p>Full Name {errors && (
                    <span className="text-red-1 text-sm">{errors.name}</span>
                  )}</p>
                  <input type="text" className="form w-full border p-2 rounded" placeholder="Input Admin Full Name" {...register("name")} />
                </div>

                <div className="flex gap-4 flex-col md:flex-row">
                  <div className="w-full">
                    <p className="mt-4">Institute {errors && (
                      <span className="text-red-1 text-sm">{errors.institute}</span>
                    )}</p>
                    <select className="form border bg-white w-full p-2 rounded" placeholder="Choose Institute"  {...register("institute_id",)} >
                      <option disabled>Select Institute</option>
                      {allInstitute.map((item) => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full">
                    <p>Employee ID{errors && (
                      <span className="text-red-1 text-sm">{errors.employee_id}</span>
                    )}</p>
                    <input type="text" className="form  w-full border p-2 rounded" placeholder="Input Employee ID" {...register("employee_id",)} />
                  </div>
                </div>

                <div className="flex gap-4 flex-col md:flex-row">
                  <div className="w-full ">
                    <p className="mt-4">Gender{errors && (
                      <span className="text-red-1 text-sm">{errors.gender}</span>
                    )}</p>
                    <select className="form border bg-white w-full p-2 rounded" placeholder="Choose Gender"  {...register("gender",)} >
                      <option disabled>Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                  </div>
                  <div className="w-full">
                    <p>Phone Number {errors && (
                      <span className="text-red-1 text-sm">{errors.phone}</span>
                    )}</p>
                    <input type="number" className="form border p-2 w-full rounded" placeholder="Input Phone Number" {...register("phone")} />
                  </div>
                </div>

                <div className="flex gap-4 flex-col md:flex-row">
                  <div className="w-full">
                    <p className="mt-4">Email {errors && (
                      <span className="text-red-1 text-sm">{errors.email}</span>
                    )} </p>
                    <input type="text" className="form w-full border p-2 rounded" placeholder="Input Email Address" {...register("email",)} />
                  </div>
                  <div className="w-full">
                    <p>Password  {errors && (
                      <span className="text-red-1 text-sm">{errors.password}</span>
                    )}</p>
                    <div className="relative">
                      <input type={`${passwdLogin ? 'password' : 'text'}`} {...register("password")} className="form w-full border p-2 rounded" placeholder="Input New Password" />
                      <span className="absolute inset-y-0 cursor-pointer right-0 pr-3 flex items-center text-sm leading-5" onClick={() => {
                        passwdLogin ? setPasswdLogin(false) : setPasswdLogin(true)
                      }}>
                        {passwdLogin ?
                          (<FaEyeSlash className=" z-10 inline-block align-middle" />) :
                          (<FaEye className=" z-10 inline-block align-middle" />)
                        }
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row-reverse gap-4 mt-4">
                  <Button title="Save Institute Admin" />
                  <button type="button" className="text-black-4 p-3 rounded-lg" onClick={onCloseCreateModal}>Close</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit(onUpdate)} className="pb-4">
                <div className="flex gap-4 flex-col md:flex-row">
                  <div className="w-full mt-4">
                    <p>Full Name {errors && (
                      <span className="text-red-1 text-sm">{errors.name}</span>
                    )}</p>
                    <input type="text" className="form w-full border p-2 rounded" placeholder="Input Admin Full Name" {...register("name")} />
                  </div>
                  <div className="w-full">
                    <p>Employee ID {errors && (
                      <span className="text-red-1 text-sm">{errors.employee_id}</span>
                    )}</p>
                    <input type="text" className="form  w-full border p-2 rounded" placeholder="Input Employee ID" {...register("employee_id",)} />
                  </div>
                </div>

                <div className="flex gap-4 flex-col md:flex-row">
                  <div className="w-full">
                    <p className="mt-4">Institute {errors && (
                      <span className="text-red-1 text-sm">{errors.institute}</span>
                    )}</p>
                    <select className="form border bg-white w-full p-2 rounded" placeholder="Choose Institute"  {...register("institute_id",)} >
                      <option disabled>Select Institute</option>
                      {allInstitute.map((item) => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full ">
                    <p>Gender {errors && (
                      <span className="text-red-1 text-sm">{errors.gender}</span>
                    )}</p>
                    <select className="form border bg-white w-full p-2 rounded" placeholder="Choose Gender"  {...register("gender",)} >
                      <option disabled>Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 flex-col md:flex-row">
                  <div className="w-full">
                    <p className="mt-4">Email {errors && (
                      <span className="text-red-1 text-sm">{errors.email}</span>
                    )}</p>
                    <input type="text" className="form w-full border p-2 rounded" placeholder="Input Email Address" {...register("email",)} />
                  </div>
                  <div className="w-full">
                    <p>Phone Number {errors && (
                      <span className="text-red-1 text-sm">{errors.phone}</span>
                    )}</p>
                    <input type="number" className="form border p-2 w-full rounded" placeholder="Input Phone Number" {...register("phone",)} />
                  </div>
                </div>
                <div className="flex flex-row-reverse gap-4 mt-4">
                  <Button title="Save Institute Admin" />
                  <button type="button" className="text-black-4 p-3 rounded-lg" onClick={onCloseCreateModal}>Close</button>
                </div>
              </form>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Update Modal */}
      <Modal isOpen={isUpdateModal} onClose={onCloseUpdateModal} size='xl'
        motionPreset='slideInBottom'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Institute Admin</ModalHeader>
          <ModalCloseButton />
          <ModalBody>

          </ModalBody>
        </ModalContent>
      </Modal>


      {/* Detail Modal */}
      <Modal isOpen={isDetailModal} size='xl' onClose={onCloseDetailModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="md">Detail Institute Admin</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="md:flex hidden w-full bg-black-8 space-between justify between text-sm">
              <div className="flex flex-col gap-4 p-4 w-full">
                <div>
                  <p className="font-bold">Full Name : </p>
                  <p >{detail && detail.name}</p>
                </div>
                <div>
                  <p className="font-bold">Gender : </p>
                  <p >{detail && detail.gender}</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-4 w-full">
                <div>
                  <p className="font-bold">Institute : </p>
                  <p >{detail && detail.institute?.name}</p>
                </div>
                <div>
                  <p className="font-bold">Email : </p>
                  <p >{detail && detail.email}</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-4 w-full">
                <div>
                  <p className="font-bold">Employee ID : </p>
                  <p >{detail && detail.employee_id}</p>
                </div>

                <div>
                  <p className="font-bold">Phone Number : </p>
                  <p>{detail && detail.phone}</p>
                </div>
              </div>
            </div>
            {/* mobile */}
            <div className="flex-col md:hidden w-full bg-black-8 space-between justify between text-sm">
              <div className="flex gap-4 p-4 w-full">
                <div className="w-full">
                  <p className="font-bold">Full Name </p>
                  <p >{detail && detail.name}</p>
                </div>
                <div className="w-full">
                  <p className="font-bold">Institute  </p>
                  <p >{detail && detail.institute?.name}</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 w-full">
                <div className="w-full">
                  <p className="font-bold">Gender  </p>
                  <p >{detail && detail.gender}</p>
                </div>
                <div className="w-full">
                  <p className="font-bold">Email  </p>
                  <p >{detail && detail.email}</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 w-full">
                <div className="w-full">
                  <p className="font-bold">Employee ID  </p>
                  <p >{detail && detail.employee_id}</p>
                </div>
                <div className="w-full">
                  <p className="font-bold">Phone Number  </p>
                  <p>{detail && detail.phone}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-row-reverse pb-2">
              <div onClick={() => {
                onCloseDetailModal()
                setUpdate(false)
              }}><Button title="Close" className="mt-4" /></div>
            </div>
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
              <p>{update ? 'Update' : 'Create'} Admin Institute Successfully </p>
              <div className="self-center">
                <div onClick={() => {
                  onCloseSuccessModal()
                  setUpdate(false)
                  setErrors(null)
                }}>
                  <Button title="Okay" className="mt-4" />
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      <ModalDelete isOpen={isOpen} onClose={onClose} onDelete={(data) => onDelete(data)} selectedData={selectedData} />
    </div>
  )
}
InstituteAdmin.layout = Layout














