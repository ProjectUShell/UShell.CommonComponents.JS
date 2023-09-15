import React, { useEffect, useState } from 'react'
import { GetFuseDatasource } from '../FuseDatasource'
import Guifad from './Guifad'
import { EntitySchema, SchemaRoot } from 'fusefx-modeldescription'
import { FuseConnector } from '../../../data/FuseConnector'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const GuifadFuse: React.FC<{ fuseUrl: string; rootEntityName: string }> = ({ fuseUrl, rootEntityName }) => {
  const [schemaRoot, setSchemaRoot] = useState<SchemaRoot | null | undefined>(undefined)

  useEffect(() => {
    FuseConnector.getEntitySchema(fuseUrl).then((r) => {
      console.log('es', r)
      setSchemaRoot(r)
    })
  }, [fuseUrl])

  function getSchema(entityName: string): EntitySchema | undefined {
    return schemaRoot!.entities?.find((e) => e.name == entityName)
  }

  if (schemaRoot == null) return <div>No Entity Schema!</div>
  if (schemaRoot == undefined) return <div>Loading...</div>

  return (
    <QueryClientProvider client={queryClient}>
      <Guifad
        schemaRoot={schemaRoot}
        rootEntityName={rootEntityName}
        getDataSource={(entityName: string) => GetFuseDatasource(fuseUrl, getSchema(entityName)!)}
      ></Guifad>
    </QueryClientProvider>
  )
}

export default GuifadFuse
