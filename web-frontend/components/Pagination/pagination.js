import { FaAngleLeft, FaAngleRight, FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";

function Pagination({ page, lastPage, total, limit, doLimit, doPage }) {
  return (

    <div className="flex mt-8 flex-row-reverse flex-end gap-4 text-sm">
      <button className={`${page !== lastPage ? 'bg-black-6' : 'cursor-default'} rounded-full p-1`} onClick={() =>  doPage(lastPage)}>
        <FaAngleDoubleRight />
      </button>
      <button className={`${page < lastPage ? 'bg-black-6' : 'cursor-default'} rounded-full p-1`} onClick={() => {
        if (page < lastPage) {
          doPage(page+1)
        }
      }}>
        <FaAngleRight />
      </button>
      <button className={`${page > 1 ? 'bg-black-6' : 'cursor-default'} p-1  rounded-full align-middle`} onClick={() => {
        if (page > 1) {
          doPage(page - 1)
        }
      }}>
        <FaAngleLeft />
      </button>
      <button className={`${page !== 1 ? 'bg-black-6' : 'cursor-default'} rounded-full p-1`} onClick={() => doPage(1)}>
        <FaAngleDoubleLeft />
      </button>
      <span> {page < lastPage ? page : lastPage} - {lastPage} from {total}</span>
      <select className="bg-white" value={limit} onChange={(e) => doLimit(e.target.value)}>
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

export default Pagination