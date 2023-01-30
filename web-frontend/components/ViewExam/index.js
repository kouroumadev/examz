import Card from "../Cards/Card";
import { useEffect, useState } from 'react'
import { useDisclosure } from '@chakra-ui/react'
import Pagination from "../Pagination/pagination";
import apiExam from "../../action/exam";
import Link from "next/link";
import Button from "../Button/button";
import { ModalDelete } from "../Modal/ModalDelete";
import ExamPracticeTable from "../Table/ExamsPracticeTable";
import { ModalUnPublish } from "../Modal/ModalUnpublish";
import FilteringExams from "./FilteringExam";

export default function IndexExam() {
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
  const TableHead = ['Exam Name', 'Type', 'Date', 'Total Question', 'Status', 'Action']
  const {
    isOpen: isConfirmModal,
    onOpen: onOpenConfirmModal,
    onClose: onCloseConfirmModal
  } = useDisclosure()

  useEffect(() => {
    const getData = async () => {
      await apiExam.index(search, type, status, limit, page)
        .then((res) => {
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
    await apiExam.deleted(id)
      .then(() => setRender(!render))
      .catch((err) => {
        // console.log(err)
      })
  }

  const onUnpublish = async (id) => {
    await apiExam.unpublish(id)
      .then(() => setRender(!render))
      .catch((err) => {
        // console.log(err)
      })
  }

  return (
    <div className="mt-12">
      <Card
        title="Exams"
        right={(
          <Link href="exams/create">
            <a>
              <Button title="+ Create Exam" />
            </a>
          </Link>
        )}
      >
        <FilteringExams search={search} setSearch={data => setSearch(data)} setType={data => setType(data)} setStatus={data => setStatus(data)} />
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <ExamPracticeTable TableHead={TableHead} list={list} onOpen={onOpen} setSelectedData={(id) => setSelectedData(id)} type="exams" onOpenPublish={onOpenConfirmModal} />
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