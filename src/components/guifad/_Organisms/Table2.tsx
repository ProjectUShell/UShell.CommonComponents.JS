import React, { useEffect, useState } from 'react'
import { lowerFirstLetter } from '../../../utils/StringUtils'
import Paging from '../_Molecules/Paging'
import BarsArrowUpIcon from '../../../_Icons/BarsArrowUpIcon'
import BarsArrowDownIcon from '../../../_Icons/BarsArrowDownIcon'
import SwitchIcon from '../../../_Icons/SwitchIcon'
import { LogicalExpression, PagingParams, SortingField } from 'fusefx-repositorycontract'
import FunnelIcon from '../../../_Icons/FunnelIcon'
import Dropdown from '../../../_Atoms/Dropdown'
import PlusCircleIcon from '../../../_Icons/PlusCircleIcon'
import MinusCircleIcon from '../../../_Icons/MinusCircleIcon'
import PaddingDummy from '../../../_Atoms/PaddingDummy'
import { TableColumn } from './Table'

export interface ExpandableProps {
  renderExpandedRow: (record: any) => React.JSX.Element
  rowExpandable: (record: any) => boolean
}

const Table2: React.FC<{
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
  rowHeight?: number
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
  rowHeight,
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
      if (!initialSelectedRecord) {
        return []
      }
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

  let canvas: any
  function getTextWidth(text: string, font: any) {
    // re-use canvas object for better performance
    const canvas1: any = canvas || (canvas = document.createElement('canvas'))
    const context = canvas1.getContext('2d')
    context.font = font
    const metrics = context.measureText(text)
    return metrics.width
  }

  function getCssStyle(element: any, prop: any) {
    if (!element) return null
    return window.getComputedStyle(element, null).getPropertyValue(prop)
  }

  function getCanvasFont(el = document.body) {
    const fontWeight = getCssStyle(el, 'font-weight') || 'normal'
    const fontSize = getCssStyle(el, 'font-size') || '16px'
    const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman'

    return `${fontWeight} ${fontSize} ${fontFamily}`
  }

  const [lastWidth, setLastWidth] = useState(window.innerWidth)
  const [widthDelta, setWidthDelta] = useState(0)
  const currentWidth = window.innerWidth

  if (currentWidth !== lastWidth) {
    setWidthDelta(currentWidth - lastWidth)
    setLastWidth(currentWidth)
  }

  function getDisplay(v: any, c: TableColumn, test: any) {
    if (!test) {
      return v
    }
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
    console.log('display', widthDelta)
    console.log('display client Width', test.clientWidth)
    const charLength = 0.875 * 4
    const vLength = charLength * v.length
    const maxCellLength: number = c.maxCellLength ? c.maxCellLength : 20
    const maxVLength = maxCellLength * charLength

    // if (maxVLength < test?.offsetWidth) {
    //   return v
    // }
    const textWidth = getTextWidth(v, getCanvasFont(test)) + 50
    if (textWidth > test.clientWidth) {
      const textLength = v.length
      let desiredWidth: number = maxCellLength > test.clientWidth ? maxCellLength : test.clientWidth
      if (widthDelta < 0) {
        desiredWidth = ((currentWidth + widthDelta) / currentWidth) * test.clientWidth
        if (desiredWidth < maxCellLength) {
          desiredWidth = maxCellLength
        }
        // desiredWidth = maxCellLength
      }
      if (widthDelta == 0) {
        desiredWidth = maxCellLength
      }
      console.log('desiredWidth', desiredWidth)
      const ratio = desiredWidth / textWidth
      const desiredTextLength: number = ratio * textLength
      const s: string = v
      return s.substring(0, desiredTextLength - 3) + '...'
    }
    return v
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
    <div
      className={`relative overflow-auto shadow-md sm:rounded-lg h-full w-full flex flex-col justify-between ${className}`}
    >
      <div className='flex flex-col h-full w-full overflow-auto'>
        <table className='border-collapse w-full max-h-full text-sm text-left'>
          <thead className='text-xs bg-backgroundfour dark:bg-backgroundfourdark sticky top-0'>
            <tr className=''>
              {expandableRowProps && <th className='border border-slate-600 px-6 py-3'></th>}
              {columns.map((c: TableColumn, index) => (
                <th key={c.label} className='border border-slate-600 px-6 py-3' style={{ width: 100 }}>
                  <div className='flex justify-between items-center gap-1'>
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
                    <div className='flex-1'>
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
                            <FunnelIcon size={4}></FunnelIcon>
                          </button>
                        </>
                      )}
                    </div>
                    <div className='px-2 hover:cursor-move'>|</div>
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
                  className={`border-b dark:border-gray-700 ${
                    selectedRows[i] ? 'bg-blue-300 dark:bg-blue-400' : 'bg-backgroundthree dark:bg-backgroundthreedark'
                  } text-sm`}
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
                    <td
                      className={`border border-slate-600 px-6 py-${
                        rowHeight !== undefined ? rowHeight : 4
                      } font-medium text-gray-900 whitespace-nowrap dark:text-white`}
                    >
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
                      style={{ width: 100 }}
                      className={`border border-slate-600 px-6 py-${
                        rowHeight !== undefined ? rowHeight : 4
                      } font-normal text-gray-900 whitespace-nowrap dark:text-white`}
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

export default Table2
