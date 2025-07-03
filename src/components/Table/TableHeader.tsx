import React from 'react'
import FunnelIcon from '../../_Icons/FunnelIcon'
import SwitchIcon from '../../_Icons/SwitchIcon'
import BarsArrowUpIcon from '../../_Icons/BarsArrowUpIcon'
import BarsArrowDownIcon from '../../_Icons/BarsArrowDownIcon'

import { SortingField, LogicalExpression } from 'fusefx-repositorycontract'
import { TableColors, TableColumn } from '../guifad/_Organisms/Table'

export const TableHeader: React.FC<{
  columns: TableColumn[]
  columnWidths: { [key: string]: number }
  tableColors?: TableColors
  sortingParams: SortingField[]
  toggleSorting: (key: string) => void
  filterByColumn: { [c: string]: LogicalExpression }
  onSetFilterVisible: (field: string, visible: boolean) => void
  handleResizeMouseDown: (e: React.MouseEvent, c: TableColumn) => void
  refId: string
  expandableRowProps?: any
  getColumnWidth: (key: string) => number
}> = ({
  columns,
  columnWidths,
  tableColors,
  sortingParams,
  toggleSorting,
  filterByColumn,
  onSetFilterVisible,
  handleResizeMouseDown,
  refId,
  expandableRowProps,
  getColumnWidth,
}) => (
  <thead className='USHell_Table_thead text-xs sticky top-0'>
    <tr className='UShell_Table_tr relative z-50'>
      {expandableRowProps && (
        <th
          id='column_expand'
          className={`USHell_Table_tg ${
            tableColors?.header || 'bg-tableHead dark:bg-tableHeadDark'
          } border-y-0 border-backgroundfour dark:border-backgroundfourdark`}
          style={
            'column_expand' in columnWidths
              ? { width: getColumnWidth('column_expand') }
              : { width: 50 }
          }
        ></th>
      )}
      {columns.map((c) => (
        <th
          id={`column_${c.key}`}
          key={c.label}
          className={`
            USHell_Table_th
            ${
              tableColors?.header ||
              'bg-tableHead dark:bg-tableHeadDark hover:bg-tableHover dark:hover:bg-tableHoverDark border-b-2 border-tableBorder dark:border-tableBorderDark'
            }
            cursor-pointer select-none`}
          onClick={(e) => {
            if (c.sortable) {
              e.stopPropagation()
              e.preventDefault()
              toggleSorting(c.key)
            }
          }}
          style={
            c.key in columnWidths ? { width: getColumnWidth(c.key) } : { minWidth: c.minCellLength }
          }
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1 px-4 py-2'>
              {c.label}
              {c.sortable && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    toggleSorting(c.key)
                  }}
                  className='pl-2'
                >
                  {!sortingParams.find((sf) => sf.fieldName == c.key) && <SwitchIcon />}
                  {sortingParams.find((sf) => sf.fieldName == c.key)?.descending && (
                    <BarsArrowDownIcon className='text-blue-600 dark:text-blue-400' />
                  )}
                  {sortingParams.find((sf) => sf.fieldName == c.key) &&
                    !sortingParams?.find((sf) => sf.fieldName == c.key)!.descending && (
                      <BarsArrowUpIcon className='text-blue-600 dark:text-blue-400' />
                    )}
                </button>
              )}
              <div className='z-50'>
                {c.renderFilter && (
                  <button
                    id={`${refId}_Filter_Button_${c.fieldName}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      onSetFilterVisible(c.fieldName, true)
                    }}
                    className={`${
                      filterByColumn[c.fieldName] ? 'bg-green-300 dark:bg-green-800' : ''
                    }  rounded-lg p-1`}
                  >
                    <FunnelIcon size={4} />
                  </button>
                )}
              </div>
            </div>
            <div
              style={{ cursor: 'ew-resize' }}
              className='resize-handle p-4 bg-transparent'
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => handleResizeMouseDown(e, c)}
            ></div>
          </div>
        </th>
      ))}
    </tr>
  </thead>
)
