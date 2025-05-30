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
  dataSourceManager: IDataSourceManagerWidget
  rootEntityName: string
  layoutDescription?: LayoutDescriptionRoot
  record?: any
  enterRecord?: (r: any, entitySchema: EntitySchema) => void
  uow?: any
  persistUow?: (uow: any) => void
  formStyleType?: number
  labelPosition?: 'top' | 'left'
  classNameContent?: string
  classNameAside?: string
  classNameAsideBorder?: string
  pageSizes?: number[]
}> = ({
  dataSourceManager,
  rootEntityName,
  record,
  enterRecord,
  layoutDescription = { entityLayouts: [], semanticVersion: '0', timestampUtc: '0' },
  uow,
  persistUow,
  formStyleType = 0,
  labelPosition = 'top',
  classNameContent = 'bg-content dark:bg-contentDark',
  classNameAside = 'bg-navigation dark:bg-navigationDark',
  classNameAsideBorder = 'border-navigationBorder dark:border-navigationBorderDark',
  pageSizes = [10, 20, 50],
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
      formStyleType={formStyleType}
      labelPosition={labelPosition}
      classNameContent={classNameContent}
      classNameAside={classNameAside}
      classNameAsideBorder={classNameAsideBorder}
      pageSizes={pageSizes}
    ></Guifad1>
  )
}

export default Guifad
