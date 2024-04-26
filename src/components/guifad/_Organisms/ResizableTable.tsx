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
  const [dragStartWidthNext, setDragStartWidthNext] = useState(0)
  const [dragStartX, setDragStartX] = useState(0)
  const handleResize = (key: string, widthDelta: number) => {
    const newWidths = { ...columnWidths }
    newWidths[key] = dragStartWidth + widthDelta
    // setColumnWidths({ ...columnWidths, [key]: dragStartWidth + newWidth })
    const idx: number = columns.findIndex((c) => c.key == key)
    if (idx >= 0 && idx < columns.length - 1) {
      const nextKey: string = columns[idx + 1].key
      const newNextWidth: number = Math.max(dragStartWidthNext - widthDelta, 150)
      console.log('newNextWidth', newNextWidth)
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
    return result
  }

  function initColumnWidth(key: string) {
    if (key in columnWidths) return
    columnWidths[key] = document.getElementById(`column_${key}`)!.clientWidth
    console.log('columnwidth p1', document.getElementById('column_p1')?.clientWidth)
  }

  // return (
  //   <div
  //     className={`relative overflow-hidden shadow-md
  //   sm:rounded-lg h-full w-screen flex flex-col justify-between border-2 `}
  //   >
  //     <div className='flex flex-col h-full w-full overflow-auto'>
  //       <p style={{ width: 4000 }}>
  //         {/* style={{ width: 4000 }} */}
  //         asdsadsdsdsdssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssd asddddddddddddddd
  //         sdssssssssssssssssssssssssssssssssssssssss
  //         asdsadsdsdsdssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssd asddddddddddddddd
  //         sdssssssssssssssssssssssssssssssssssssssss
  //         asdsadsdsdsdssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssd asddddddddddddddd
  //         sdssssssssssssssssssssssssssssssssssssssss
  //       </p>
  //     </div>
  //   </div>
  // )
  console.log('table', columns)

  return (
    <div
      className={`relative overflow-hidden shadow-md
        sm:rounded-lg h-full w-full flex flex-col justify-between`}
    >
      <div className='flex flex-col h-full w-full overflow-auto'>
        <table style={Object.keys(columnWidths).length > 0 ? { width: getTableWidth() } : {}}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  id={`column_${column.key}`}
                  key={column.key}
                  className='border border-gray-200 p-2 text-left '
                  onMouseEnter={() => initColumnWidth(column.key)}
                  style={column.key in columnWidths ? { width: getColumnWidth(column.key) } : {}}
                >
                  <div className='flex justify-between'>
                    {column.title}
                    <div
                      draggable
                      className='resize-handle hover:cursor-w-resize'
                      onDragStart={(e) => {
                        setDragStartWidth(getColumnWidth(column.key))
                        setDragStartWidthNext(getColumnWidthNext(column.key))
                        setDragStartX(e.clientX)
                      }}
                      onDragEnd={(e) => {
                        setDragStartWidth(0)
                        setDragStartX(0)
                      }}
                      onDrag={(e) => {
                        if (e.clientX == 0) {
                          return
                        }
                        const widhtDelta = e.clientX - dragStartX
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
            <tr>
              {columns.map((column) => (
                <td
                  key={`${column.key}`}
                  className='border border-gray-200 p-2'
                  style={column.key in columnWidths ? { width: getColumnWidth(column.key) } : {}}
                >
                  {getColumnWidth(column.key)}
                </td>
              ))}
            </tr>
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
    </div>
  )
}

export default ResizableTable
