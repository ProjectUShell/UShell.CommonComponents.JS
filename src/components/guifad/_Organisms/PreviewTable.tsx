import React, { useEffect, useState } from 'react'
import { IDataSource } from '../../../ushell-modulebase/lib/iDataSource'
import Table, { TableColumn } from './Table.tsx'
import { EntitySchema, SchemaRoot } from 'fusefx-modeldescription'
import { LogicalExpression } from '../../../fusefx-repositorycontract/LogicalExpression.js'
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
      { label: 'Label', fieldName: 'id', fieldType: 'number', key: 'label', maxCellLength: 30 },
    ]
    setColumns(newColumns)
    const parentFilter: LogicalExpression | null =
      parentSchema && parent && schemaRoot
        ? getParentFilter(schemaRoot, parentSchema, dataSource.entitySchema!, parent)
        : null
    console.log('parentFilter', parentFilter)
    dataSource.getRecords(parentFilter ? parentFilter : undefined).then((r) => {
      setRecords(r.page)
    })
  }, [dataSource, parentSchema, parent, schemaRoot])

  return (
    <div className='h-full w-64 pr-1 mt-1'>
      <Table
        columns={columns}
        records={records}
        onRecordEnter={onRecordEnter}
        className=''
        pagingParams={{ pageSize: 10, pageNumber: 1 }}
        totalCount={0}
      ></Table>
    </div>
  )
}

export default PreviewTable
