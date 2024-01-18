import React, { useState } from 'react'

interface TableColumn {
  key: string
  title: string
}

interface TableProps {
  columns: TableColumn[]
  data: any[]
}

const ResizableTable: React.FC<TableProps> = ({ columns, data }) => {
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({})
  const [dragStartWidth, setDragStartWidth] = useState(0)
  const [dragStartX, setDragStartX] = useState(0)
  const handleResize = (key: string, newWidth: number) => {
    setColumnWidths({ ...columnWidths, [key]: dragStartWidth + newWidth })
  }

  const getColumnWidth = (key: string) => {
    return columnWidths[key] || 150 // Default width if not defined
  }

  return (
    <div
      className={`relative overflow-auto shadow-md
        sm:rounded-lg h-full  flex flex-col justify-between`}
    >
      <table className='min-w-full'>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className='border border-gray-200 p-2 text-left bg-gray-100'
                style={{ width: getColumnWidth(column.key) }}
              >
                <div className='flex justify-between'>
                  {column.title}
                  <div
                    draggable
                    className='resize-handle hover:cursor-w-resize'
                    onDragStart={(e) => {
                      setDragStartWidth(getColumnWidth(column.key))
                      setDragStartX(e.clientX)
                    }}
                    onDragEnd={(e) => {
                      console.log('drag end')
                      setDragStartWidth(0)
                      setDragStartX(0)
                    }}
                    onDrag={(e) => {
                      if (e.clientX == 0) {
                        return
                      }
                      const widhtDelta = e.clientX - dragStartX
                      console.log('drag', e)
                      handleResize(column.key, widhtDelta)
                    }}
                  >
                    asd
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td
                  key={`${column.key}-${index}`}
                  className='border border-gray-200 p-2'
                  style={{ width: getColumnWidth(column.key) }}
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ResizableTable
