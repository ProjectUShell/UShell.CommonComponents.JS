import React from 'react'

import { TableColumn, TableColors, ExpandableProps } from '../guifad/_Organisms/Table'
import TableRow from './TableRow'

interface TableBodyProps {
  columns: TableColumn[]
  filteredRecords: any[]
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
  isParentRowOpen1: (recordIndex: number) => boolean
  getDisplay: (v: any, c: TableColumn, test: any) => React.ReactNode
  onRowClick: (i: number, e: any) => void
  onRowDoubleClick: (i: number, e: any) => void
}

const TableBody: React.FC<TableBodyProps> = ({
  columns,
  filteredRecords,
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
  isParentRowOpen1,
  getDisplay,
  onRowClick,
  onRowDoubleClick,
}) => (
  <tbody className='overflow-auto h-full'>
    {filteredRecords.map((r, i) => {
      const renderRow = (
        <TableRow
          key={i}
          i={i}
          r={r}
          columns={columns}
          finalSelectedRows={finalSelectedRows}
          columnWidths={columnWidths}
          rowHeight={rowHeight}
          tableColors={tableColors}
          expandableRowProps={expandableRowProps}
          rowExpanded={rowExpanded}
          onToggleRowExpand={onToggleRowExpand}
          isParent={isParent}
          showTree={showTree}
          getColumnWidth={getColumnWidth}
          getNestingDepth1={getNestingDepth1}
          nestingInfo={nestingInfo}
          isRowOpen={isRowOpen}
          getDisplay={getDisplay}
          onRowClick={onRowClick}
          onRowDoubleClick={onRowDoubleClick}
        />
      )
      if (!isParentRowOpen1(i)) return <tr key={i}></tr>
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
)

export default TableBody
