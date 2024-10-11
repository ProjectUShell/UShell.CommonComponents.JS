import React, { useEffect, useMemo, useState } from 'react'
import { IDataSource, IDataSourceManagerBase, IWidgetHost } from 'ushell-modulebase'
import { EntitySchema } from 'fusefx-modeldescription'
import Guifad1 from './Guifad1'
import { ObjectGraphNode } from '../ObjectGraphNode'
import { EntityLayout } from '../../../[Move2LayoutDescription]/EntityLayout'
import { LayoutDescriptionRoot } from '../../../[Move2LayoutDescription]/LayoutDescriptionRoot'
import { IDataSourceManagerWidget } from './IDataSourceManagerWidget'

//TODO statt SchemRoot => genauere Funktionenen auf dem SchemaRoot wie getNavigations
// oder komplett nur IDataSourceManager reingeben
// IDataSourceManager: getDataSource, getNavigations
// TODO wenn kein rootEntityName => Auswahl der EntityTypes darstellen
const Guifad: React.FC<{
  dataSourceManager: IWidgetHost
  rootEntityName: string
  layoutDescription?: LayoutDescriptionRoot
  record?: any
  enterRecord?: (r: any, entitySchema: EntitySchema) => void
  uow?: any
  persistUow?: (uow: any) => void
}> = ({
  dataSourceManager,
  rootEntityName,
  record,
  enterRecord,
  layoutDescription = { entityLayouts: [], semanticVersion: '0', timestampUtc: '0' },
  uow,
  persistUow,
}) => {
  const [rootDataSource, setRootDataSource] = useState<IDataSource | null>(null)

  // useEffect(() => {
  //   setRootDataSource(dataSourceManager.tryGetDataSource(rootEntityName))
  // }, [rootEntityName, dataSourceManager])

  const rootDataSource2 = useMemo(() => {
    return dataSourceManager.tryGetDataSource(rootEntityName)
  }, [rootEntityName, dataSourceManager])

  if (!rootDataSource2) {
    return <div>No Root Entity</div>
  }
  const rootNode: ObjectGraphNode = {
    dataSource: rootDataSource2,
    parent: null,
    record: record,
  }
  return (
    <Guifad1
      dataSourceManager={dataSourceManager}
      rootNode={rootNode}
      enterRecord={enterRecord}
      layoutDescription={layoutDescription}
      uow={uow}
      persistUow={persistUow}
    ></Guifad1>
  )
}

export default Guifad
