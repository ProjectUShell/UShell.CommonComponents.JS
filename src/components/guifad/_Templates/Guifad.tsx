import React from 'react'
import { IDataSource } from 'ushell-modulebase'
import Guifad1 from './Guifad1'
import { SchemaRoot } from 'fusefx-modeldescription'
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
