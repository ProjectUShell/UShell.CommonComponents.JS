import React, { useEffect, useState } from 'react'
import { GetFuseDatasource } from '../FuseDatasource'
import Guifad from './Guifad'
import { EntitySchema, SchemaRoot } from 'fusefx-modeldescription'
import { FuseConnector } from '../FuseConnector'

const GuifadFuse: React.FC<{ fuseUrl: string; rootEntityName: string }> = ({ fuseUrl, rootEntityName }) => {
  const [schemaRoot, setSchemaRoot] = useState<SchemaRoot | null>(null)

  useEffect(() => {
    FuseConnector.getEntitySchema(fuseUrl).then((r) => {
      setSchemaRoot(r)
    })
  }, [fuseUrl])

  function getSchema(entityName: string): EntitySchema | undefined {
    return schemaRoot!.entities?.find((e) => e.name == entityName)
  }

  if (!schemaRoot) return <div>Loading...</div>

  return (
    <Guifad
      schemaRoot={schemaRoot}
      rootEntityName={rootEntityName}
      getDataSource={(entityName: string) => GetFuseDatasource(fuseUrl, getSchema(entityName)!)}
    ></Guifad>
  )
}

export default GuifadFuse
