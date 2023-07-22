import React, { useEffect, useState } from 'react'
import { IDataSource } from 'ushell-modulebase'
import { lowerFirstLetter } from '../../../utils/StringUtils'
import Paging from '../_Molecules/Paging'

export interface TableColumn {
  label: string
}

export interface PagingParams {
  pageNumber: number
  pageSize: number
}

const Table: React.FC<{
  columns: TableColumn[]
  records: any[]
  className?: string
  onRecordEnter: (r: any) => void
  onSelectedRecordsChange: (selectedRecords: any[]) => void
  selectedRecord?: any
  pagingParams: PagingParams
}> = ({ columns, records, className, onRecordEnter, onSelectedRecordsChange, selectedRecord, pagingParams }) => {
  const [selectedRows, setSelectedRows] = useState<{ [index: number]: boolean }>({})
  const [initialSelectedRecord, setInitialSelectedRecord] = useState<any>(selectedRecord)

  useEffect(() => {
    function getIntialSelectedRows(): { [index: number]: boolean } {
      const i: number = records.findIndex((r) => r.id == initialSelectedRecord?.id)
      const newSr: { [index: number]: boolean } = {}
      newSr[i] = true
      console.log('initialSr', newSr)
      return newSr
    }
    setSelectedRows(getIntialSelectedRows())
  }, [records, initialSelectedRecord])

  console.log('selectedRows', selectedRows)
  function onRowClick(i: number, e: any) {
    const newSelectedValue = !selectedRows[i]
    const newSr = e.ctrlKey ? { ...selectedRows } : {}
    newSr[i] = newSelectedValue
    setSelectedRows((sr) => {
      return newSr
    })
    const selectedRecords: any[] = records.filter((r, i) => newSr[i])
    onSelectedRecordsChange(selectedRecords)
  }

  // useEffect(() => {
  //   if (selectedRecord) {
  //     const i: number = records.findIndex((r) => r.id == selectedRecord?.id)
  //     const newSr: { [index: number]: boolean } = {}
  //     newSr[i] = true
  //     setSelectedRows(newSr)
  //   } else {
  //     setSelectedRows([])
  //   }
  // }, [records, selectedRecord])

  function onRowDoubleClick(i: number, e: any) {
    onRecordEnter(records[i])
  }

  // return (
  //   <section>
  //     <header className='flex'>
  //       <div className='flex-1'>Column A</div>
  //       <div className='flex-1'>Column B</div>
  //       <div className='flex-1'>Column C</div>
  //     </header>
  //     <div className='flex'>
  //       <div className='flex-1'>1</div>
  //       <div className='flex-1'>2</div>
  //       <div className='flex-1'>3</div>
  //     </div>
  //   </section>
  // )

  return (
    <div className='relative overflow-auto shadow-md sm:rounded-lg h-full flex flex-col justify-between border-4 border-green-500'>
      <div className='flex flex-col h-full overflow-auto border-4 border-black'>
        <table className='w-full max-h-full text-sm text-left max-h-full'>
          <thead className='text-xs uppercase bg-backgroundfour dark:bg-backgroundfourdark sticky top-0'>
            <tr className=''>
              {/* <th scope='col' className='p-4'>
                <div className='flex items-center'>
                  <input
                    id='checkbox-all-search'
                    type='checkbox'
                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                  />
                  <label htmlFor='checkbox-all-search' className='sr-only'>
                    checkbox
                  </label>
                </div>
              </th> */}
              {columns.map((c) => (
                <th key={c.label} className='px-6 py-3'>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='overflow-auto h-full  border-4 border-pink-400'>
            {records.map((r, i) => (
              <tr
                key={i}
                className={`border-b bg-backgroundthree dark:bg-backgroundthreedark hover:bg-blue-200 dark:hover:bg-blue-300 dark:border-gray-700 ${
                  selectedRows[i] && 'bg-blue-300 && dark:bg-blue-400'
                }`}
                onClick={(e) => onRowClick(i, e)}
                onDoubleClick={(e) => onRowDoubleClick(i, e)}
              >
                {/* <td className='w-4 p-4'>
                  <div className='flex items-center'>
                    <input
                      id='checkbox-table-search-1'
                      type='checkbox'
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                    />
                    <label htmlFor='checkbox-table-search-1' className='sr-only'>
                      checkbox
                    </label>
                  </div>
                </td> */}
                {columns.map((c, j) => (
                  <td key={j} className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                    {r[lowerFirstLetter(c.label)]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Paging pagingParams={pagingParams}></Paging>
    </div>
  )
}

export default Table
