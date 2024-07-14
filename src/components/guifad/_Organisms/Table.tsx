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
  getId?: (e: any) => any
  className?: string
  classNameHeader?: string
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
  getId,
  className,
  classNameHeader,
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
  const [lastWidth, setLastWidth] = useState(window.innerWidth)
  const [widthDelta, setWidthDelta] = useState(0)

  // column resize
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({})
  const [dragStartWidth, setDragStartWidth] = useState(0)
  const [dragStartWidthNext, setDragStartWidthNext] = useState(0)
  const [dragStartX, setDragStartX] = useState(0)

  const currentWidth = window.innerWidth

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
    function getIdInternal(e: any): any {
      let res: any = null
      if (getId) {
        res = getId(e)
      } else {
        let idField = 'id'
        if (!(idField in e)) {
          idField = 'Id'
        }
        res = e[idField]
      }
      return res
    }
    function getIntialSelectedRows(): { [index: number]: boolean } {
      if (!initialSelectedRecord) {
        return []
      }
      const i: number = records.findIndex(
        (r) => getIdInternal(r) == getIdInternal(initialSelectedRecord),
      )
      const newSr: { [index: number]: boolean } = {}
      newSr[i] = true
      return newSr
    }
    setSelectedRows(getIntialSelectedRows())
  }, [records, initialSelectedRecord, getId])

  useEffect(() => {
    approxColumnWidth()

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
    e.preventDefault()
    e.stopPropagation()
    if (e.target.tagName == 'path' || e.target.tagName == 'svg') {
      return
    }
    if (!onSelectedRecordsChange) {
      return
    }
    const newSelectedValue = !selectedRows[i]
    if (!e.ctrlKey && !newSelectedValue) return
    const newSr = e.ctrlKey ? { ...selectedRows } : {}
    newSr[i] = newSelectedValue
    setSelectedRows((sr) => {
      return newSr
    })
    const selectedRecords: any[] = records.filter((r, i) => newSr[i])

    onSelectedRecordsChange(selectedRecords)
  }

  function onRowDoubleClick(i: number, e: any) {
    console.log('dbl click')
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
    const currentSortingField: SortingField | undefined = newSortingParams?.find(
      (sf) => sf.fieldName == colKey,
    )
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
      const ratio = desiredWidth / textWidth
      const desiredTextLength: number = ratio * textLength
      const s: string = v
      return v
      return s.substring(0, desiredTextLength)
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

  const handleResize = (key: string, widthDelta: number) => {
    const newWidths = { ...columnWidths }
    const newWidth: number = dragStartWidth + widthDelta
    if (newWidth < 150) return
    newWidths[key] = Math.max(dragStartWidth + widthDelta, 150)
    // setColumnWidths({ ...columnWidths, [key]: dragStartWidth + newWidth })
    const idx: number = columns.findIndex((c) => c.key == key)
    if (idx >= 0 && idx < columns.length - 1) {
      const nextKey: string = columns[idx + 1].key
      const newNextWidth: number = Math.max(dragStartWidthNext - widthDelta, 150)
      // console.log('newNextWidth', newNextWidth)
      // console.log('newWidth', newWidth)
      newWidths[nextKey] = newNextWidth
      // setColumnWidths({ ...columnWidths, [nextKey]: oldNextWidth - newWidth })
    }
    setColumnWidths(newWidths)
  }

  const getColumnWidth = (key: string) => {
    return columnWidths[key] || 150 // Default width if not defined
  }

  const getColumnWidthNext = (key: string) => {
    const idx: number = columns.findIndex((c) => c.key == key)
    if (idx >= 0 && idx < columns.length - 1) {
      const nextKey: string = columns[idx + 1].key
      return columnWidths[nextKey] || 150 // Default width if not defined
    }
    return 0
  }

  function getTableWidth() {
    let result = 0
    columns.forEach((c) => (result += getColumnWidth(c.key)))
    if ('column_expand' in columnWidths) {
      result += getColumnWidth('column_expand')
    }
    return result
  }

  function initColumnWidth() {
    // columnWidths[key] = document.getElementById(`column_${key}`)!.clientWidth
    if (expandableRowProps && !('column_expand' in columnWidths)) {
      const el: any = document.getElementById('column_expand')
      if (el) {
        columnWidths['column_expand'] = document.getElementById('column_expand')!.clientWidth
      }
    }
    columns.forEach((c) => {
      if (!(c.key in columnWidths)) {
        // console.log(`columnwidth ${c.key}`, document.getElementById(`column_${c.key}`)?.clientWidth)
        columnWidths[c.key] = document.getElementById(`column_${c.key}`)!.clientWidth
      }
    })
  }

  function approxColumnWidth() {
    const initialColumnWidths: { [key: string]: number } = {}
    let tableWidth = 0
    // columnWidths[key] = document.getElementById(`column_${key}`)!.clientWidth
    if (expandableRowProps && !('column_expand' in initialColumnWidths)) {
      const el: any = document.getElementById('column_expand')
      if (el) {
        initialColumnWidths['column_expand'] = document.getElementById('column_expand')!.clientWidth
        // columnWidths['column_expand'] = document.getElementById('column_expand')!.clientWidth
        tableWidth += initialColumnWidths['column_expand']
      }
    }
    columns.forEach((c) => {
      if (!(c.key in initialColumnWidths)) {
        // console.log(`columnwidth ${c.key}`, document.getElementById(`column_${c.key}`)?.clientWidth)
        initialColumnWidths[c.key] = document.getElementById(`column_${c.key}`)!.clientWidth
        tableWidth += initialColumnWidths[c.key]
      }
    })

    columns.forEach((c) => {
      if (!(c.key in initialColumnWidths)) {
        // console.log(`columnwidth ${c.key}`, document.getElementById(`column_${c.key}`)?.clientWidth)
        // columnWidths[c.key] = 100
      }
    })
  }

  // return (
  //   <div
  //     className={`bg-red-400 relative overflow-hidden shadow-md rounded-sm
  //     border border-backgroundfour dark:border-backgroundfourdark h-full w-full flex flex-col justify-between ${className}`}
  //   >
  //     <div className='flex flex-col h-full w-full overflow-auto bg-blue-300 border-2'></div>
  //   </div>
  // )
  return (
    <div
      className={`relative overflow-hidden shadow-lg1 drop-shadow-md1 
      h-full w-full flex flex-col justify-between ${
        className ? className : 'bg-bg1 dark:bg-bg1dark rounded-md '
      } `}
    >
      <div className='flex flex-col h-full w-full overflow-auto '>
        <table
          className={`w-full max-h-full text-sm text-left ${
            Object.keys(columnWidths).length > 0 ? 'table-fixed' : 'table-fixed1'
          } `}
          style={Object.keys(columnWidths).length > 0 ? { width: getTableWidth() } : {}}
        >
          <thead className='text-xs sticky top-0'>
            <tr className=''>
              {expandableRowProps && (
                <th
                  id={'column_expand'}
                  className='bg-tableHead dark:bg-tableHeadDark border-y-0  border-backgroundfour dark:border-backgroundfourdark'
                  style={
                    'column_expand' in columnWidths
                      ? { width: getColumnWidth('column_expand') }
                      : { width: 50 }
                  }
                ></th>
              )}
              {columns.map((c: TableColumn) => (
                <th
                  id={`column_${c.key}`}
                  // onMouseEnter={() => initColumnWidth(c.key)}
                  key={c.label}
                  className={`${
                    classNameHeader
                      ? classNameHeader
                      : 'bg-tableHead dark:bg-tableHeadDark hover:bg-tableHover dark:hover:bg-tableHoverDark border-y-0 border-backgroundfour dark:border-backgroundfourdark'
                  }
                  cursor-pointer`}
                  onClick={(e) => {
                    if (c.sortable) {
                      toggleSorting(c.key)
                    }
                  }}
                  style={c.key in columnWidths ? { width: getColumnWidth(c.key) } : {}}
                >
                  <div className='flex items-center justify-between '>
                    <div className='flex items-center gap-1 px-4 py-2'>
                      {c.label}
                      {onSortingParamsChange && c.sortable && (
                        <button onClick={(e) => toggleSorting(c.key)} className='pl-2'>
                          {!sortingParams.find((sf) => sf.fieldName == c.key) && (
                            <SwitchIcon></SwitchIcon>
                          )}
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
                                  {c.renderFilter(
                                    filterByColumn[c.fieldName],
                                    (f) => onColumnFilterChange(f, c),
                                    c,
                                  )}
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
                    </div>
                    <div
                      draggable
                      className='resize-handle cursor-w-resize p-4 bg-transparent'
                      onClick={(e) => e.stopPropagation()}
                      onDragStart={(e: any) => {
                        e.dataTransfer.dropEffect = 'move'
                        e.dataTransfer.effectAllowed = 'all'
                        const img = new Image()
                        // img.src = "example.gif";
                        e.dataTransfer.setDragImage(img, 10, 10)
                        e.defaultPrevented = false
                        e.dataTransfer.defaultPrevented = false
                        initColumnWidth()
                        setDragStartWidth(getColumnWidth(c.key))
                        setDragStartWidthNext(getColumnWidthNext(c.key))
                        setDragStartX(e.clientX)
                      }}
                      onDragEnd={(e) => {
                        setDragStartWidth(0)
                        setDragStartX(0)
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDragLeave={(e) => e.preventDefault()}
                      onDrag={(e: any) => {
                        e.preventDefault()
                        console.log('e', e.dataTransfer)
                        if (e.clientX == 0) {
                          return
                        }
                        const widhtDelta = e.clientX - dragStartX
                        handleResize(c.key, widhtDelta)
                      }}
                    ></div>
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
                  className={`border-t border-b border-bg3 dark:border-bg3dark  ${
                    selectedRows[i]
                      ? 'bg-prim1 dark:bg-prim6 text-textonedark'
                      : 'bg-table dark:bg-tableDark hover:bg-tableHover dark:hover:bg-tableHoverDark'
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
                      className={`px-4 py-${
                        rowHeight !== undefined ? rowHeight : 4
                      } font-medium text-gray-900 whitespace-nowrap dark:text-white`}
                      style={
                        'column_expand' in columnWidths
                          ? { width: getColumnWidth('column_expand') }
                          : { width: 30 }
                      }
                    >
                      <button
                        id={`expand_${i}`}
                        className='rounded-md hover:text-blue-600'
                        onClick={(e) => onToggleRowExpand(i)}
                      >
                        {rowExpanded[i] ? (
                          <MinusCircleIcon></MinusCircleIcon>
                        ) : (
                          <PlusCircleIcon></PlusCircleIcon>
                        )}
                      </button>
                    </td>
                  )}
                  {columns.map((c, j) => (
                    <td
                      id={`table_cell_${j}_${i}`}
                      key={j}
                      className={` border-y-0 border-backgroundfour dark:border-backgroundfourdark px-4 py-${
                        rowHeight !== undefined ? rowHeight : 4
                      } font-normal text-gray-900 whitespace-nowrap dark:text-white overflow-hidden`}
                      style={
                        c.key in columnWidths ? { width: getColumnWidth(c.key) } : { maxWidth: 300 }
                      }
                    >
                      {c.onRenderCell ? (
                        c.onRenderCell(
                          c.fieldName in r ? r[c.fieldName] : r[lowerFirstLetter(c.fieldName)],
                        )
                      ) : (
                        <>
                          {c.fieldName in r
                            ? getDisplay(
                                r[c.fieldName],
                                c,
                                document.getElementById(`table_cell_${j}_${i}`),
                              )
                            : getDisplay(
                                r[lowerFirstLetter(c.fieldName)],
                                c,
                                document.getElementById(`table_cell_${j}_${i}`),
                              )}
                        </>
                      )}
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
