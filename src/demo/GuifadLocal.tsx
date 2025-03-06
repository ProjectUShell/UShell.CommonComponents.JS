import React, { useEffect, useState } from 'react'
import GuifadFuse from '../components/guifad/_Templates/GuifadFuse'
import Guifad from '../components/guifad/_Templates/Guifad'
import { IDataSourceManagerWidget } from 'ushell-modulebase'
import { LocalStoreDataSource } from '../index_old'
import { ObjectGraphDataSource } from '../data/ObjectGraphDataSource'
import { LocalStoreDataSourceManager } from '../data/LocalDataSourceManager'
import { EntitySchema, SchemaRoot, FieldSchema, RelationSchema } from 'fusefx-modeldescription'

const GuifadLocal = () => {
  const [schemaRoot, setSchemaRoot] = useState<SchemaRoot | null>(null)
  useEffect(() => {
    fetch('AccountManagementSchema.json').then((response) => {
      response.json().then((json) => {
        setSchemaRoot(json)
      })
    })
  }, [])
  if (!schemaRoot) {
    return <div>Loading GuifadLocal...</div>
  }
  return (
    <div className='h-96'>
      <Guifad
        rootEntityName='Person'
        dataSourceManager={new LocalStoreDataSourceManager(schemaRoot)}
        // classNameAside='bg-red-400'
        // classNameAsideBorder='bg-blue-400'
        // classNameContent='bg-pink-400'
      ></Guifad>
    </div>
  )
}

export default GuifadLocal
