import React, { useState, useRef } from 'react'
import styled from 'styled-components'

interface Column {
  key: string
  name: string
  width: number
}

interface Row {
  [key: string]: string | number
}

interface ResizableTableProps {
  columns: Column[]
  data: Row[]
}

const StyledTable = styled.table`
  border-collapse: collapse;
`

const StyledTh = styled.th<{ width: number }>`
  padding: 8px;
  background-color: #f2f2f2;
  border: 1px solid #ddd;
  width: ${({ width }: any) => width}px;
  position: relative;
`

const ResizeHandle = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 5px;
  height: 100%;
  cursor: col-resize;
`

const ResizableTable: React.FC<ResizableTableProps> = ({ columns, data }) => {
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>(
    columns.reduce((acc, column) => ({ ...acc, [column.key]: column.width }), {}),
  )
  const tableRef = useRef<HTMLTableElement>(null)

  const handleResize = (columnKey: string, newWidth: number) => {
    setColumnWidths({ ...columnWidths, [columnKey]: newWidth })
  }

  const handleMouseDown = (columnKey: string, event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    const startX = event.clientX
    const startWidth = columnWidths[columnKey]

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + moveEvent.clientX - startX
      handleResize(columnKey, newWidth)
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <StyledTable ref={tableRef}>
      <thead>
        <tr>
          {columns.map((column) => (
            <StyledTh key={column.key} width={columnWidths[column.key]}>
              {column.name}
              <ResizeHandle onMouseDown={(event: any) => handleMouseDown(column.key, event)} />
            </StyledTh>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column, columnIndex) => (
              <td key={`${rowIndex}-${columnIndex}`}>{row[column.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </StyledTable>
  )
}

export default ResizableTable
