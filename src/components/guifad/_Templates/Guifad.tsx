import React, { useEffect, useState } from 'react'
import { IDataSource } from '../../../ushell-modulebase/lib/iDataSource'
import Guifad1 from './Guifad1'
import { ObjectGraphNode } from '../ObjectGraphNode'
import { IDataSourceManagerBase } from '../../../ushell-modulebase/lib/IDataSourceManager'

//TODO statt SchemRoot => genauere Funktionenen auf dem SchemaRoot wie getNavigations
// oder komplett nur IDataSourceManager reingeben
// IDataSourceManager: getDataSource, getNavigations
const Guifad: React.FC<{
  dataSourceManager: IDataSourceManagerBase
  rootEntityName: string
}> = ({ dataSourceManager, rootEntityName }) => {
  const [rootDataSource, setRootDataSource] = useState<IDataSource | null>(null)
  useEffect(() => {
    dataSourceManager.tryGetDataSource(rootEntityName).then((ds) => {
      setRootDataSource(ds)
    })
  }, [rootEntityName, dataSourceManager])

  if (!rootDataSource) {
    return <div>No Root Entity</div>
  }
  const rootNode: ObjectGraphNode = {
    dataSource: rootDataSource,
    parent: null,
    record: null,
  }
  return <Guifad1 dataSourceManager={dataSourceManager} rootNode={rootNode}></Guifad1>
}

export default Guifad
