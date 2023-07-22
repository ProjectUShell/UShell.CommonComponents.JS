import React, { useEffect, useState } from 'react'
import { IDataSource } from 'ushell-modulebase'
import Table, { TableColumn } from './Table.tsx'

const PreviewTable: React.FC<{
  dataSource: IDataSource
  className?: string
  onRecordEnter: (r: any) => void
  onSelectedRecordsChange: (selectedRecords: any[]) => void
}> = ({ dataSource, className, onRecordEnter, onSelectedRecordsChange }) => {
  const [columns, setColumns] = useState<TableColumn[]>([])
  const [records, setRecords] = useState<any[]>([])

  useEffect(() => {
    // const newColumns: TableColumn[] = dataSource.entitySchema!.fields.map((f) => {
    //   return { label: f.name }
    // })
    const newColumns: TableColumn[] = [{ label: 'id' }]
    setColumns(newColumns)
    dataSource.getRecords().then((r) => {
      setRecords(r)
    })
  }, [dataSource])

  return (
    <Table
      columns={columns}
      records={records}
      onRecordEnter={onRecordEnter}
      onSelectedRecordsChange={onSelectedRecordsChange}
      className={className}
      pagingParams={{ pageSize: 10, pageNumber: 1 }}
    ></Table>
  )
}

export default PreviewTable
