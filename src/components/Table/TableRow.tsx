import React from 'react'
import PlusCircleIcon from '../../_Icons/PlusCircleIcon'
import MinusCircleIcon from '../../_Icons/MinusCircleIcon'
import ChevronRightIcon from '../../_Icons/ChevronRightIcon'
import { TableColumn, TableColors, ExpandableProps } from '../guifad/_Organisms/Table'
import { lowerFirstLetter } from '../../utils/StringUtils'

interface TableRowProps {
  i: number
  r: any
  columns: TableColumn[]
  finalSelectedRows: { [index: number]: boolean }
  columnWidths: { [key: string]: number }
  rowHeight?: number
  tableColors?: TableColors
  expandableRowProps?: ExpandableProps
  rowExpanded: { [r: number]: boolean }
  onToggleRowExpand: (i: number) => void
  isParent?: (c: any, p: any) => boolean
  showTree?: boolean
  getColumnWidth: (key: string) => number
  getNestingDepth1: (recordIndex: number) => number
  nestingInfo: any
  isRowOpen: (rowIndex: number) => boolean
  getDisplay: (v: any, c: TableColumn, test: any) => React.ReactNode
  onRowClick: (i: number, e: any) => void
  onRowDoubleClick: (i: number, e: any) => void
}

const TableRow: React.FC<TableRowProps> = ({
  i,
  r,
  columns,
  finalSelectedRows,
  columnWidths,
  rowHeight,
  tableColors,
  expandableRowProps,
  rowExpanded,
  onToggleRowExpand,
  isParent,
  showTree,
  getColumnWidth,
  getNestingDepth1,
  nestingInfo,
  isRowOpen,
  getDisplay,
  onRowClick,
  onRowDoubleClick,
}) => (
  <tr
    className={`border-t border-b border-tableBorder dark:border-tableBorderDark  ${
      finalSelectedRows[i]
        ? 'bg-prim1 dark:bg-prim2Dark text-textonedark'
        : `${tableColors?.cell ? tableColors.cell : 'bg-table dark:bg-tableDark'} ${
            tableColors?.cellHover
              ? tableColors.cellHover
              : 'hover:bg-tableHover dark:hover:bg-tableHoverDark'
          }  `
    } text-sm`}
    onClick={(e) => onRowClick(i, e)}
    onDoubleClick={(e) => onRowDoubleClick(i, e)}
  >
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
          onClick={(e) => {
            e.stopPropagation()
            onToggleRowExpand(i)
          }}
        >
          {rowExpanded[i] ? <MinusCircleIcon /> : <PlusCircleIcon />}
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
        style={c.key in columnWidths ? { width: getColumnWidth(c.key) } : { maxWidth: 300 }}
      >
        <div className='flex items-center'>
          {isParent && j == 0 && showTree && (
            <div
              style={{ marginLeft: `${getNestingDepth1(i) * 20}px` }}
              className='w-6 h-6 items-center align-middle content-center '
            >
              {nestingInfo[i].hasChildren && (
                <div
                  className='cursor-pointer'
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onToggleRowExpand(i)
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                  }}
                >
                  <ChevronRightIcon size={1.0} strokeWidth={3.5} rotate={isRowOpen(i) ? 90 : 0} />
                </div>
              )}
            </div>
          )}
          {c.onRenderCell ? (
            c.onRenderCell(c.fieldName in r ? r[c.fieldName] : r[lowerFirstLetter(c.fieldName)], r)
          ) : (
            <>
              {c.fieldName in r
                ? getDisplay(r[c.fieldName], c, document.getElementById(`table_cell_${j}_${i}`))
                : getDisplay(
                    r[lowerFirstLetter(c.fieldName)],
                    c,
                    document.getElementById(`table_cell_${j}_${i}`),
                  )}
            </>
          )}
        </div>
      </td>
    ))}
  </tr>
)

export default TableRow
