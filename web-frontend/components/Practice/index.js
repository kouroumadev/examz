import Card from "../Cards/Card";
import { useEffect, useState } from 'react'
import {
  useDisclosure,
  Select
} from '@chakra-ui/react'
import Pagination from "../Pagination/pagination";
import apiPractice from "../../action/practice";
import Link from "next/link";
import Button from "../Button/button";
import { ModalDelete } from "../Modal/ModalDelete";
import ExamPracticeTable from "../Table/ExamsPracticeTable";
import { ModalUnPublish } from "../Modal/ModalUnpublish";
import apiExamCategoryType from "../../action/ExamCategoryType";

export default function IndexPractice() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const [limit, setLimit] = useState('5')
  const [page, setPage] = useState('1')
  const [listType, setListType] = useState([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedData, setSelectedData] = useState(null)
  const [dataInstitute, setDataInstitute] = useState([])
  const [list, setList] = useState([])
  const [render, setRender] = useState(false)
  const TableHead = ['Exam Name', 'Type', 'Start Date', 'Total Question', 'Status', 'Action']
  const {
    isOpen: isConfirmModal,
    onOpen: onOpenConfirmModal,
    onClose: onCloseConfirmModal
  } = useDisclosure()

  useEffect(() => {
    const getData = async () => {
      await apiPractice.index(search, type, status, limit, page)
        .then((res) => {
          console.log(res.data.data)
          setDataInstitute(res.data.data)
          setList(res.data.data.data)
          setPage(res.data.data.current_page)

        })
        .catch((err) => {
          // console.log(err)
        })
    }
    getData()
  }, [search, type, status, limit, page, render])


  const onDelete = async (id) => {
    await apiPractice.deleted(id)
      .then(() => setRender(!render))
      .catch((err) => {
        // console.log(err)
      })
  }

  const onUnpublish = async (id) => {
    await apiPractice.unpublish(id)
      .then(() => setRender(!render))
      .catch((err) => {
        // console.log(err)
      })
  }


  useEffect(() => {
    const getExamSubType = async () => {
      await apiExamCategoryType.allType()
        .then((res) => {
          setListType(res.data.data)
        })
    }
    getExamSubType()
  }, [])

  return (
    <div className="mt-12">
      <Card
        title="Practice"
        right={(
          <Link href="practice/create">
            <a>
              <Button title="+ Create Practice" />
            </a>
          </Link>
        )}
      >
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input type="text" className=" border rounded w-full mf:w-1/2 p-2 text-sm" value={search} placeholder="Search Exam" onChange={(e) => {
            setSearch(e.target.value)
          }} />

          <div className="flex gap-4 w-full md:w-full h-full  ">
            <div className="w-full rounded py-2 pl-2 border">
              <Select placeholder='All Type' size="sm" variant="unstyled" onChange={(e) => {
                setType(e.target.value)
              }}>
                {listType.map((item, index) => (
                  <option key={index} value={item.name}>{item.name}</option>
                ))}
              </Select>
            </div>
            <div className="w-full rounded py-2 pl-2 border">
              <Select placeholder='All Status' size="sm" variant="unstyled" onChange={(e) => {
                setStatus(e.target.value)
              }}>
                <option value='waiting'>Waiting</option>
                <option value='published'>Published</option>
                <option value='draft'>Draft</option>
                <option value='completed'>Completed</option>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <ExamPracticeTable TableHead={TableHead} list={list} onOpen={onOpen} setSelectedData={(id) => setSelectedData(id)} type="practice" onOpenPublish={onOpenConfirmModal} />
              </div>
              <Pagination page={page} lastPage={dataInstitute.last_page} limit={limit} search={search} type={type} status={status} total={dataInstitute.total} doLimit={data => setLimit(data)} doPage={data => setPage(data)} />
            </div>
          </div>
        </div>
      </Card>
      <ModalUnPublish isConfirmModal={isConfirmModal} onCloseConfirmModal={onCloseConfirmModal} selectedData={selectedData} onUnpublish={(data) => onUnpublish(data)} />
      <ModalDelete isOpen={isOpen} onClose={onClose} onDelete={(data) => onDelete(data)} selectedData={selectedData} />
    </div>
  )
}