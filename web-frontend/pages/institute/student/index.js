import Layout from "../../../Layout/Layout";
import Card from "../../../components/Cards/Card";
import apiStudent from "../../../action/student";
import apiBranch from "../../../action/branch";
import { useEffect, useState } from 'react'
import Image from "next/image";
import Link from 'next/link'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Select
} from '@chakra-ui/react'
import { useForm } from "react-hook-form";
import Pagination from "../../../components/Pagination/pagination";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import instance from "../../../action/instance";
import apiBatch from "../../../action/batch";
import Button from "../../../components/Button/button";
import { ModalSuccessCreateEdit } from "../../../components/Modal/ModalSuccess";
import { ModalDelete } from "../../../components/Modal/ModalDelete";

export default function Student() {
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState('5')
  const [page, setPage] = useState('1')
  const [branch, setBranch] = useState('')
  const [batch, setBatch] = useState('')
  const [status, setStatus] = useState('')
  const [update, setUpdate] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [nameDeleted, setNameDeleted] = useState()
  const [passwd, setpasswd] = useState(true)
  const [listBranch, setListBranch] = useState([])
  const [statusAction, setStatusAction] = useState()
  const [listBatch, setListBatch] = useState([])
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
  const {
    isOpen: isUpdateStatusModal,
    onOpen: onOpenUpdateStatusModal,
    onClose: onCloseUpdateStatusModal
  } = useDisclosure()
  const [selectedData, setSelectedData] = useState(null)
  const [dataInstitute, setDataInstitute] = useState([])
  const [list, setList] = useState([])
  const [errors, setErrors] = useState()
  const TableHead = ['Student Name', 'Enrollment Number', 'Branch', 'Status', 'Action']
  const { register, handleSubmit, setValue, getValues, reset } = useForm();
  const [avatar, setAvatar] = useState('/asset/img/blank_profile.png')
  const [file, setFile] = useState()
  const [selectedId, setSelectedId] = useState()
  const [render, setRender] = useState(false)
  useEffect(() => {
    getBranch()
    getBatch()
  }, [])

  useEffect(() => {
    const getData = async () => {
      await apiStudent.index(search, branch, batch, status, limit, page)
        .then((res) => {
          console.log(branch)
          setDataInstitute(res.data.data)
          setList(res.data.data.data)
          setPage(res.data.data.current_page)

        })
        .catch((err) => {
          console.log(err)
        })
    }
    getData()
  }, [search, branch, batch, status, limit, page, render])

  const getBranch = async () => {
    await apiBranch.all()
      .then((res) => {
        setListBranch(res.data.data)
      })
  }

  const getBatch = async () => {
    await apiBatch.all()
      .then((res) => {
        setListBatch(res.data.data)
      })
  }

  const getDetail = async (id) => {
    await apiStudent.detail(id)
      .then((result) => {
        const res = result.data.data
        console.log(res)
        res.avatar ? setAvatar(instance.pathImg + res.avatar) : setAvatar('/asset/img/blank_profile.png')
        setValue("name", res.name)
        setValue("email", res.email)
        setValue("gender", res.gender)
        setValue("phone", res.phone)
        setValue("code", res.enrollments[0].code)
        getBatch()
        getBranch()
        setValue("branch_id", res.enrollments[0].branch_id)
        setValue("batch_id", res.enrollments[0].batch_id)
      })
  }

  const onSubmit = async (form) => {
    if (form.gender === 'Select State') {
      data.gender = ''
    }
    var data = new FormData();
    data.append("name", form.name)
    data.append("gender", form.gender)
    data.append("email", form.email)
    data.append("phone", form.phone)
    data.append("employee_id", form.employee_id)
    data.append("password", form.password)
    data.append("password_confirmation", form.password_confirmation)
    data.append("branch_id", form.branch_id)
    data.append("batch_id", form.batch_id)
    if (file) {
      data.append("avatar", file)
    }
    update ? await apiStudent.update(selectedData, data)
      .then((res) => {
        reset(res)
        onCloseCreateModal()
        setRender(!render)
        onOpenSuccessModal()
        setAvatar('/asset/img/blank_profile.png')
        setFile(null)
      })
      .catch((err) => {
        setErrors(err.response.data.data)
        console.log(err)
      }) : await apiStudent.create(data)
        .then((res) => {
          reset(res)
          onCloseCreateModal()
          setUpdate(false)
          setRender(!render)
          onOpenSuccessModal()
          setAvatar('/asset/img/blank_profile.png')
          setFile(null)
        })
        .catch((err) => {
          setErrors(err.response.data.data)
        })
  }

  const onDelete = async (id) => {
    await apiStudent.deleted(id)
      .then(() => setRender(!render))
      .catch((err) => {
        console.log(err)
      })
  }

  const choosePhoto = (e) => {
    setAvatar(URL.createObjectURL(e.target.files[0]))
    setFile(e.target.files[0])
  }

  const onAction = async () => {
    console.log(selectedId + statusAction)
    await apiStudent.updateStatus(selectedId, { status: statusAction })
      .then(() => setRender(!render))
  }

  return (
    <>
      <div className="mt-24 md:mt-12">
        <Card
          title="Students"
          right={(
            <div onClick={() => {
              setAvatar('/asset/img/blank_profile.png')
              getBranch()
              getBatch()
              setUpdate(false)
              onOpenCreateModal()
              setErrors(null)
              reset()
            }}>
              <Button title="+ Add Student" />
            </div>
          )}
        ><div className="flex flex-col md:flex-row gap-4 mb-4">
            <input type="text" className=" border rounded-lg w-full p-2" placeholder="Search Student" onChange={(e) => {
              setSearch(e.target.value)
            }} />
            <div className="w-full md:w-1/2 h-full  ">
              <Select placeholder='All Status' className="h-full" size="md" onChange={(e) => {
                setStatus(e.target.value)
              }}>
                <option value='Pending'>Pending</option>
                <option value='Approve'>Approve</option>
              </Select>
            </div>
            <div className="flex w-full gap-2 md:gap-4">
              <div className="w-1/2 h-full  ">
                <Select placeholder='All Branch' className="h-full" size="md" onChange={(e) => {
                  setBranch(e.target.value)
                }}>
                  {listBranch.map((item) => (
                    <option key={item} value={item.name}>{item.name}</option>
                  ))}
                </Select>
              </div>
              <div className="w-1/2 h-full  ">
                <Select placeholder='All Batch' className="h-full" size="md" onChange={(e) => {
                  setBatch(e.target.value)
                }}>
                  {listBatch.map((item) => (
                    <option key={item} value={item.name}>{item.name}</option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="table md:min-w-full overflow-auto divide-y divide-gray-200">
                    <thead className="bg-black-9" >
                      {TableHead.map((item) => (
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
                                <div>{item.user.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 h-12 whitespace-nowrap">
                            <div>{item.code}</div>
                          </td>
                          <td className="px-6 h-12 whitespace-nowrap">
                            <span>
                              {item.branch.name}
                            </span>
                          </td>
                          <td className={`${item.status === 'pending' && 'text-yellow-1'} ${item.status === 'approve' && 'text-green-1'} ${item.status === 'reject' && 'text-red-1'} px-6 h-12 whitespace-nowrap`}>
                            <div>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </div>
                          </td>
                          <td className="px-6 h-12 min-w-max whitespace-nowrap flex text-right gap-2 text-sm font-medium">
                            {item.status === 'pending' ? (
                              <>
                                <button href="#" className="text-indigo-600 hover:text-indigo-900">
                                  <Image src="/asset/icon/table/ic_decline.svg" width={32} height={32} alt="icon rejected" onClick={() => {
                                    setSelectedId(item.id)
                                    setStatusAction("reject")
                                    onOpenUpdateStatusModal()
                                  }} />
                                </button>
                                <button href="#" className="text-indigo-600 hover:text-indigo-900">
                                  <Image src="/asset/icon/table/ic_acc.svg" width={32} height={32} alt="icon approve" onClick={() => {
                                    setSelectedId(item.id)
                                    setStatusAction("approve")
                                    onOpenUpdateStatusModal()
                                  }} />
                                </button>
                              </>
                            ) : (
                              <><Link href={`/institute/student/${item.user.id}`}>
                                <a className="text-indigo-600 hover:text-indigo-900 my-auto">
                                  <Image src="/asset/icon/table/fi_eye.svg" width={16} height={16} alt="icon detail" />
                                </a>
                              </Link>
                                <button className="text-indigo-600 hover:text-indigo-900" onClick={() => {
                                  getDetail(item.user.id)
                                  setSelectedData(item.user.id)
                                  setUpdate(true)
                                  onOpenCreateModal()
                                  setErrors(null)
                                }}>
                                  <Image src="/asset/icon/table/fi_edit.svg" width={16} height={16} alt="icon edit" />
                                </button>
                                <button className="text-indigo-600 hover:text-indigo-900">
                                  <Image src="/asset/icon/table/fi_trash-2.svg" width={16} height={16} alt="icon deleted" onClick={() => {
                                    setNameDeleted(item.user.name)
                                    setSelectedData(item.user.id),
                                      onOpen()
                                  }} />
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination page={page} lastPage={dataInstitute.last_page} limit={limit} search={search} total={dataInstitute.total} status={status} branch={branch} batch={batch} doLimit={data => setLimit(data)} doPage={data => setPage(data)} />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Modal isOpen={isUpdateStatusModal} onClose={onCloseUpdateStatusModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure to {statusAction} ?
            <div className="flex flex-row-reverse gap-4 mt-4">
              <button type="submit" className="bg-blue-1 p-2 rounded text-white" onClick={() => {
                onAction()
                onCloseUpdateStatusModal()
              }}>Okay</button>
              <button type="button" className="text-black-4 p-2 rounded" onClick={onClose}>Cancel</button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isCreateModal} onClose={onCloseCreateModal} size='xl'
        motionPreset='slideInBottom'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="md">{update ? 'Edit' : 'Add'} Student</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)} className="pb-4 text-sm">
              <div className="flex justify-center">
                <div className="m-4 relative">
                  <Image loader={() => avatar} className="rounded-full object-cover" src={avatar} alt="photo profile" height={120} width={120} />
                  <div className="absolute bottom-3 right-0">
                    <label htmlFor="file-input">
                      <Image src="/asset/icon/ic_edit.png" alt="icon update" width={32} height={32} className="ml-6 cursor-pointer" />
                    </label>
                  </div>
                </div>
                <div className="hidden">
                  <input id="file-input" type="file" className="hidden -z-50" accept="image/*" onChange={choosePhoto} />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-full">
                  <p>Full Name {errors && (
                    <span className="text-red-1 text-sm">{errors.name}</span>
                  )}</p>
                  <input type="text" className="w-full form border p-2 rounded" placeholder="Input Full Name" {...register("name")} />
                </div>
                <div className="w-full">
                  <p>Email {errors && (
                    <span className="text-red-1 text-sm">{errors.email}</span>
                  )}</p>
                  <input type="text" className="form border w-full p-2 rounded" placeholder="Input Email Address" {...register("email")} />
                </div>
              </div>
              <div className="flex gap-4 mt-4 flex-col md:flex-row">
                <div className="w-full ">
                  <p>Gender{errors && (
                    <span className="text-red-1 text-sm">{errors.gender}</span>
                  )}</p>
                  <select className="form border bg-white w-full p-2 rounded" defaultValue="Select Gender" placeholder="Choose Gender"  {...register("gender",)} >
                    <option disabled>Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
                <div className="w-full">
                  <p>Enrollment ID (Optional) {errors && (
                    <span className="text-red-1 text-sm">{errors.code}</span>
                  )}</p>
                  <input type="text" className="form border p-2 w-full rounded" placeholder="Input Enrollment ID" {...register("code")} />
                </div>
              </div>

              <div className="flex gap-4 mt-4 flex-col md:flex-row ">
                <div className="w-full">
                  <p>Phone Number {errors && (
                    <span className="text-red-1 text-sm">{errors.phone}</span>
                  )}</p>
                  <input type="number" className="form border p-2 w-full rounded" placeholder="Input Phone Number" {...register("phone")} />
                </div>
                <div className="w-full">
                  <p>Branch {errors && (
                    <span className="text-red-1 text-sm">{errors.branch_id}</span>
                  )}</p>
                  <select className="form border bg-white w-full p-2 rounded" defaultValue="Select Branch" placeholder="Choose Branch"  {...register("branch_id",)} >
                    <option disabled>Select Branch</option>
                    {listBranch.map((item) => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-4 flex-col md:flex-row">
                <div className="w-full">
                  <p>Batch {errors && (
                    <span className="text-red-1 text-sm">{errors.batch_id}</span>
                  )}</p>
                  <select className="form border bg-white w-full p-2 rounded" defaultValue="Select Batch" placeholder="Choose Batch"  {...register("batch_id",)} >
                    <option disabled>Select Batch</option>
                    {listBatch.map((item) => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>
                <div className="w-full">
                  <p>Password  {errors && (
                    <span className="text-red-1 text-sm">{errors.password}</span>
                  )}</p>
                  <div className="relative">
                    <input type={`${passwd ? 'password' : 'text'}`} {...register("password")} className="form w-full border p-2 rounded" placeholder="Input New Password" />
                    <span className="absolute inset-y-0 cursor-pointer right-0 pr-3 flex items-center text-sm leading-5" onClick={() => {
                      passwd ? setpasswd(false) : setpasswd(true)
                    }}>
                      {passwd ?
                        (<FaEyeSlash className=" z-10 inline-block align-middle" />) :
                        (<FaEye className=" z-10 inline-block align-middle" />)
                      }
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-row-reverse gap-4 mt-4">
                <div type="submit" ><Button title="Save" /></div>
                <button type="button" className="text-black-4 p-2 rounded-lg" onClick={onCloseCreateModal}>Close</button>
              </div>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <ModalSuccessCreateEdit isSuccessModal={isSuccessModal} onCloseSuccessModal={onCloseSuccessModal} update={update} setUpdate={(data) => setUpdate(data)} />
      <ModalDelete isOpen={isOpen} onClose={onClose} onDelete={(data) => onDelete(data)} selectedData={selectedData} />
    </>
  )
}
Student.layout = Layout