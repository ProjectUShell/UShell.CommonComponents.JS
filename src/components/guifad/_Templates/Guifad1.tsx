import React, { useEffect, useState } from 'react'
import { ObjectGraphNode } from '../ObjectGraphNode'
import Breadcrumb from '../_Organisms/Breadcrumb'
import { IDataSource, IDataSourceManagerBase } from 'ushell-modulebase'
import StructureNavigation from '../_Organisms/StructureNavigation'
import { RelationSchema } from 'fusefx-modeldescription'
import EntityTable from '../_Organisms/EntityTable'
import EntityForm from '../_Organisms/EntityForm'
import { setParentId } from '../../../data/DataSourceService'
import { SchemaRoot } from 'fusefx-modeldescription'

const Guifad1: React.FC<{
  rootNode: ObjectGraphNode
  dataSourceManager: IDataSourceManagerBase
}> = ({ rootNode, dataSourceManager }) => {
  const [nodes, setCurrentNodes] = useState([rootNode])
  const [dataSource, setDataSource] = useState<IDataSource>(nodes[nodes.length - 1].dataSource)
  const [currentRecord, setCurrentRecord] = useState<any | null>(null)
  const [currentRelation, setCurrentRelation] = useState<RelationSchema | null>(null)
  const [currentMode, setCurrentMode] = useState<'list' | 'details'>('list')
  const [dirty, setDirty] = useState(false)
  const [schemaRoot, setSchemaRoot] = useState<SchemaRoot | null>(null)

  useEffect(() => {
    console.log('Guifad1 useEffect')

    dataSourceManager.getSchemaRoot().then((sr) => {
      console.log('Guifad1 sr', sr)
      setSchemaRoot(sr)
    })
  }, [dataSourceManager])

  if (!rootNode.dataSource) {
    return <div>No DataSource</div>
  }

  if (!rootNode.dataSource.entitySchema) {
    return <div>No EntitySchema</div>
  }

  function getCurrentNode(): ObjectGraphNode {
    return nodes[nodes.length - 1]
  }

  function enterRelation(rel: RelationSchema, r: any) {
    setCurrentRecord(r)
    if (r) {
      setCurrentMode('details')
      setCurrentRelation(null)
    }
    setCurrentRelation(null)

    dataSourceManager.tryGetDataSource(rel.foreignEntityName).then((ds) => {
      if (!ds) {
        console.error(`No dataSource ${rel.foreignEntityName}`)
        return
      }
      setCurrentNodes((n) => {
        n.push({
          dataSource: ds,
          parent: { ...getCurrentNode(), record: currentRecord },
          record: r,
        })
        return [...n]
      })
    })
  }

  function onSelectedRecordsChange(selectedRecords: any[]) {
    if (selectedRecords.length == 1) {
      setCurrentRecord(selectedRecords[0])
    } else {
      setCurrentRecord(null)
      setCurrentRelation(null)
    }
  }

  function createRecord(): void {
    const newRecord: any = dataSource.entityFactoryMethod()
    if (getCurrentNode().parent) {
      setParentId(
        newRecord,
        schemaRoot!,
        getCurrentNode().parent!.dataSource.entitySchema!,
        getCurrentDataSource().entitySchema!,
        getCurrentNode().parent!.record,
      )
    }
    console.log('new Record', newRecord)
    setCurrentRecord(newRecord)
    setCurrentMode('details')
    // return dataSource.entityUpdateMethod(dataSource.entityFactoryMethod()).then((newEntry: any) => {
    //   console.log('new Record', newEntry)
    // })
  }

  function getCurrentDataSource(): IDataSource {
    return nodes[nodes.length - 1].dataSource
  }

  function getParent(): ObjectGraphNode | null {
    if (nodes.length > 1) {
      return nodes[nodes.length - 2]
    } else {
      return null
    }
  }

  console.log('nodes', nodes)

  if (!schemaRoot) {
    return <div>no schema root</div>
  }

  return (
    <div className='w-full h-full flex overflow-hidden'>
      <div className='h-full w-full flex flex-col min-w-0'>
        <header className='flex flex-col'>
          <Breadcrumb
            nodes={nodes}
            onNodeClick={(n: ObjectGraphNode[], r: any) => {
              setCurrentNodes(n)
              setCurrentRecord(r)
              const newMode = r ? 'details' : 'list'
              setCurrentMode(newMode)
            }}
            dirty={dirty}
          ></Breadcrumb>
        </header>

        <div className='p-2 h-full overflow-auto'>
          {currentMode == 'list' && (
            <EntityTable
              dataSource={nodes[nodes.length - 1].dataSource}
              onRecordEnter={(r: any) => {
                console.log('record enter', r)
              }}
              onSelectedRecordsChange={(selectedRecords) => onSelectedRecordsChange(selectedRecords)}
              selectedRecord={currentRecord}
              onCreateRecord={createRecord}
              parentSchema={getParent()?.dataSource?.entitySchema}
              schemaRoot={schemaRoot}
              parent={getCurrentNode()?.parent?.record}
            ></EntityTable>
          )}
          {currentMode == 'details' && (
            <EntityForm
              dataSource={nodes[nodes.length - 1].dataSource}
              entity={currentRecord}
              dirty={dirty}
              setDirty={setDirty}
              onChange={(updatedEntity: any) => {
                setCurrentRecord(updatedEntity)
                setDirty(false)
              }}
            ></EntityForm>
          )}
        </div>
      </div>
      <aside className='flex flex-col justify-start bg-backgroundthree dark:bg-backgroundthreedark w-72 p-2'>
        <StructureNavigation
          schemaRoot={schemaRoot!}
          currentRecord={currentRecord}
          entitySchema={nodes[nodes.length - 1].dataSource.entitySchema!}
          onRelationSelected={(rel: RelationSchema) => setCurrentRelation(rel)}
          onRelationEnter={(rel: RelationSchema) => enterRelation(rel, null)}
          onModeSelected={(mode: 'list' | 'details') => setCurrentMode(mode)}
          mode={currentMode}
          relation={currentRelation}
          className=''
          dirty={dirty}
        ></StructureNavigation>
        {/* {currentRelation && currentRecord && (
          <PreviewTable
            dataSource={dataSourceManager.tryGetDataSource(currentRelation.foreignEntityName)}
            onRecordEnter={(r: any) => {
              console.log('record enter')
              enterRelation(currentRelation, r)
            }}
            onSelectedRecordsChange={(sr: any[]) => {
              console.log('sr', sr)
            }}
            parentSchema={getCurrentDataSource().entitySchema!}
            schemaRoot={dataSourceManager.getSchemaRoot()}
            parent={currentRecord}
          ></PreviewTable>
        )} */}
        {!currentRelation && <div className='h-full w-64 pr-1 mt-1'></div>}
      </aside>
    </div>
  )
}

export default Guifad1
