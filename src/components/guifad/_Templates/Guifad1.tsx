import React, { useEffect, useMemo, useState } from 'react'
import { ObjectGraphNode } from '../ObjectGraphNode'
import Breadcrumb from '../_Organisms/Breadcrumb'
import { IDataSource, IDataSourceManagerBase } from 'ushell-modulebase'
import StructureNavigation from '../_Organisms/StructureNavigation'
import { RelationSchema } from 'fusefx-modeldescription'
import EntityTable from '../_Organisms/EntityTable'
import EntityForm from '../_Organisms/EntityForm'
import { setParentId } from '../../../data/DataSourceService'
import PreviewTable from '../_Organisms/PreviewTable'

const Guifad1: React.FC<{
  rootNode: ObjectGraphNode
  dataSourceManager: IDataSourceManagerBase
}> = ({ rootNode, dataSourceManager }) => {
  // states
  const [nodes, setCurrentNodes] = useState<ObjectGraphNode[]>([rootNode])
  const [currentRecord, setCurrentRecord] = useState<any | null>(null)
  const [currentRelation, setCurrentRelation] = useState<RelationSchema | null>(null)
  const [currentMode, setCurrentMode] = useState<'list' | 'details'>('list')
  const [dirty, setDirty] = useState(false)

  // useEffects
  useEffect(() => {
    setCurrentNodes([rootNode])
    setCurrentRecord(null)
    setCurrentRelation(null)
    setCurrentMode('list')
  }, [rootNode])

  // guards
  if (!rootNode.dataSource) {
    return <div>No DataSource</div>
  }

  if (!rootNode.dataSource.entitySchema) {
    return <div>No EntitySchema</div>
  }

  const node: ObjectGraphNode = nodes[nodes.length - 1]

  function enterRelation(rel: RelationSchema, r: any) {
    setCurrentRecord(r)
    if (r) {
      setCurrentMode('details')
      setCurrentRelation(null)
    } else {
      setCurrentMode('list')
    }
    setCurrentRelation(null)
    const ds: IDataSource | null = dataSourceManager.tryGetDataSource(rel.foreignEntityName)
    if (!ds) {
      console.error(`No dataSource ${rel.foreignEntityName}`)
      return
    }
    setCurrentNodes((n) => {
      n.push({
        dataSource: ds,
        parent: { ...node, record: currentRecord },
        record: r,
      })
      return [...n]
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
    const newRecord: any = node.dataSource.entityFactoryMethod()
    if (node.parent) {
      setParentId(
        newRecord,
        dataSourceManager.getSchemaRoot(),
        node.parent.dataSource.entitySchema!,
        node.dataSource.entitySchema!,
        node.parent.record,
      )
    }
    setCurrentRecord(newRecord)
    setCurrentMode('details')
    // return dataSource.entityUpdateMethod(dataSource.entityFactoryMethod()).then((newEntry: any) => {
    //   console.log('new Record', newEntry)
    // })
  }

  return (
    <div className='w-full h-full flex overflow-hidden'>
      <aside
        style={{ minWidth: '72px' }}
        className='flex flex-col justify-start bg-backgroundthree 
          dark:bg-backgroundthreedark w-72 p-2'
      >
        <StructureNavigation
          schemaRoot={dataSourceManager.getSchemaRoot()}
          currentRecord={currentRecord}
          entitySchema={node.dataSource.entitySchema!}
          onRelationSelected={(rel: RelationSchema) => setCurrentRelation(rel)}
          onRelationEnter={(rel: RelationSchema) => enterRelation(rel, null)}
          setMode={(mode: 'list' | 'details') => setCurrentMode(mode)}
          mode={currentMode}
          relation={currentRelation}
          className='w-full h-1/2 '
          dirty={dirty}
        ></StructureNavigation>
        <div className='w-full h-1/2 max-w-full'>
          {currentRelation && currentRecord && (
            <PreviewTable
              dataSource={dataSourceManager.tryGetDataSource(currentRelation.foreignEntityName)!}
              onRecordEnter={(r: any) => {
                enterRelation(currentRelation, r)
              }}
              onSelectedRecordsChange={(sr: any[]) => {
                console.log('sr', sr)
              }}
              parentSchema={node.dataSource.entitySchema!}
              schemaRoot={dataSourceManager.getSchemaRoot()}
              parent={currentRecord}
            ></PreviewTable>
          )}
        </div>

        {/* {!currentRelation && <div className='h-full w-64 pr-1 mt-1'></div>} */}
      </aside>
      <div className='h-full w-full flex flex-col min-w-0'>
        <header className='flex flex-col bg-backgroundthree dark:bg-backgroundthreedark'>
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
              dataSource={node.dataSource}
              onRecordEnter={(r: any) => {
                console.log('record enter', r)
              }}
              onSelectedRecordsChange={(selectedRecords) => onSelectedRecordsChange(selectedRecords)}
              selectedRecord={currentRecord}
              onCreateRecord={createRecord}
              parentSchema={node.parent?.dataSource?.entitySchema}
              schemaRoot={dataSourceManager.getSchemaRoot()}
              entitySchema={node.dataSource.entitySchema!}
              parent={node.parent?.record}
            ></EntityTable>
          )}
          {currentMode == 'details' && (
            <EntityForm
              dataSourceManager={dataSourceManager}
              dataSource={node.dataSource}
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
    </div>
  )
}

export default Guifad1
