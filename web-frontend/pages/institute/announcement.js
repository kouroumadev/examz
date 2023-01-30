import Layout from "../../Layout/Layout";
import Card from "../../components/Cards/Card";
import apiAnnouncement from "../../action/announcement";
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
  Select
} from '@chakra-ui/react'
import { useForm } from "react-hook-form";
import Pagination from "../../components/Pagination/pagination";
import Multiselect from 'multiselect-react-dropdown';
import apiBatch from "../../action/batch";
import apiBranch from "../../action/branch";
import Button from "../../components/Button/button";
import { ModalDelete } from "../../components/Modal/ModalDelete";
import { ModalSuccessCreateEdit } from "../../components/Modal/ModalSuccess";

export default function Announcement() {
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState('5')
  const [page, setPage] = useState('1')
  const [branch, setBranch] = useState('')
  const [status, setStatus] = useState('')
  const [update, setUpdate] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [nameDeleted, setNameDeleted] = useState()
  const [listBranch, setListBranch] = useState([])
  const [listBatch, setListBatch] = useState([])
  const {
    isOpen: isCreateModal,
    onOpen: onOpenCreateModal,
    onClose: onCloseCreateModal
  } = useDisclosure()
  const {
    isOpen: isPublishModal,
    onOpen: onOpenPublishModal,
    onClose: onClosePublishModal
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
  const [render, setRender] = useState(false)
  const { register, handleSubmit, setValue, getValues, reset } = useForm();
  const [file, setFile] = useState()
  const [fileName, setFileName] = useState("Upload Your File")
  const [isPublish, setIsPublish] = useState()
  const [batchItem, setBatchItem] = useState([])
  const [branchItem, setBranchItem] = useState([])

  useEffect(() => {
    getBranch()
    getBatch()
  }, [])

  useEffect(() => {
    const getData = async () => {
      await apiAnnouncement.index(search, branch, status, limit, page)
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
  }, [search, branch, status, limit, page, render])

  const getBranch = async () => {
    await apiBranch.all()
      .then((res) => {
        console.log(res)
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
    await apiAnnouncement.detail(id)
      .then((result) => {
        const res = result.data.data
        console.log(res)
        setValue("title", res.title)
        setValue("sub_title", res.sub_title)
        setValue("description", res.description)
        setBatchItem(res.batches)
        setBranchItem(res.branches)
        setFileName(res.file)
      })
  }

  const onSubmit = async (form) => {
    console.log(form)
    console.log(branchItem)
    console.log(batchItem)
    // console.log(file)
    // console.log(isPublish)
    var data = new FormData();
    data.append("title", form.title)
    data.append("sub_title", form.sub_title)
    data.append("description", form.description)
    for (let i = 0; i < branchItem.length; i++) {
      const field = `branches[${i}]`
      data.append(field, branchItem[i].id)
    }
    for (let i = 0; i < batchItem.length; i++) {
      const field = `batches[${i}]`
      data.append(field, batchItem[i].id)
    }
    if (file) {
      data.append("file", file)
    }
    // data.append("file", "")
    data.append("status", isPublish)
    console.log(data)
    for (var key of data.entries()) {
      console.log(key[0] + ', ' + key[1]);
    }
    console.log("is Update : " + update)
    update ? await apiAnnouncement.update(selectedData, data)
      .then((res) => {
        reset(res)
        onCloseCreateModal()
        setRender(!render)
        onOpenSuccessModal()
        setFile(null)
      })
      .catch((err) => {
        setErrors(err.response.data.data)
        console.log(err)
      }) : await apiAnnouncement.create(data)
        .then((res) => {
          console.log("Success ")
          reset(res)
          onCloseCreateModal()
          setUpdate(false)
          setRender(!render)
          onOpenSuccessModal()
          setFile(null)
        })
        .catch((err) => {
          setErrors(err.response.data.data)
        })
  }

  const onDelete = async (id) => {
    await apiAnnouncement.deleted(id)
      .then((res) => {
        setRender(!render)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const chooseFile = (e) => {
    console.log(e.target)
    if (e.target) {
      if (e.target.files[0].type === 'application/pdf') {
        setFileName(e.target.files[0].name)
        setFile(e.target.files[0])
      } else {
        setFileName("Please upload pdf file")
      }

    }
  }

  const onSelectBranch = (list, item) => {
    setBranchItem(list)
  }
  const onRemoveBranch = (list, item) => {
    setBranchItem(list)
  }

  const onSelectBatch = (list, item) => {
    setBatchItem(list)
  }

  const onRemoveBatch = (list, item) => {
    setBatchItem(list)
  }

  const onPublish = async () => {
    console.log(selectedData)
    await apiAnnouncement.updateStatus(selectedData)
      .then(() => setRender(!render))
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <>
      <div className="mt-12">
        <Card
          title="Announcement"
          right={(
            <div onClick={() => {
              getBranch()
              setUpdate(false)
              onOpenCreateModal()
              setErrors(null)
              reset()
              setFileName("Upload Your File")
            }}>
              <Button title="+ Create" />
            </div>
          )}
        >

          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input type="text" className="border rounded w-full p-2 " placeholder="Search Announcement" onChange={(e) => {
              setSearch(e.target.value)
            }} />
            <div className="flex gap-4 w-full">
              <div className="md:w-full w-1/2 h-full  ">
                <Select placeholder='All Branch' className="h-full" size="md" onChange={(e) => {
                  setBranch(e.target.value)
                }}>
                  {listBranch.map((item, index) => (
                    <option key={index} value={item.name}>{item.name}</option>
                  ))}
                </Select>
              </div>

              <div className="md:w-full w-1/2 h-full  ">
                <Select placeholder='All Status' className="h-full" size="md" onChange={(e) => {
                  setStatus(e.target.value)
                }}>
                  <option value='draft'>Draft</option>
                  <option value='published'>Published</option>
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
                      <th scope="col" className="px-6 h-12 text-center tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 h-12 text-center tracking-wider">
                        Branch
                      </th>
                      <th scope="col" className="px-6 h-12 text-center tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 h-12 text-left tracking-wider">
                        Action
                      </th>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-center">
                      {list.map((item, index) => (
                        <tr key={index}>
                          <td className="h-12 whitespace-nowrap">
                            <div className="items-center text-center">
                              <div>
                                <div>{item.title}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 h-12 whitespace-nowrap">
                            {item.branches.map((item) => (
                              <p key={item}>{item.name} </p>
                            ))}
                          </td>

                          <td className="h-12">
                            <div className={`${item.status === 'draft' ? 'bg-black-8 text-black-3' : 'bg-green-2 text-green-1'} text-center w-24 flex-0 m-auto font-bold  rounded py-1 `}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </div>
                          </td>
                          <td className="px-6 h-12 min-w-max whitespace-nowrap flex text-right gap-2 text-sm font-medium">
                            {item.status === 'draft' && (
                              <>
                                <button className="text-indigo-600 hover:text-indigo-900" onClick={() => {
                                  getDetail(item.id)
                                  setSelectedData(item.id)
                                  setUpdate(true)
                                  onOpenCreateModal()
                                  setErrors(null)
                                  setFileName("Upload Your File")
                                }}>
                                  <Image src="/asset/icon/table/fi_edit.svg" width={16} height={16} alt="icon edit" />
                                </button>
                                <button className="text-indigo-600 hover:text-indigo-900" onClick={() => {
                                  setSelectedData(item.id)
                                  onOpenPublishModal()
                                  setErrors(null)
                                }}>
                                  <Image src="/asset/icon/table/ic_repeat.svg" width={16} height={16} alt="icon publish" />
                                </button>
                              </>
                            )}
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
                <Pagination page={page} lastPage={dataInstitute.last_page} limit={limit} search={search} branch={branch} status={status} total={dataInstitute.total} doLimit={data => setLimit(data)} doPage={data => setPage(data)} />
              </div>
            </div>
          </div>
        </Card>
      </div>


      <Modal isOpen={isCreateModal} onClose={onCloseCreateModal} size='xl'
        motionPreset='slideInBottom'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="md">{update ? 'Edit' : 'Add'} Announcement</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)} className="pb-4 text-sm">
              <div className="w-full">
                <p>Title {errors && (
                  <span className="text-red-1 text-sm">{errors.title}</span>
                )}</p>
                <input type="text" className="w-full form border p-2 rounded" placeholder="Input Title" {...register("title")} />
              </div>

              <div className="w-full mt-4">
                <p>Sub Title {errors && (
                  <span className="text-red-1 text-sm">{errors.sub_title}</span>
                )}</p>
                <input type="text" className="w-full form border p-2 rounded" placeholder="Input Sub Title" {...register("sub_title")} />
              </div>

              <div className="w-full mt-4">
                <p>Description {errors && (
                  <span className="text-red-1 text-sm">{errors.description}</span>
                )}</p>
                <textarea type="text" className="w-full h-24 form border p-2 rounded" placeholder="Input Description" {...register("description")} />
              </div>

              <div className="flex gap-4 mt-4 flex-col md:flex-row" >
                <div className="w-full ">
                  <p>Batch {errors && (
                    <span className="text-red-1 text-sm">{errors.batches}</span>
                  )}</p>
                  <Multiselect
                    className="z-100 "
                    options={listBatch}
                    style={{
                      "multiselectContainer": {
                        "padding": "2px",
                        "border-width": "1px",
                        "border-radius": "5px"
                      }, "searchBox": {
                        "border": "none",

                      },
                    }}
                    placeholder="Select Batch"
                    // singleSelect
                    // options={listTag} // Options to display in the dropdown
                    selectedValues={batchItem} // Preselected value to persist in dropdown
                    onSelect={onSelectBatch} // Function will trigger on select event
                    onRemove={onRemoveBatch} // Function will trigger on remove event
                    displayValue="name" // Property name to display in the dropdown options
                  />
                </div>
                <div className="w-full ">
                  <p>Branch {errors && (
                    <span className="text-red-1 text-sm">{errors.branches}</span>
                  )}</p>
                  <div>
                    <Multiselect
                      className="z-100 "
                      options={listBranch}
                      style={{
                        "multiselectContainer": {
                          "padding": "2px",
                          "border-width": "1px",
                          "border-radius": "5px"
                        }, "searchBox": {
                          "border": "none",

                        },
                      }}
                      placeholder="Select Branch"
                      // singleSelect
                      // options={listTag} // Options to display in the dropdown
                      selectedValues={branchItem} // Preselected value to persist in dropdown
                      onSelect={onSelectBranch} // Function will trigger on select event
                      onRemove={onRemoveBranch} // Function will trigger on remove event
                      displayValue="name" // Property name to display in the dropdown options
                    />

                  </div>
                </div>
              </div>

              <div className="w-full mt-4">
                <p>Upload File {errors && (
                  <span className="text-red-1 text-sm">{errors.file}</span>
                )}</p>
                <div className="flex gap-4">
                  {/* <input type="text" className=" flex-grow form border p-2 rounded" value={fileName} placeholder="Upload Your File" disabled {...register("title")} /> */}
                  <div className={`border rounded p-2  flex-grow text-black-4 ${fileName === 'Please upload pdf file' && 'text-red-1'}`}>
                    {fileName?.length > 45 ? fileName.substring(0, 45) + "..." : fileName}
                  </div>
                  <label htmlFor="file-input">
                    <div className="w-full border inline-flex rounded cursor-pointer p-2 text-blue-1 border-blue-1">
                      <span>Add File</span>
                    </div>
                  </label>
                </div>
                <div className="hidden">
                  <input id="file-input" type="file" accept="application/pdf" className="hidden -z-50" onChange={chooseFile} />
                </div>
              </div>

              <div className="flex flex-row-reverse gap-4 mt-4">
                <div onClick={() => setIsPublish("published")}  ><Button title="Publish" /></div>
                <button onClick={() => setIsPublish("draft")} className="border border-blue-1 hover:bg-blue-6  rounded p-2" >Save to Draft</button>
                <button type="button" className="text-black-4 p-2 rounded" onClick={onCloseCreateModal}>Close</button>
              </div>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Published Confirmation */}
      <Modal isOpen={isPublishModal} onClose={onClosePublishModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="md"><center> Publish Announcement</center></ModalHeader>
          <ModalBody>
            <center className="mb-8 text-sm">Are you sure to publish this Announcement ?</center>
            <div className="flex gap-4 justify-center">
              <button className="text-black-4  text-sm p-2" mr={3} onClick={onClosePublishModal}>
                Cancel
              </button>
              <div onClick={() => {
                onPublish()
                onClosePublishModal()
              }} onClose={onClosePublishModal}><Button title="Publish" /> </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>


      <ModalSuccessCreateEdit isSuccessModal={isSuccessModal} onCloseSuccessModal={onCloseSuccessModal} update={update} setUpdate={(data) => setUpdate(data)} />
      <ModalDelete isOpen={isOpen} onClose={onClose} onDelete={(data) => onDelete(data)} selectedData={selectedData} />
    </>
  )
}
Announcement.layout = Layout