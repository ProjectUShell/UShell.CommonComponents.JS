import React, { useEffect, useState } from 'react'
import { ObjectGraphNode } from '../ObjectGraphNode'
import Breadcrumb from '../_Organisms/Breadcrumb'
import { IDataSource } from 'ushell-modulebase'
import StructureNavigation from '../_Organisms/StructureNavigation'
import { EntitySchema, RelationSchema, SchemaRoot } from 'fusefx-modeldescription'
import PreviewList from '../_Organisms/PreviewTable'
import EntityTable from '../_Organisms/EntityTable'
import EntityForm from '../_Organisms/EntityForm'
import PreviewTable from '../_Organisms/PreviewTable'

const Guifad1: React.FC<{
  rootNode: ObjectGraphNode
  getDataSource: (entityName: string) => IDataSource
  schemaRoot: SchemaRoot
}> = ({ rootNode, getDataSource, schemaRoot }) => {
  const [nodes, setCurrentNodes] = useState([rootNode])
  const [dataSource, setDataSource] = useState<IDataSource>(nodes[nodes.length - 1].dataSource)
  const [currentRecord, setCurrentRecord] = useState<any | null>(null)
  const [currentRelation, setCurrentRelation] = useState<RelationSchema | null>(null)
  const [currentMode, setCurrentMode] = useState<'list' | 'details'>('list')

  if (!rootNode.dataSource) {
    return <div>No DataSource</div>
  }

  if (!rootNode.dataSource.entitySchema) {
    return <div>No EntitySchema</div>
  }

  function getCurrentNode(): ObjectGraphNode {
    return nodes[nodes.length - 1]
  }

  function enterRelation(rel: RelationSchema) {
    setCurrentNodes((n) => {
      n.push({
        dataSource: getDataSource(rel.foreignEntityName),
        parent: { ...getCurrentNode(), record: currentRecord },
        record: null,
      })
      return [...n]
    })
  }

  function onSelectedRecordsChange(selectedRecords: any[]) {
    if (selectedRecords.length == 1) {
      setCurrentRecord(selectedRecords[0])
    } else {
      setCurrentRecord(null)
    }
  }

  function createRecord(): void {
    const newRecord: any = dataSource.entityFactoryMethod()
    setCurrentRecord(newRecord)
    setCurrentMode('details')
    // return dataSource.entityUpdateMethod(dataSource.entityFactoryMethod()).then((newEntry: any) => {
    //   console.log('new Record', newEntry)
    // })
  }

  return (
    <div className='w-full h-full flex overflow-hidden border-4 border-black'>
      <div className='h-full w-full flex flex-col min-w-0 border-4 border-red-600'>
        <header className='flex flex-col'>
          <Breadcrumb
            nodes={nodes}
            onNodeClick={(n: ObjectGraphNode[]) => {
              console.log('new nodes', n)
              setCurrentNodes(n)
              setCurrentRecord(n[n.length - 1].record)
              const newMode = n[n.length - 1].record ? 'details' : 'list'
              setCurrentMode(newMode)
            }}
          ></Breadcrumb>
        </header>

        <div className='p-2 h-full overflow-auto border-4 border-yellow-400'>
          {currentMode == 'list' && (
            <EntityTable
              dataSource={nodes[nodes.length - 1].dataSource}
              onRecordEnter={(r: any) => {
                console.log('record enter', r)
              }}
              onSelectedRecordsChange={(selectedRecords) => onSelectedRecordsChange(selectedRecords)}
              selectedRecord={currentRecord}
              onCreateRecord={createRecord}
            ></EntityTable>
          )}
          {currentMode == 'details' && (
            <EntityForm dataSource={nodes[nodes.length - 1].dataSource} entity={currentRecord}></EntityForm>
          )}
        </div>
      </div>
      <aside className='flex flex-col justify-start bg-backgroundfour dark:bg-backgroundfourdark w-80 p-2'>
        <StructureNavigation
          schemaRoot={schemaRoot}
          currentRecord={currentRecord}
          entitySchema={nodes[nodes.length - 1].dataSource.entitySchema!}
          onRelationSelected={(rel: RelationSchema) => setCurrentRelation(rel)}
          onRelationEnter={(rel: RelationSchema) => enterRelation(rel)}
          onModeSelected={(mode: 'list' | 'details') => setCurrentMode(mode)}
          mode={currentMode}
          relation={currentRelation}
          className='h-1/2  '
        ></StructureNavigation>
        {currentRelation && currentRecord && (
          <PreviewTable
            dataSource={getDataSource(currentRelation.foreignEntityName)}
            onRecordEnter={(r: any) => {
              // console.log('r', r)
            }}
            onSelectedRecordsChange={(sr: any[]) => {
              // console.log('sr', sr)
            }}
          ></PreviewTable>
        )}
      </aside>
    </div>
  )
}

export default Guifad1
