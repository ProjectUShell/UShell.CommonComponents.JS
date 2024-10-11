import React, { useEffect, useMemo, useState } from 'react'
import Guifad from './Guifad'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FuseDataStore } from '../../../data/FuseDataStore'
import ErrorPage from '../../../_Molecules/ErrorScreen'
import LoadingScreen from '../../../_Molecules/LoadingScreen'
import { LayoutDescriptionRoot } from '../../../[Move2LayoutDescription]/LayoutDescriptionRoot'
import { LocalWidgetHost } from '../../../data/LocalWidgetHost'
import { UsecaseState } from 'ushell-modulebase'

const queryClient = new QueryClient()

const GuifadFuse: React.FC<{
  fuseUrl: string
  routePattern: 'body' | 'route' | 'method'
  rootEntityName: string
  layoutDescription?: LayoutDescriptionRoot
  record?: any
}> = ({ fuseUrl, routePattern, rootEntityName, layoutDescription, record }) => {
  const [dataStore, setDataStore] = useState<FuseDataStore | null | undefined>(undefined)
  const [error, setError] = useState<any>(null)

  const usecaseInstanceUid: string = `${fuseUrl}_${rootEntityName}`

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

  const localWidgetHost: LocalWidgetHost = new LocalWidgetHost(dataStore)
  const usecaseState: UsecaseState = localWidgetHost.getUsecaseState(usecaseInstanceUid) || {
    fixed: true,
    parentWorkspaceKey: '',
    title: 'Guifad Fuse',
    unitOfWork: null,
    usecaseInstanceUid: usecaseInstanceUid,
    usecaseKey: 'GuifadFuse',
  }
  return (
    // <QueryClientProvider client={queryClient}>
    <Guifad
      dataSourceManager={localWidgetHost}
      rootEntityName={rootEntityName}
      record={record}
      layoutDescription={layoutDescription}
      uow={usecaseState.unitOfWork}
      persistUow={(uow) => {
        usecaseState.unitOfWork = uow
        localWidgetHost.populateChangedState(usecaseState)
      }}
    ></Guifad>
    // </QueryClientProvider>
  )
}

export default GuifadFuse
