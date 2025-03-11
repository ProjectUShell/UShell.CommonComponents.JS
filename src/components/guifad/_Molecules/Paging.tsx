import React, { useEffect, useState } from 'react'
import { PagingParams } from 'fusefx-repositorycontract'

const Paging: React.FC<{
  pagingParams: PagingParams
  total: number
  onPagingParamsChange: (p: PagingParams) => void
  pageSizes?: number[]
}> = ({ pagingParams, total, onPagingParamsChange, pageSizes = [10, 20, 50] }) => {
  const [pages, setPages] = useState<number[]>([])

  useEffect(() => {
    let numPages: number = Math.ceil(total / pagingParams.pageSize)
    if (!numPages || numPages == 0) {
      numPages = 1
    }
    if (numPages <= 5) {
      setPages(Array.from({ length: numPages }, (_, index) => index + 1))
    } else if (pagingParams.pageNumber <= 2) {
      setPages([1, 2, 3, 4, numPages])
    } else if (pagingParams.pageNumber >= numPages - 1) {
      setPages([1, numPages - 3, numPages - 2, numPages - 1, numPages])
    } else {
      setPages([
        1,
        pagingParams.pageNumber - 1,
        pagingParams.pageNumber,
        pagingParams.pageNumber + 1,
        numPages,
      ])
    }
  }, [pagingParams, total])

  return (
    <nav className='cc_paging flex items-center justify-between pt-3' aria-label='Table navigation'>
      <div className=''>
        <label className='my-auto mx-1  text-sm'>Page Size:</label>
        <select
          defaultValue={pagingParams.pageSize > 0 ? pagingParams.pageSize : 50}
          onChange={(e) =>
            onPagingParamsChange({ ...pagingParams, pageSize: Number.parseInt(e.target.value) })
          }
          className='bg-backgroundone dark:bg-backgroundonedark mr-2 rounded-md text-sm'
        >
          {pageSizes.map((ps) => (
            <option key={ps} value={ps}>
              {ps}
            </option>
          ))}
        </select>
        <span className='text-sm font-normal text-gray-500 dark:text-gray-400'>
          Showing{' '}
          <span className='font-semibold text-gray-900 dark:text-white'>
            {pagingParams.pageSize * (pagingParams.pageNumber - 1) + 1}-
            {pagingParams.pageSize * (pagingParams.pageNumber - 1) + pagingParams.pageSize}
          </span>{' '}
          of <span className='font-semibold text-gray-900 dark:text-white'>{total}</span>
        </span>
      </div>

      <ul className='inline-flex justify-between -space-x-px text-sm gap-1'>
        <li className=''>
          <button
            disabled={pagingParams.pageNumber == 1}
            onClick={(e) =>
              onPagingParamsChange({ ...pagingParams, pageNumber: pagingParams.pageNumber - 1 })
            }
            className='cursor-pointer py-1 flex items-center justify-center px-1 ml-0
             leading-tight text-gray-500  rounded-l-lg hover:bg-gray-100 hover:text-gray-700
              dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
          >
            Previous
          </button>
        </li>
        {pages.map((p) => (
          <li key={p}>
            <button
              onClick={(e) => onPagingParamsChange({ ...pagingParams, pageNumber: p })}
              className={`py-1 flex rounded-full items-center justify-center px-2 leading-tight
                hover:bg-gray-100 
                dark:border-gray-700  dark:hover:text-white
                ${
                  p == pagingParams.pageNumber
                    ? 'bg-prim1 dark:bg-prim3Dark'
                    : 'hover:text-gray-700 dark:hover:bg-gray-700'
                }`}
            >
              {p}
            </button>
          </li>
        ))}
        <li>
          <button
            disabled={pagingParams.pageNumber * pagingParams.pageSize >= total}
            onClick={(e) =>
              onPagingParamsChange({ ...pagingParams, pageNumber: pagingParams.pageNumber + 1 })
            }
            className='cursor-pointer py-1 flex items-center justify-center px-1 
              leading-tight text-gray-500 rounded-r-lg hover:bg-gray-100 hover:text-gray-700
               dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Paging
