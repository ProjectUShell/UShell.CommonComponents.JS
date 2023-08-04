import React, { useEffect, useState } from 'react'
import { lowerFirstLetter } from '../../../utils/StringUtils'
import Paging from '../_Molecules/Paging'
import { PagingParams } from 'ushell-modulebase/lib/PagingParams'
import { SortingField } from 'ushell-modulebase/lib/SortingField'
import BarsArrowUpIcon from '../../../_Icons/BarsArrowUpIcon'
import BarsArrowDownIcon from '../../../_Icons/BarsArrowDownIcon'
import SwitchIcon from '../../../_Icons/SwitchIcon'
import { LogicalExpression } from 'ushell-modulebase/lib/LogicalExpression'
import FunnelIcon from '../../../_Icons/FunnelIcon'
import Dropdown from '../../shell-layout/_Atoms/Dropdown'
import PlusCircleIcon from '../../../_Icons/PlusCircleIcon'
import MinusCircleIcon from '../../../_Icons/MinusCircleIcon'

export interface TableColumn {
  label: string
  fieldName: string
  fieldType: string
  key: string
  onRenderCell?: (cellValue: any) => React.JSX.Element
  maxCellLength?: number
  renderFilter?: (
    filter: LogicalExpression,
    onFilterChanged: (filter: LogicalExpression | null) => void,
    column: TableColumn,
  ) => React.JSX.Element
  sortable?: boolean
}

export interface ExpandableProps {
  renderExpandedRow: (record: any) => React.JSX.Element
  rowExpandable: (record: any) => boolean
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
  initialSortingParams?: SortingField[]
  onSortingParamsChange?: (sortingParams: SortingField[]) => void
  initialFilters?: { [c: string]: LogicalExpression }
  onFilterChanged?: (filterByColumn: { [c: string]: LogicalExpression }) => void
  expandableRowProps?: ExpandableProps
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
  initialSortingParams,
  onSortingParamsChange,
  initialFilters,
  onFilterChanged,
  expandableRowProps,
}) => {
  const [selectedRows, setSelectedRows] = useState<{ [index: number]: boolean }>({})
  const [initialSelectedRecord, setInitialSelectedRecord] = useState<any>(selectedRecord)
  const [filterVisible, setFilterVisible] = useState<{ [c: string]: boolean }>({})
  const [filterByColumn, setFilterByColumn] = useState<{ [c: string]: LogicalExpression }>(
    initialFilters ? initialFilters : {},
  )
  const [sortingParams, setSortingParams] = useState<SortingField[]>([])
  const [rowExpanded, setRowExpanded] = useState<{ [r: number]: boolean }>({})
  const [reRender, setReRender] = useState(0)

  useEffect(() => {
    if (!initialFilters) {
      setFilterByColumn({})
      return
    }
    setFilterByColumn(initialFilters)
  }, [initialFilters])

  useEffect(() => {
    if (!initialSortingParams) {
      setSortingParams([])
      return
    }
    setSortingParams(initialSortingParams)
  }, [initialSortingParams])

  useEffect(() => {
    function getIntialSelectedRows(): { [index: number]: boolean } {
      const i: number = records.findIndex((r) => r.id == initialSelectedRecord?.id)
      const newSr: { [index: number]: boolean } = {}
      newSr[i] = true
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

  function onRowClick(i: number, e: any) {
    if (e.target.tagName == 'path' || e.target.tagName == 'svg') {
      return
    }
    console.log('e.target', e.target.tagName)

    console.log('row click', e.target)
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

  function toggleSorting(colKey: string) {
    if (!onSortingParamsChange) {
      return
    }
    const newSortingParams = [...sortingParams]
    const currentSortingField: SortingField | undefined = newSortingParams?.find((sf) => sf.fieldName == colKey)
    if (!currentSortingField) {
      newSortingParams.push({ fieldName: colKey, descending: false })
    } else if (currentSortingField.descending) {
      newSortingParams.splice(newSortingParams.indexOf(currentSortingField), 1)
    } else {
      currentSortingField.descending = true
    }
    setSortingParams(newSortingParams)
    onSortingParamsChange(newSortingParams)
  }

  function onSetFilterVisible(c: string, v: boolean) {
    setFilterVisible((f) => {
      const newFilterVisible = { ...f }
      newFilterVisible[c] = v
      return newFilterVisible
    })
  }

  function getDisplay(v: any, c: TableColumn, test: any) {
    if (c.onRenderCell) {
      return c.onRenderCell(v)
    }
    if (!v) {
      return v
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

    // if (maxVLength < test?.offsetWidth) {
    //   return v
    // }
    if (v.length > maxCellLength) {
      const s: string = v
      return s.substring(0, maxCellLength) + '...'
    }
    return v
  }

  function onColumnFilterChange(columnFilter: LogicalExpression | null, column: TableColumn) {
    if (!onFilterChanged) {
      return
    }
    if (columnFilter) {
      filterByColumn[column.fieldName] = columnFilter
    } else {
      delete filterByColumn[column.fieldName]
    }
    setFilterByColumn({ ...filterByColumn })
    setFilterVisible((fv) => {
      fv[column.fieldName] = false
      return { ...fv }
    })
    onFilterChanged(filterByColumn)
  }

  function onToggleRowExpand(r: number) {
    setRowExpanded((re) => {
      re[r] = !re[r]
      return { ...re }
    })
  }

  return (
    <div className={`relative overflow-auto shadow-md sm:rounded-lg h-full flex flex-col justify-between ${className}`}>
      <div className='flex flex-col h-full overflow-auto'>
        <table className='w-full max-h-full text-sm text-left'>
          <thead className='text-xs uppercase bg-backgroundfour dark:bg-backgroundfourdark sticky top-0'>
            <tr className=''>
              {expandableRowProps && <th className='flex items-center gap-1'></th>}
              {columns.map((c: TableColumn) => (
                <th key={c.label} className='px-6 py-3'>
                  <div className='flex items-center gap-1'>
                    {c.label}
                    {onSortingParamsChange && c.sortable && (
                      <button onClick={(e) => toggleSorting(c.key)} className='pl-2'>
                        {!sortingParams.find((sf) => sf.fieldName == c.key) && <SwitchIcon></SwitchIcon>}
                        {sortingParams.find((sf) => sf.fieldName == c.key)?.descending && (
                          <BarsArrowDownIcon className='text-blue-600 dark:text-blue-400'></BarsArrowDownIcon>
                        )}
                        {sortingParams.find((sf) => sf.fieldName == c.key) &&
                          !sortingParams?.find((sf) => sf.fieldName == c.key)!.descending && (
                            <BarsArrowUpIcon className='text-blue-600 dark:text-blue-400'></BarsArrowUpIcon>
                          )}
                      </button>
                    )}
                    <div className=''>
                      {c.renderFilter && onFilterChanged && (
                        <>
                          {filterVisible[c.fieldName] && (
                            <Dropdown setIsOpen={(o) => onSetFilterVisible(c.fieldName, o)}>
                              <div className='w-40 bg-backgroundone dark:bg-backgroundonedark p-2 rounded-md'>
                                {c.renderFilter(filterByColumn[c.fieldName], (f) => onColumnFilterChange(f, c), c)}
                              </div>
                            </Dropdown>
                          )}
                          <button
                            onClick={(e) => onSetFilterVisible(c.fieldName, true)}
                            className={`${
                              filterByColumn[c.fieldName] ? 'bg-green-200 dark:bg-green-600' : ''
                            }  rounded-lg p-1`}
                          >
                            <FunnelIcon></FunnelIcon>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='overflow-auto h-full'>
            {records.map((r, i) => {
              const renderRow = (
                <tr
                  key={i}
                  className={`border-b bg-backgroundthree dark:bg-backgroundthreedark dark:border-gray-700 ${
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
                  {expandableRowProps && expandableRowProps.rowExpandable(r) && (
                    <td className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                      <button
                        id={`expand_${i}`}
                        className='rounded-md hover:text-blue-600'
                        onClick={(e) => onToggleRowExpand(i)}
                      >
                        {rowExpanded[i] ? <MinusCircleIcon></MinusCircleIcon> : <PlusCircleIcon></PlusCircleIcon>}
                      </button>
                    </td>
                  )}
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
              )
              return rowExpanded[i]
                ? [
                    renderRow,
                    <tr key={i + 1000} className=''>
                      <td className='' colSpan={columns.length + 1}>
                        {expandableRowProps?.renderExpandedRow(r)}
                      </td>
                    </tr>,
                  ]
                : renderRow
            })}
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
