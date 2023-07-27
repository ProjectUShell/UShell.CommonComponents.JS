import React, { useEffect, useState } from 'react'
import { IDataSource } from 'ushell-modulebase'
import { lowerFirstLetter } from '../../../utils/StringUtils'
import Paging from '../_Molecules/Paging'
import { PagingParams } from 'ushell-modulebase/lib/PagingParams'
import ArrowUpDownIcon from '../../../_Icons/ArrowUpDownIcon'
import { SortingField } from 'ushell-modulebase/lib/SortingField'
import ChevrodnDownIcon from '../../../_Icons/ChevrodnDownIcon'
import ArrowUpIcon from '../../../_Icons/ArrowUpIcon'
import BarsArrowUpIcon from '../../../_Icons/BarsArrowUpIcon'
import BarsArrowDownIcon from '../../../_Icons/BarsArrowDownIcon'
import SwitchIcon from '../../../_Icons/SwitchIcon'

export interface TableColumn {
  label: string
  fieldName: string
  onRenderCell?: (cellValue: any) => React.JSX.Element
  maxCellLength?: number
}

const Table: React.FC<{
  columns: TableColumn[]
  records: any[]
  className?: string
  onRecordEnter?: (r: any) => void
  onSelectedRecordsChange?: (selectedRecords: any[]) => void
  selectedRecord?: any
  pagingParams?: PagingParams
  totalCount?: number
  onPagingParamsChange?: (p: PagingParams) => void
  sortingParams?: SortingField[]
  onSortingParamsChange?: (sortingParams: SortingField[]) => void
}> = ({
  columns,
  records,
  className,
  onRecordEnter,
  onSelectedRecordsChange,
  selectedRecord,
  pagingParams,
  totalCount,
  onPagingParamsChange,
  sortingParams,
  onSortingParamsChange,
}) => {
  const [selectedRows, setSelectedRows] = useState<{ [index: number]: boolean }>({})
  const [initialSelectedRecord, setInitialSelectedRecord] = useState<any>(selectedRecord)
  const [reRender, setReRender] = useState(0)

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

  useEffect(() => {
    let timeOutFunctionId: any = null
    function onResizeEnd() {
      setReRender((r) => r + 1)
    }
    function handleResize() {
      clearTimeout(timeOutFunctionId)
      timeOutFunctionId = setTimeout(onResizeEnd, 200)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  console.log('selectedRows', selectedRows)
  function onRowClick(i: number, e: any) {
    const newSelectedValue = !selectedRows[i]
    const newSr = e.ctrlKey ? { ...selectedRows } : {}
    newSr[i] = newSelectedValue
    setSelectedRows((sr) => {
      return newSr
    })
    const selectedRecords: any[] = records.filter((r, i) => newSr[i])
    if (!onSelectedRecordsChange) {
      return
    }
    onSelectedRecordsChange(selectedRecords)
  }

  function onRowDoubleClick(i: number, e: any) {
    if (!onRecordEnter) {
      return
    }
    onRecordEnter(records[i])
  }

  function toggleSorting(fieldName: string) {
    if (!sortingParams || !onSortingParamsChange) {
      return
    }
    const currentSortingField: SortingField | undefined = sortingParams?.find((sf) => sf.fieldName == fieldName)
    if (!currentSortingField) {
      sortingParams?.push({ fieldName: fieldName, descending: false })
    } else if (currentSortingField.descending) {
      sortingParams?.splice(sortingParams.indexOf(currentSortingField), 1)
    } else {
      currentSortingField.descending = true
    }
    onSortingParamsChange([...sortingParams])
  }

  function getDisplay(v: any, c: TableColumn, test: any) {
    // console.log('test', test)
    // console.log('test.width', test?.offsetWidth)
    if (c.onRenderCell) {
      return c.onRenderCell(v)
    }
    if (!v.length) {
      return v
    }
    if (!c.maxCellLength) {
      return v
    }
    const charLength = 0.875 * 4
    const vLength = charLength * v.length
    const maxCellLength: number = c.maxCellLength ? c.maxCellLength : 20
    const maxVLength = maxCellLength * charLength
    console.log('vLength', vLength)
    console.log('maxCellLength', maxCellLength)
    console.log('maxVLength', maxVLength)
    console.log('test?.width', test?.offsetWidth)
    // if (maxVLength < test?.offsetWidth) {
    //   return v
    // }
    if (v.length > maxCellLength) {
      const s: string = v
      return s.substring(0, maxCellLength) + '...'
    }
    return v
  }

  return (
    <div className='relative overflow-auto shadow-md sm:rounded-lg h-full flex flex-col justify-between border-4 border-green-500'>
      <div className='flex flex-col h-full overflow-auto border-4 border-black'>
        <table className='w-full max-h-full text-sm text-left'>
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
                  <div className='flex items-center'>
                    {c.label}
                    <button onClick={(e) => toggleSorting(c.label)} className='pl-2'>
                      {!sortingParams?.find((sf) => sf.fieldName == c.label) && <SwitchIcon></SwitchIcon>}
                      {sortingParams?.find((sf) => sf.fieldName == c.label)?.descending && (
                        <BarsArrowDownIcon className='text-blue-600 dark:text-blue-400'></BarsArrowDownIcon>
                      )}
                      {sortingParams?.find((sf) => sf.fieldName == c.label) &&
                        !sortingParams?.find((sf) => sf.fieldName == c.label)!.descending && (
                          <BarsArrowUpIcon className='text-blue-600 dark:text-blue-400'></BarsArrowUpIcon>
                        )}
                    </button>
                  </div>
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
                  <td
                    id={`table_cell_${j}_${i}`}
                    key={j}
                    className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                  >
                    {getDisplay(r[lowerFirstLetter(c.fieldName)], c, document.getElementById(`table_cell_${j}_${i}`))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagingParams && onPagingParamsChange && (
        <Paging
          pagingParams={pagingParams}
          total={totalCount ? totalCount : 0}
          onPagingParamsChange={onPagingParamsChange}
        ></Paging>
      )}
    </div>
  )
}

export default Table
