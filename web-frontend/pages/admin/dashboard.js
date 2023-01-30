import Card from "../../components/Cards/Card";
import Layout from "../../Layout/Layout";
import Image from 'next/image'
import apiOperator from "../../action/operator";
import { useEffect, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { useForm } from "react-hook-form";
import Pagination from "../../components/Pagination/pagination";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import instance from "../../action/instance";
import Button from "../../components/Button/button";
import { ModalDelete } from "../../components/Modal/ModalDelete";
import { ModalSuccessCreateEdit } from "../../components/Modal/ModalSuccess";
import apiHome from "../../action/home";

export default function Index(props) {
  const TableHead = ['Name', 'Email', 'Phone', 'Action']
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState('5')
  const [page, setPage] = useState('1')
  const [update, setUpdate] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [passwd, setpasswd] = useState(true)
  const [passwdConfirmation, setpasswdConfirmation] = useState(true)
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
  const [errors, setErrors] = useState()
  const { register, handleSubmit, setValue, getValues, reset } = useForm();
  const [avatar, setAvatar] = useState('/asset/img/blank_profile.png')
  const [file, setFile] = useState()
  const [listInstitute, setListInstitute] = useState([])
  const [totalInstituteStudent, setTotalInstituteStudent] = useState()
  const [render, setRender] = useState(false)

  const getInstitute = async () => {
    await apiHome.listInstitute('')
      .then((res) => {
        setListInstitute(res.data.data)
      })
  }

  const onSearchInstitute = async (e) => {
    await apiHome.listInstitute(e)
      .then((res) => setListInstitute(res.data.data))
  }

  useEffect(() => {
    getInstitute()
  }, [])

  useEffect(() => {
    const getData = async () => {
      await apiOperator.index(search, limit, page)
        .then((res) => {
          setDataInstitute(res.data.data)
          setList(res.data.data.data)
          setPage(res.data.data.current_page)

        })
        .catch((err) => {
          console.log(err)
        })
      await apiHome.totalInstituteStudent()
        .then((res) => setTotalInstituteStudent(res.data.data))
    }
    getData()
  }, [search, limit, page, render])

  const getDetail = async (id) => {
    await apiOperator.detail(id)
      .then((result) => {
        const res = result.data.data
        res.avatar ? setAvatar(instance.pathImg + res.avatar) : setAvatar('/asset/img/blank_profile.png')
        setValue("name", res.name)
        setValue("email", res.email)
        setValue("gender", res.gender)
        setValue("phone", res.phone)
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
    data.append("password", form.password)
    data.append("password_confirmation", form.password_confirmation)
    if (file) {
      data.append("avatar", file)
    }
    update ? await apiOperator.update(selectedData, data)
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
      }) : await apiOperator.create(data)
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
    await apiOperator.deleted(id)
      .then(() => {
        setRender(!render)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const choosePhoto = (e) => {
    setAvatar(URL.createObjectURL(e.target.files[0]))
    setFile(e.target.files[0])
  }

  return (
    <div className="w-full mt-8 mb-16">
      <div className="flex">
        <div className=" w-full">
          <div className="flex md:gap-4 gap-2 lg:flex-row">
            <div className="flex w-full gap-4 p-4 bg-white rounded-lg my-4">
              <Image height={64} width={64} alt="icon school" className="w-12 h-12" src="/asset/icon/table/ic_school.svg" />
              <div>
                <p className="font-bold text-blue-1 md:text-2xl">
                  {totalInstituteStudent?.totalInstitute}
                </p>
                <p className="text-black-4 md:text-sm text-xs">Registered Institute</p>
              </div>
            </div>
            <div className="flex  w-full gap-4 p-4 bg-white rounded-lg my-4">
              <Image height={64} width={64} alt="icon student" className="w-12 h-12" src="/asset/icon/table/ic_read.svg" />
              <div>
                <p className="font-bold text-yellow-1 md:text-2xl">
                  {totalInstituteStudent?.totalStudent}
                </p>
                <p className="text-black-4 md:text-sm text-xs">Student Joined</p>
              </div>
            </div>
          </div>
          <div>
            <Card
              className="w-full  bg-white"
              title="Operator Team"
              right={(
                <div onClick={() => {
                  setAvatar('/asset/img/blank_profile.png')
                  setUpdate(false)
                  onOpenCreateModal()
                  setErrors(null)
                  reset()
                }}>
                  <Button title="+ Add Operator" />
                </div>
              )}>

              <input type="text" className="p-2 border text-sm rounded w-1/2 mb-4" placeholder="Search Operator" onChange={(e) => {
                setSearch(e.target.value)
              }} />

              <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <table className="table md:min-w-full overflow-auto divide-y divide-gray-200 text-sm">
                        <thead className="bg-black-9" >
                          {TableHead.map((item) => (
                            <th key={item} scope="col" className="px-6 text-sm h-12 text-left tracking-wider">
                              {item}
                            </th>
                          ))}
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 text-sm ">
                          {list.map((item, index) => (
                            <tr key={index} className="h-12">
                              <td className="px-6 h-12 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="ml-4">
                                    <div>{item.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 h-12 whitespace-nowrap">
                                <div>{item.email}</div>
                              </td>
                              <td className="px-6 h-12 whitespace-nowrap">
                                <span>
                                  {item.phone}
                                </span>
                              </td>
                              <td className="px-6 h-12 whitespace-nowrap flex text-right gap-2 text-sm font-medium">
                                <button className="text-indigo-600 hover:text-indigo-900" onClick={() => {
                                  getDetail(item.id)
                                  setSelectedData(item.id)
                                  setUpdate(true)
                                  onOpenCreateModal()
                                  setErrors(null)
                                }}>
                                  <Image src="/asset/icon/table/fi_edit.svg" width={16} height={16} alt="icon edit" />
                                </button>
                                <button href="#" className="text-indigo-600 hover:text-indigo-900">
                                  <Image src="/asset/icon/table/fi_trash-2.svg" width={16} height={16} alt="icon deleted" onClick={() => {
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
          </div>
        </div>
        <div className="md:flex flex-col p-4 ml-4 mt-4 hidden sm:w-1/3 md:w-1/3 bg-white rounded-lg">
          <h1 className="text-1xl font-bold mb-2">List Institute</h1>
          <input type="text" className="p-2 text-sm border rounded w-full" placeholder="Search Institute" onChange={(e) => {
            onSearchInstitute(e.target.value)
          }} />
          {listInstitute.map((item, index) => (
            <div key={item} className="border-b py-4">
              <span className="border p-2 rounded text-sm">{index + 1}</span><span className="font-bold text-sm"> &nbsp; {item.name}</span><span className="text-black-5" > </span>
            </div>
          ))}
        </div>
      </div>



      <Modal isOpen={isCreateModal} onClose={onCloseCreateModal} size='xl'
        motionPreset='slideInBottom'>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <>
              <div className="text-1xl font-semibold pt-4"> {update ? 'Edit' : 'Add'} Operator </div>
              <form onSubmit={handleSubmit(onSubmit)} className="pb-4 text-sm">
                <div className="flex gap-4 flex-row mt-4">
                  <div className="w-full">
                    <p>Full Name {errors && (
                      <span className="text-red-1 text-sm">{errors.name}</span>
                    )}</p>
                    <input type="text" className="w-full form border mt-1 p-2 rounded" placeholder="Input Full Name" {...register("name")} />
                  </div>
                  <div>
                    <label htmlFor="file-input">
                      <div className="m-4 relative  my-auto cursor-pointer">
                        <Image loader={() => avatar} className="rounded-full object-cover" src={avatar} alt="photo profile" height={100} width={100} />
                        <div className="absolute bottom-1 right-0">
                          <Image src="/asset/icon/ic_edit.png" alt="icon update" width={28} height={28} className="ml-16 cursor-pointer" />
                        </div>
                      </div>  </label>
                    <div className="hidden">
                      <input id="file-input" type="file" className="hidden -z-50" accept="image/*" onChange={choosePhoto} />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-4 md:mt-2 flex-col md:flex-row">
                  <div className="w-full">
                    <p>Email {errors && (
                      <span className="text-red-1 text-sm">{errors.email}</span>
                    )}</p>
                    <input type="text" className="form mt-1 border w-full p-2 rounded" placeholder="Input Email Address" {...register("email")} />
                  </div>
                  <div className="w-full">
                    <p>Phone{errors && (
                      <span className="text-red-1 text-sm">{errors.phone}</span>
                    )}</p>
                    <input type="number" className="form border p-2 mt-1 w-full rounded-lg" placeholder="Input Phone Number" {...register("phone")} />
                  </div>
                </div>

                <div className="flex gap-4 flex-col md:flex-row mt-4">
                  <div className="w-full">
                    <p>Password  {errors && (
                      <span className="text-red-1 text-sm">{errors.password}</span>
                    )}</p>
                    <div className="relative">
                      <input type={`${passwd ? 'password' : 'text'}`} {...register("password")} className="form w-full border p-2 mt-1 rounded" placeholder="Input New Password" />
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
                  <div className="w-full">
                    <p>Confirm Password  {errors && (
                      <span className="text-red-1 text-sm">{errors.password}</span>
                    )}</p>
                    <div className="relative">
                      <input type={`${passwdConfirmation ? 'password' : 'text'}`} {...register("password_confirmation")} className="form w-full border mt-1 p-2 rounded" placeholder="Input New Password" />
                      <span className="absolute inset-y-0 cursor-pointer right-0 pr-3 flex items-center text-sm leading-5" onClick={() => {
                        passwdConfirmation ? setpasswdConfirmation(false) : setpasswd(true)
                      }}>
                        {passwdConfirmation ?
                          (<FaEyeSlash className=" z-10 inline-block align-middle" />) :
                          (<FaEye className=" z-10 inline-block align-middle" />)
                        }
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row-reverse gap-4 mt-6">
                  <Button title="Save" />
                  <button type="button" className="text-black-4 p-3 rounded-lg" onClick={onCloseCreateModal}>Close</button>
                </div>
              </form>
            </>
          </ModalBody>
        </ModalContent>
      </Modal>

      <ModalSuccessCreateEdit isSuccessModal={isSuccessModal} onCloseSuccessModal={onCloseSuccessModal} update={update} setUpdate={(data) => setUpdate(data)} />
      <ModalDelete isOpen={isOpen} onClose={onClose} onDelete={(data) => onDelete(data)} selectedData={selectedData} />
    </div>
  )
}
Index.layout = Layout