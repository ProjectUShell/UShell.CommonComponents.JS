import React, { useEffect, useState } from 'react'
import Guifad from './Guifad'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FuseDataStore } from '../../../data/FuseDataStore'

const queryClient = new QueryClient()

const GuifadFuse: React.FC<{ fuseUrl: string; rootEntityName: string }> = ({ fuseUrl, rootEntityName }) => {
  const [dataStore, setDataStore] = useState<FuseDataStore | null | undefined>(undefined)

  useEffect(() => {
    const ds: FuseDataStore = new FuseDataStore(fuseUrl)
    ds.init().then(() => setDataStore(ds))
  }, [fuseUrl])

  if (dataStore == null) return <div>No Entity Schema!</div>
  if (dataStore == undefined) return <div>Loading...</div>

  return (
    <QueryClientProvider client={queryClient}>
      <Guifad dataSourceManager={dataStore} rootEntityName={rootEntityName}></Guifad>
    </QueryClientProvider>
  )
}

export default GuifadFuse
