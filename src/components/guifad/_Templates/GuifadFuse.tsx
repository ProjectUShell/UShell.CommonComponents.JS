import React, { useEffect, useState } from 'react'
import Guifad from './Guifad'
import { SchemaRoot } from 'fusefx-modeldescription'
import { FuseConnector } from '../../../data/FuseConnector'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FuseDataStore } from '../../../data/FuseDataStore'

const queryClient = new QueryClient()

const GuifadFuse: React.FC<{ fuseUrl: string; rootEntityName: string }> = ({ fuseUrl, rootEntityName }) => {
  const [schemaRoot, setSchemaRoot] = useState<SchemaRoot | null | undefined>(undefined)

  useEffect(() => {
    FuseConnector.getEntitySchema(fuseUrl).then((r) => {
      console.log('es', r)
      setSchemaRoot(r)
    })
  }, [fuseUrl])

  if (schemaRoot == null) return <div>No Entity Schema!</div>
  if (schemaRoot == undefined) return <div>Loading...</div>

  return (
    <QueryClientProvider client={queryClient}>
      <Guifad dataSourceManager={new FuseDataStore(fuseUrl)} rootEntityName={rootEntityName}></Guifad>
    </QueryClientProvider>
  )
}

export default GuifadFuse
