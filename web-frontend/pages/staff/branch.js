import Layout from "../../Layout/Layout";
import Card from "../../components/Cards/Card";
import apiStaff from "../../action/staff";
import apiBranch from "../../action/branch";
import { useEffect, useState } from 'react'
import Image from "next/image";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { useForm } from "react-hook-form";
import Pagination from "../../components/Pagination/pagination";
import apiBatch from "../../action/batch";
import { region } from "../../action/India";
import { Select } from '@chakra-ui/react'
import Button from "../../components/Button/button";
import { ModalSuccessCreateEdit } from "../../components/Modal/ModalSuccess";
import { ModalDelete } from "../../components/Modal/ModalDelete";

export default function Branch() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [limit, setLimit] = useState('5')
  const [page, setPage] = useState('1')
  const [searchBatch, setSearchBatch] = useState('')
  const [limitBatch, setLimitBatch] = useState('5')
  const [pageBatch, setPageBatch] = useState('1')
  const [update, setUpdate] = useState(false)
  const [updateBatch, setUpdateBatch] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [nameDeleted, setNameDeleted] = useState()
  const [passwd, setpasswd] = useState(true)
  const [branch, setBranch] = useState([])
  const [passwdConfirmation, setpasswdConfirmation] = useState(true)
  const {
    isOpen: isCreateModal,
    onOpen: onOpenCreateModal,
    onClose: onCloseCreateModal
  } = useDisclosure()
  const {
    isOpen: isCreateModalBatch,
    onOpen: onOpenCreateModalBatch,
    onClose: onCloseCreateModalBatch
  } = useDisclosure()
  const {
    isOpen: isSuccessModal,
    onOpen: onOpenSuccessModal,
    onClose: onCloseSuccessModal
  } = useDisclosure()
  const [selectedData, setSelectedData] = useState(null)
  const [selectedDataBatch, setSelectedDataBatch] = useState(null)
  const [dataInstitute, setDataInstitute] = useState([])
  const [list, setList] = useState([])
  const [dataInstituteBatch, setDataInstituteBatch] = useState([])
  const [listBatch, setListBatch] = useState([])
  const [errors, setErrors] = useState()
  const TableHead = ['Branch Name', 'State', 'City', 'Status', 'Action']
  const BatchHead = ['Number', 'Batch Name', 'Batch Code', 'Action']
  const { register, handleSubmit, setValue, getValues, reset } = useForm();
  const [isBranch, setIsBranch] = useState(true)
  const [cities, setCities] = useState([])
  const [render, setRender] = useState(false)
  const [renderBatch, setRenderBatch] = useState(false)

  useEffect(() => {
    const getData = async () => {
      await apiBranch.index(search, status, limit, page)
        .then((res) => {
          console.log(res.data.data)
          setDataInstitute(res.data.data)
          setList(res.data.data.data)
          setPage(res.data.data.current_page)

        })
        .catch((err) => {
          console.log(err)
        })
    }
    getData()
  }, [search, status, limit, page, render])

  useEffect(() => {
    const getBatch = async () => {
      await apiBatch.index(searchBatch, limitBatch, pageBatch)
        .then((res) => {
          console.log(res.data.data)
          setDataInstituteBatch(res.data.data)
          setListBatch(res.data.data.data)
          setPageBatch(res.data.data.current_page)

        })
        .catch((err) => {
          console.log(err)
        })
    }
    getBatch()
  }, [searchBatch, limitBatch, pageBatch, renderBatch])

  const getBranch = async () => {
    await apiBranch.all()
      .then((res) => {
        setBranch(res.data.data)
      })
  }

  const getDetailBatch = async (id) => {
    await apiBatch.detail(id)
      .then((result) => {
        setValue("name", result.data.data.name)
        setValue("code", result.data.data.code)
      })
  }

  const getDetail = async (id) => {
    await apiBranch.detail(id)
      .then((result) => {
        const res = result.data.data
        setValue("name", res.name)
        setValue("email", res.email)
        setValue("address", res.address)
        setValue("phone", res.phone)
        setValue("pin_code", res.pin_code)
        setValue("landline_number", res.landline_number)
        setValue("state", res.state)
        console.log(res.state)
        const city = region.find(state => state.name === res.state)?.cities
        setCities(city)
        setValue("city", res.city)
      })
  }

  const onSubmit = async (data) => {
    if (isBranch) {
      update ? await apiBranch.update(selectedData, data)
        .then((res) => {
          reset(res)
          onCloseCreateModal()
          setRender(!render)
          onOpenSuccessModal()
        })
        .catch((err) => {
          setErrors(err.response.data.data)
          console.log(err)
        }) : await apiBranch.create(data)
          .then((res) => {
            reset(res)
            onCloseCreateModal()
            setUpdate(false)
            setRender(!render)
            onOpenSuccessModal()
          })
          .catch((err) => {
            setErrors(err.response.data.data)
          })
    } else {
      updateBatch ? await apiBatch.update(selectedDataBatch, data)
        .then((res) => {
          reset(res)
          setRenderBatch(!renderBatch)
          onCloseCreateModalBatch()
        })
        .catch((err) => {
          setErrors(err.response.data.data)
          console.log(err)
        }) : await apiBatch.create(data)
          .then((res) => {
            reset(res)
            setUpdateBatch(false)
            setRenderBatch(!renderBatch)
            onCloseCreateModalBatch()
          })
          .catch((err) => {
            setErrors(err.response.data.data)
          })
    }
  }

  const onDelete = async (id) => {
    if (isBranch) {
      await apiBranch.deleted(id)
        .then(() => setRender(!render))
        .catch((err) => {
          console.log(err)
        })
    } else {
      await apiBatch.deleted(id)
        .then(() => setRenderBatch(!renderBatch))
        .catch((err) => {
          console.log(err)
        })
    }
  }

  const chooseState = (e) => {
    const city = region.find(state => state.name === e.target.value).cities
    setCities(city)
  }

  return (
    <>
      <div className="mt-12">
        <div className="flex  gap-4 bg-white rounded-lg pt-4 px-4 mb-4">
          <div className={`${isBranch ? 'text-blue-1 font-bold  border-b-2  border-blue-1' : 'text-black-5'} cursor-pointer pb-4`} onClick={() => setIsBranch(true)}>
            Institution Branches
          </div>
          <div className={`${!isBranch ? 'text-blue-1 border-b-2 font-bold  border-blue-1' : 'text-black-5'} cursor-pointer pb-4 `} onClick={() => setIsBranch(false)}>
            Institution Batches
          </div>
        </div>
        {isBranch ? (
          <Card
            title="Institution Branches"
            right={(
              <div onClick={() => {
                getBranch()
                setUpdate(false)
                onOpenCreateModal()
                setErrors(null)
                reset()
              }}>
                <Button title="+ Create" />
              </div>
            )}
          >
            <div className="flex gap-4 mb-4">
              <input type="text" className=" border rounded-lg w-1/2 p-2" value={search} placeholder="Search Branch" onChange={(e) => {
                setSearch(e.target.value)
              }} />

              <div className=" w-1/2 h-full  ">
                <Select placeholder='All Status' className="h-full" size="md" onChange={(e) => {
                  setStatus(e.target.value)
                }}>
                  <option value='Pending'>Pending</option>
                  <option value='Approve'>Approve</option>
                </Select>
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
                        {list.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 h-12 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="ml-4">
                                  <div>{item.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 h-12 whitespace-nowrap">
                              <div>{item.state}</div>
                            </td>
                            <td className="px-6 h-12 whitespace-nowrap">
                              <span>
                                {item.city}
                              </span>
                            </td>
                            <td className={`${item.status === 'pending' && 'text-yellow-1'} ${item.status === 'approve' && 'text-green-1'} ${item.status === 'reject' && 'text-red-1'} px-6 h-12 font-bold whitespace-nowrap`}>
                              <div>
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                              </div>
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
                                  setNameDeleted(item.name)
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
                  <Pagination page={page} lastPage={dataInstitute.last_page} limit={limit} search={search} status={status} total={dataInstitute.total} doLimit={data => setLimit(data)} doPage={data => setPage(data)} />
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card
            title="Institution Batches"
            right={(
              <div onClick={() => {
                getBranch()
                setUpdateBatch(false)
                onOpenCreateModalBatch()
                setErrors(null)
                reset()
              }}>
                <Button title="+ Create" />
              </div>
            )}
          >
            <input type="text" className="p-2 border rounded w-1/2 mb-4" value={searchBatch} placeholder="Search Batch" onChange={(e) => {
              setSearchBatch(e.target.value)
            }} />
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="table md:min-w-full overflow-auto divide-y divide-gray-200">
                      <thead className="bg-black-9" >
                        {BatchHead.map((item) => (
                          <th key={item} scope="col" className="px-6 h-12 text-left tracking-wider">
                            {item}
                          </th>
                        ))}
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {listBatch.map((item, index) => (
                          <tr key={index}>
                            <td className="px-6 h-12 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="ml-4">
                                  <div>{index + 1}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 h-12 whitespace-nowrap">
                              <div>{item.name}</div>
                            </td>
                            <td className="px-6 h-12 whitespace-nowrap">
                              <span>
                                {item.code}
                              </span>
                            </td>
                            <td className="px-6 h-12 whitespace-nowrap flex text-right gap-2 text-sm font-medium">
                              <button className="text-indigo-600 hover:text-indigo-900" onClick={() => {
                                getDetailBatch(item.id)
                                setSelectedDataBatch(item.id)
                                setUpdateBatch(true)
                                onOpenCreateModalBatch()
                                setErrors(null)
                              }}>
                                <Image src="/asset/icon/table/fi_edit.svg" width={16} height={16} alt="icon edit" />
                              </button>
                              <button href="#" className="text-indigo-600 hover:text-indigo-900">
                                <Image src="/asset/icon/table/fi_trash-2.svg" width={16} height={16} alt="icon deleted" onClick={() => {
                                  setNameDeleted(item.name)
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
                  <Pagination page={pageBatch} lastPage={dataInstituteBatch.last_page} limit={limitBatch} search={searchBatch} total={dataInstituteBatch.total} doLimit={data => setLimitBatch(data)} doPage={data => setPageBatch(data)} />
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>


      <Modal isOpen={isCreateModal} onClose={onCloseCreateModal} size='xl'
        motionPreset='slideInBottom'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="md">{update ? 'Edit' : 'Create'} Branch</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)} className="pb-4 text-sm">
              <div className="flex gap-4">
                <div className="w-full">
                  <p>Branch Name {errors && (
                    <span className="text-red-1 text-sm">{errors.name}</span>
                  )}</p>
                  <input type="text" className="w-full form border p-2 rounded" placeholder="Input Branch Name" {...register("name")} />
                </div>
                <div className="w-full">
                  <p>Address {errors && (
                    <span className="text-red-1 text-sm">{errors.address}</span>
                  )}</p>
                  <input type="text" className="form border w-full p-2 rounded" placeholder="Input Branch Address" {...register("address")} />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-full">
                  <p className="mt-4">State {errors && (
                    <span className="text-red-1 text-sm">{errors.state}</span>
                  )}</p>
                  <select id="state" className="form border bg-white w-full p-2 rounded" defaultValue="Select State" placeholder="Choose State" {...register("state")} onChange={chooseState}>
                    <option disabled>Select State</option>
                    {region.map((item) => {
                      return (
                        <option key={item.id} value={item.name}>{item.name}</option>
                      )
                    })}
                  </select>
                </div>
                <div className="w-full">
                  <p className="mt-4">City {errors && (
                    <span className="text-red-1 text-sm">{errors.city}</span>
                  )}</p>
                  <select className="form border bg-white w-full p-2 rounded" defaultValue="Select City"  {...register("city")} >
                    <option disabled>Select City</option>
                    {cities?.map((item) => (
                      <option key={item.id} value={item.name}>{item.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-4 flex-col md:flex-row">
                <div className="w-full">
                  <p>Email {errors && (
                    <span className="text-red-1 text-sm">{errors.email}</span>
                  )}</p>
                  <input type="text" className="form border p-2 w-full rounded" placeholder="Input Email" {...register("email")} />
                </div>
                <div className="w-full">
                  <p>Landline Number {errors && (
                    <span className="text-red-1 text-sm">{errors.landline_number}</span>
                  )}</p>
                  <input type="number" className="form border p-2 w-full rounded" placeholder="Input Landline Number" {...register("landline_number")} />
                </div>
              </div>

              <div className="flex gap-4 mt-4 flex-col md:flex-row">
                <div className="w-full">
                  <p>Phone Number {errors && (
                    <span className="text-red-1 text-sm">{errors.phone}</span>
                  )}</p>
                  <input type="number" className="form border p-2 w-full rounded" placeholder="Input Phone Number" {...register("phone")} />
                </div>
                <div className="w-full">
                  <p>Pin Code {errors && (
                    <span className="text-red-1 text-sm">{errors.pin_code}</span>
                  )}</p>
                  <input type="number" className="form border p-2 w-full rounded" placeholder="Input 6-Digits Code Number" {...register("pin_code")} />
                </div>
              </div>
              <div className="flex flex-row-reverse gap-4 mt-4">
                <div type="submit" className="p-2"><Button title="Save Branch" /></div>
                <button type="button" className="text-black-4 p-3 rounded-lg" onClick={onCloseCreateModal}>Close</button>
              </div>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isCreateModalBatch} onClose={onCloseCreateModalBatch} size='xl'
        motionPreset='slideInBottom' isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="md">{updateBatch ? 'Edit' : 'Create'} Batch</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)} className="pb-4 text-sm">
              <div className="w-full">
                <p>Batch Name {errors && (
                  <span className="text-red-1 text-sm">{errors.name}</span>
                )}</p>
                <input type="text" className="w-full form border p-2 rounded" placeholder="Input Batch Name" {...register("name")} />
              </div>
              <div className="w-full mt-4">
                <p>Batch Code {errors && (
                  <span className="text-red-1 text-sm">{errors.code}</span>
                )}</p>
                <input type="text" className="w-full form border p-2 rounded" placeholder="Input Batch Code" {...register("code")} />
              </div>
              <div className="flex flex-row-reverse gap-4 mt-4">
                <div type="submit" className="p-2" ><Button title="Save Batch" /></div>
                <button type="button" className="text-black-4 p-3 rounded-lg" onClick={onCloseCreateModalBatch}>Close</button>
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
Branch.layout = Layout