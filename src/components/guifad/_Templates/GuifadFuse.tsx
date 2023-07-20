import React, { useEffect, useState } from 'react'
import { GetFuseDatasource } from '../FuseDatasource'
import Guifad from './Guifad'
import { IDataSource2 } from '../IDataSource2'

const GuifadFuse: React.FC<{ fuseUrl: string }> = ({ fuseUrl }) => {
  const [dataSource, setDataSource] = useState<IDataSource2 | null>(null)
  useEffect(() => {
    GetFuseDatasource(fuseUrl).then((ds) => {
      console.log(ds)
      setDataSource(ds)
      ds?.getRecords('Employee').then((r: any) => {
        console.log('records', r)
        console.log('es', ds.entitySchema)
      })
    })
  }, [fuseUrl])
  if (!dataSource) return <div>Loading...</div>
  return <Guifad dataSource={dataSource}></Guifad>
}

export default GuifadFuse
