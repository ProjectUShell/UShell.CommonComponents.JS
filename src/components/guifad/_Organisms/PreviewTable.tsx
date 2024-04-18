import React, { useEffect, useState } from 'react'
import { IDataSource } from 'ushell-modulebase'
import Table, { TableColumn } from './Table'
import { EntitySchema, SchemaRoot } from 'fusefx-modeldescription'
import { LogicalExpression } from 'fusefx-repositorycontract'
import { getParentFilter } from '../../../data/DataSourceService'

const PreviewTable: React.FC<{
  dataSource: IDataSource
  parentSchema: EntitySchema
  parent: any
  schemaRoot: SchemaRoot
  onRecordEnter: (r: any) => void
  onSelectedRecordsChange: (selectedRecords: any[]) => void
}> = ({ dataSource, onRecordEnter, onSelectedRecordsChange, schemaRoot, parentSchema, parent }) => {
  const [columns, setColumns] = useState<TableColumn[]>([])
  const [records, setRecords] = useState<any[]>([])

  useEffect(() => {
    // const newColumns: TableColumn[] = dataSource.entitySchema!.fields.map((f) => {
    //   return { label: f.name }
    // })
    const newColumns: TableColumn[] = [
      { label: 'Label', fieldName: 'label', fieldType: 'text', key: 'label', maxCellLength: 40 },
    ]
    setColumns(newColumns)
    const parentFilter: LogicalExpression | null =
      parentSchema && parent && schemaRoot
        ? getParentFilter(schemaRoot, parentSchema, dataSource.entitySchema!, parent)
        : null
    dataSource.getEntityRefs(parentFilter ? parentFilter : undefined, { pageNumber: 1, pageSize: 10 }).then((r) => {
      setRecords(r.page)
    })
  }, [dataSource, parentSchema, parent, schemaRoot])

  return (
    <div className='h-full w-full max-w-full pr-1 mt-1'>
      <Table
        columns={columns}
        records={records}
        onRecordEnter={onRecordEnter}
        className='overflow-auto'
        pagingParams={{ pageSize: 10, pageNumber: 1 }}
        totalCount={10}
      ></Table>
    </div>
  )
}

export default PreviewTable
