import React, { useEffect, useMemo, useState } from 'react'
import { IDataSource, IDataSourceManagerBase } from 'ushell-modulebase'
import Guifad1 from './Guifad1'
import { ObjectGraphNode } from '../ObjectGraphNode'

//TODO statt SchemRoot => genauere Funktionenen auf dem SchemaRoot wie getNavigations
// oder komplett nur IDataSourceManager reingeben
// IDataSourceManager: getDataSource, getNavigations
// TODO wenn kein rootEntityName => Auswahl der EntityTypes darstellen
const Guifad: React.FC<{
  dataSourceManager: IDataSourceManagerBase
  rootEntityName: string
}> = ({ dataSourceManager, rootEntityName }) => {
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
    record: null,
  }
  return <Guifad1 dataSourceManager={dataSourceManager} rootNode={rootNode}></Guifad1>
}

export default Guifad
