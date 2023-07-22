import React, { useEffect, useState } from 'react'
import { IDataSource } from 'ushell-modulebase'
import { GetFuseDatasource } from '../FuseDatasource'
import { IDataSource2 } from '../IDataSource2'
import Guifad1 from './Guifad1'
import { EntitySchema, SchemaRoot } from 'fusefx-modeldescription'
import { ObjectGraphNode } from '../ObjectGraphNode'

const Guifad: React.FC<{
  getDataSource: (entityName: string) => IDataSource
  rootEntityName: string
  schemaRoot: SchemaRoot
}> = ({ getDataSource, rootEntityName, schemaRoot }) => {
  const rootDataSource: IDataSource = getDataSource(rootEntityName)
  // const rootEntity: EntitySchema | undefined = getDataSource(rootEntityName).entitySchema

  if (!rootDataSource) {
    return <div>No Root Entity</div>
  }
  const rootNode: ObjectGraphNode = {
    dataSource: rootDataSource,
    parent: null,
    record: null,
  }
  return <Guifad1 schemaRoot={schemaRoot} rootNode={rootNode} getDataSource={getDataSource}></Guifad1>
}

export default Guifad
