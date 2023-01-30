import Layout from "../../../Layout/Layout";
import Card from "../../../components/Cards/Card";
import { useEffect, useState } from 'react'
import Image from "next/image";
import {
  useDisclosure,
} from '@chakra-ui/react'
import Pagination from "../../../components/Pagination/pagination";
import { Select } from '@chakra-ui/react'
import apiQuiz from "../../../action/quiz";
import Link from "next/link";
import { ModalDelete } from "../../../components/Modal/ModalDelete";
import Button from "../../../components/Button/button";
import { ModalUnPublish } from "../../../components/Modal/ModalUnpublish";

export default function Create() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const [limit, setLimit] = useState('5')
  const [page, setPage] = useState('1')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedData, setSelectedData] = useState(null)
  const [dataInstitute, setDataInstitute] = useState([])
  const [list, setList] = useState([])
  const [render, setRender] = useState(false)
  const {
    isOpen: isConfirmModal,
    onOpen: onOpenConfirmModal,
    onClose: onCloseConfirmModal
  } = useDisclosure()

  useEffect(() => {
    const getData = async () => {
      await apiQuiz.index(search, type, status, limit, page)
        .then((res) => {
          setDataInstitute(res.data.data)
          setList(res.data.data.data)
          setPage(res.data.data.current_page)
  
          console.log(res.data.data)
        })
        .catch((err) => {
          // console.log(err)
        })
    }
    getData()
  }, [search, type, status, limit, page, render])


  const onDelete = async (id) => {
    await apiQuiz.deleted(id)
      .then(() => setRender(!render))
      .catch((err) => {
        // console.log(err)
      })
  }

  const onUnpublish = async (id) => {
    await apiQuiz.unpublish(id)
      .then(() => setRender(!render))
      .catch((err) => {
        // console.log(err)
      })
  }

  return (
    < >
      <div className="py-12">
        <Card
          title="Quizzes"
          right={(
            <Link href="/admin/quizzes/create">
              <a> <Button title="+ Create Quiz" /></a>
            </Link>
          )}
        >
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input type="text" className=" border rounded w-full md:w-1/2 p-2 text-sm" value={search} placeholder="Search Quiz" onChange={(e) => {
              setSearch(e.target.value)
            }} />

            <div className="flex gap-4 w-full md:w-1/2 h-full  ">
              <div className="w-full rounded py-2 pl-2 border">
                <Select placeholder='All Type' size="sm" variant="unstyled" onChange={(e) => {
                  setType(e.target.value)
                }}>
                  <option value='live'>Live</option>
                  <option value='mixed'>Mixed</option>
                </Select>
              </div>
              <div className="py-2 pl-2 w-full border rounded">
                <Select placeholder='All Status' size="sm" variant="unstyled" onChange={(e) => {
                  setStatus(e.target.value)
                }}>
                  <option value='published'>Published</option>
                  <option value='draft'>Draft</option>
                </Select>

              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="table md:min-w-full overflow-auto divide-y divide-gray-200 text-sm">
                    <thead className="bg-black-9" >
                      <th scope="col" className="px-6 py-3 text-left tracking-wider">
                        Quiz Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-center tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-center tracking-wider">
                        Action
                      </th>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {list.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div>{item.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>{item.type}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>{item.start_time ? item.start_time.split(" ")[0] + ' - ' + item.end_time.split(" ")[0] : '-'}</div>
                          </td>
                          <td className="h-12">
                            <div className={`${item.status === 'draft' ? 'bg-black-8 text-black-3' : 'bg-green-2 text-green-1'} text-center w-24 flex-0 m-auto font-bold  rounded py-1 `}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </div>
                          </td>
                          <td className="px-6 py-4 min-w-max whitespace-nowrap flex text-right gap-2 text-sm font-medium">
                            <div className="flex m-auto gap-4">
                              <Link href={`/admin/quizzes/view/${item.id}`}>
                                <a className="text-indigo-600 hover:text-indigo-900 ">
                                  <Image src="/asset/icon/table/fi_eye.svg" width={16} height={16} alt="icon edit" />
                                </a>
                              </Link>
                              {item.status === 'draft' && (
                                <div className="flex gap-4">
                                  <Link href={`quizzes/edit/${item.id}`}>
                                    <a className="text-indigo-600 hover:text-indigo-900">
                                      <Image src="/asset/icon/table/fi_edit.svg" width={16} height={16} alt="icon edit" />
                                    </a>
                                  </Link>
                                  <button href="#" className="text-indigo-600 hover:text-indigo-900">
                                    <Image src="/asset/icon/table/fi_trash-2.svg" width={16} height={16} alt="icon deleted" onClick={() => {
                                      // setNameDeleted(item.name)
                                      setSelectedData(item.id),
                                        onOpen()
                                    }} />
                                  </button>
                                </div>
                              )}
                              {item.status === 'waiting' && (
                                <>
                                  <button className="text-indigo-600 hover:text-indigo-900 m-auto" onClick={() => {
                                    setSelectedData(item.id),
                                      onOpenConfirmModal()
                                  }}>
                                    <Image src="/asset/icon/table/ic_repeat.svg" className="inline-block align-baseline " width={16} height={16} alt="icon deleted" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination page={page} lastPage={dataInstitute.last_page} limit={limit} search={search} type={type} status={status} total={dataInstitute.total} doLimit={data => setLimit(data)} doPage={data => setPage(data)}/>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <ModalUnPublish isConfirmModal={isConfirmModal} onCloseConfirmModal={onCloseConfirmModal} selectedData={selectedData} onUnpublish={(data) => onUnpublish(data)} />
      <ModalDelete isOpen={isOpen} onClose={onClose} onDelete={(data) => onDelete(data)} selectedData={selectedData} />
    </>
  )
}
Create.layout = Layout