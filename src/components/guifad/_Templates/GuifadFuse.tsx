import React, { useEffect, useMemo, useState } from 'react'
import Guifad from './Guifad'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FuseDataStore } from '../../../data/FuseDataStore'
import ErrorPage from '../../../_Molecules/ErrorScreen'
import LoadingScreen from '../../../_Molecules/LoadingScreen'

const queryClient = new QueryClient()

const GuifadFuse: React.FC<{
  fuseUrl: string
  routePattern: 'body' | 'route' | 'method'
  rootEntityName: string
}> = ({ fuseUrl, routePattern, rootEntityName }) => {
  const [dataStore, setDataStore] = useState<FuseDataStore | null | undefined>(undefined)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    try {
      const ds: FuseDataStore = new FuseDataStore(fuseUrl, routePattern)
      ds.init()
        .then(() => setDataStore(ds))
        .catch((reason: any) => {
          console.error(reason)
          setError([reason])
        })
    } catch (error) {
      setDataStore(null)
    }
  }, [fuseUrl, routePattern])

  if (error) {
    return <ErrorPage messages={error}></ErrorPage>
  }
  if (!dataStore) {
    return <LoadingScreen message='Loading DataStore'></LoadingScreen>
  }

  if (dataStore == null) return <div>No Entity Schema!</div>
  if (dataStore == undefined) return <div>Loading...</div>
  return (
    <QueryClientProvider client={queryClient}>
      <Guifad dataSourceManager={dataStore} rootEntityName={rootEntityName}></Guifad>
    </QueryClientProvider>
  )
}

export default GuifadFuse
