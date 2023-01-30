import { FaAngleLeft, FaAngleRight, FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";

function Pagination3({ page, lastPage, total, limit, search, type = false, status = false, branch = false, batch = false, doLimit, doData }) {
  return (

    <div className="flex mt-8 flex-row-reverse flex-end gap-4 text-sm">
      <button className={`${page !== lastPage ? 'bg-black-6' : 'cursor-default'} rounded-full p-1`} onClick={() => {
        if (page !== lastPage) {
          if (branch !== false && batch !== false) {
            doData(search, branch, batch, status, limit, lastPage)
          } else if (branch !== false && status !== false) {
            doData(search, branch, status, limit, lastPage)
          } else if (type !== false && status !== false) {
            doData(search, type, status, limit, lastPage)
          } else if (status !== false) {
            doData(search, status, limit, lastPage)
          } else {
            doData(search, limit, lastPage)
          }
        }
      }}>
        <FaAngleDoubleRight />
      </button>
      <button className={`${page < lastPage ? 'bg-black-6' : 'cursor-default'} rounded-full p-1`} onClick={() => {
        if (page < lastPage) {
          if (branch !== false && batch !== false) {
            doData(search, branch, batch, status, limit, page + 1)
          } else if (branch !== false && status !== false) {
            doData(search, branch, status, limit, page + 1)
          } else if (type !== false && status !== false) {
            doData(search, type, status, limit, page + 1)
          } else if (status !== false) {
            doData(search, status, limit, page + 1)
          } else {
            doData(search, limit, page + 1)
          }
        }
      }}>
        <FaAngleRight />
      </button>
      <button className={`${page > 1 ? 'bg-black-6' : 'cursor-default'} p-1  rounded-full align-middle`} onClick={() => {
        if (page > 1) {

          if (branch !== false && batch !== false) {
            doData(search, branch, batch, status, limit, page - 1)
          } else if (branch !== false && status !== false) {
            doData(search, branch, status, limit, page - 1)
          } else if (type !== false && status !== false) {
            doData(search, type, status, limit, page - 1)
          } else if (status !== false) {
            doData(search, status, limit, page - 1)
          } else {
            doData(search, limit, page - 1)
          }
        }
      }}>
        <FaAngleLeft />
      </button>
      <button className={`${page !== 1 ? 'bg-black-6' : 'cursor-default'} rounded-full p-1`} onClick={() => {
        if (page !== 1) {
          if (branch !== false && batch !== false) {
            doData(search, branch, batch, status, limit, 1)
          } else if (branch !== false && status !== false) {
            doData(search, branch, status, limit, 1)
          } else if (type !== false && status !== false) {
            doData(search, type, status, limit, 1)
          } else if (status !== false) {
            doData(search, status, limit, 1)
          } else {
            doData(search, limit, 1)
          }
        }
      }}>
        <FaAngleDoubleLeft />
      </button>
      <span> {page < lastPage ? page : lastPage} - {lastPage} from {total}</span>
      <select className="bg-white" value={limit} onChange={(e) => {
        doLimit(e.target.value)
        if (branch !== false && batch !== false) {
          doData(search, branch, batch, status, e.target.value, page)
        } else if (branch !== false && status !== false) {
          doData(search, branch, status, e.target.value, page)
        } else if (type !== false && status !== false) {
          doData(search, type, status, e.target.value, page)
        } else if (status !== false) {
          doData(search, status, e.target.value, page)
        } else {
          doData(search, e.target.value, page)
        }

      }}>
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
        <option>5</option>
      </select>
      <span>Data per page : </span>
    </div>
  )
}

export default Pagination3