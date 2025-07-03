import React, { useMemo } from 'react'
import Guifad from './Guifad'
import { IWidget } from 'ushell-modulebase'
import EntityTable from '../_Organisms/EntityTable'

const EntityTableModule: React.FC<{ widget: IWidget }> = ({ widget }) => {
  const dataSource = useMemo(() => {
    return widget.widgetHost.tryGetDataSource(widget.state.unitOfWork.entityName)
  }, [])
  if (!dataSource) {
    return <div>Data source not found for entity: {widget.state.unitOfWork.entityName}</div>
  }
  return (
    <EntityTable
      dataSourceManagerForNavigations={widget.widgetHost}
      dataSource={dataSource}
      layoutDescription={widget.state.unitOfWork?.layoutDescription}
      entitySchema={dataSource.entitySchema!}
      pageSizes={widget.state.unitOfWork?.pageSizes || [50, 100, 200, 500]}
    ></EntityTable>
  )
}

export default EntityTableModule
