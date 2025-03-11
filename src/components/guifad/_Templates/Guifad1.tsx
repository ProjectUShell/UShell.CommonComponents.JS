import React, { useEffect, useMemo, useState } from 'react'
import { ObjectGraphNode } from '../ObjectGraphNode'
import Breadcrumb from '../_Organisms/Breadcrumb'
import { IDataSource, IDataSourceManagerBase, IWidgetHost } from 'ushell-modulebase'
import StructureNavigation from '../_Organisms/StructureNavigation'
import { EntitySchema, RelationSchema } from 'fusefx-modeldescription'
import EntityTable from '../_Organisms/EntityTable'
import EntityForm from '../_Organisms/EntityForm'
import { setParentId } from '../../../data/DataSourceService'
import PreviewTable from '../_Organisms/PreviewTable'
import ErrorPage from '../../../_Molecules/ErrorScreen'
import { LayoutDescriptionRoot } from '../../../[Move2LayoutDescription]/LayoutDescriptionRoot'
import { IDataSourceManagerWidget } from './IDataSourceManagerWidget'
import StructureNavigation2000 from '../_Organisms/StructureNavigation2000'
import { Logger } from '../../../[Move2Logging]/Logger'

const Guifad1: React.FC<{
  rootNode: ObjectGraphNode
  dataSourceManager: IDataSourceManagerWidget
  layoutDescription: LayoutDescriptionRoot
  enterRecord?: (r: any, entitySchema: EntitySchema) => void
  uow: any
  persistUow: ((uow: any) => void) | undefined
  formStyleType?: number
  labelPosition?: 'top' | 'left'
  classNameContent?: string
  classNameAside?: string
  classNameAsideBorder?: string
  pageSizes?: number[]
}> = ({
  rootNode,
  dataSourceManager,
  layoutDescription,
  enterRecord,
  uow,
  persistUow,
  formStyleType = 0,
  labelPosition = 'top',
  classNameContent = 'bg-content dark:bg-contentDark',
  classNameAside = 'bg-navigation dark:bg-navigationDark',
  classNameAsideBorder = 'border-navigationBorder dark:border-navigationBorderDark',
  pageSizes = [10, 20, 50],
}) => {
  // states
  const [nodes, setCurrentNodes] = useState<ObjectGraphNode[]>([rootNode])
  const [currentRecord, setCurrentRecord] = useState<any | null>(null)
  const [currentRelation, setCurrentRelation] = useState<RelationSchema | null>(null)
  const [currentMode, setCurrentMode] = useState<'list' | 'details'>('list')
  const [isCreation, setIsCreation] = useState(false)
  const [dirty, setDirty] = useState(false)

  // useEffects
  useEffect(() => {
    if (!uow) uow = {}
    uow.nodes?.forEach((n: ObjectGraphNode) => {
      n.dataSource =
        dataSourceManager.tryGetDataSource(n.dataSource.entitySchema!.name) || n.dataSource
    })
    setCurrentNodes(uow.nodes || [rootNode])
    setCurrentRecord(uow.currentRecord || rootNode.record)
    setCurrentRelation(null)
    setCurrentMode(uow.currentMode ? uow.currentMode : rootNode.record ? 'details' : 'list')
    setDirty(uow.dirty ? uow.dirty : false)
  }, [rootNode])

  useEffect(() => {
    if (!persistUow) return
    if (!uow) uow = {}
    uow.nodes = nodes
    uow.currentRecord = currentRecord
    uow.currentMode = currentMode
    uow.dirty = dirty
    persistUow(uow)
  }, [nodes, currentRecord, currentMode, dirty])

  // guards
  if (!rootNode.dataSource) {
    return <ErrorPage messages={['No DataSource']}></ErrorPage>
  }

  if (!rootNode.dataSource.entitySchema) {
    return <ErrorPage messages={['No EntitySchema']}></ErrorPage>
  }

  const node: ObjectGraphNode = nodes[nodes.length - 1]

  function enterRelation(rel: RelationSchema, relatedEntityRef: any) {
    const ds: IDataSource | null = dataSourceManager.tryGetDataSource(rel.foreignEntityName)
    if (!ds) {
      console.error(`No dataSource ${rel.foreignEntityName}`)
      return
    }

    if (relatedEntityRef) {
      setCurrentMode('details')
      setCurrentRelation(null)
    } else {
      setCurrentMode('list')
    }
    setCurrentRelation(null)

    setCurrentNodes((n) => {
      n.push({
        dataSource: ds,
        parent: { ...node, record: currentRecord },
        record: relatedEntityRef,
      })
      return [...n]
    })
    if (relatedEntityRef) {
      ds.getRecord(relatedEntityRef.key).then((r) => {
        console.log('relatedEntityRef', r)
        setCurrentRecord(r)
      })
    } else {
      setCurrentRecord(null)
    }
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
    setIsCreation(true)
    setDirty(true)
  }

  return (
    <div
      className='UShell_Guifad w-full h-full flex flex-col overflow-hidden text-sm 
        border-0 border-gray-400'
    >
      <header className='flex flex-col bg-breadcrumb dark:bg-breadcrumbDark border-b border-breadcrumbBorder dark:border-breadcrumbBorderDark border-l-0'>
        <Breadcrumb
          schemaRoot={dataSourceManager.getSchemaRoot()}
          nodes={nodes}
          onNodeClick={(n: ObjectGraphNode[], r: any) => {
            console.log('onNodeClick', n, r)
            setCurrentRecord(r)
            setCurrentNodes(n)
            const newMode = r ? 'details' : 'list'
            const currentNode: ObjectGraphNode = n[n.length - 1]
            if (currentNode.record && !currentNode.parent) {
              // setCurrentRecord(currentNode.record)
              // setCurrentMode('details')
            }
            // setCurrentMode(newMode)
          }}
          dirty={dirty}
        ></Breadcrumb>
      </header>
      <div
        className={`UShell_Guifad_Inner w-full h-full flex overflow-hidden text-sm
       ${classNameContent} border-0 border-blue-400`}
      >
        <aside
          style={{ minWidth: '72px' }}
          className={`UShell_Guifad_Aside flex flex-col justify-between
             ${classNameAside} w-72 py-0`}
        >
          <div className='border-b border-r h-full border-navigationBorder dark:border-navigationBorderDark'>
            {/* <div className={`p-2 m-0 pl-3 pb-3 border-b-0 border-r ${classNameAsideBorder}`}>
              Structure
            </div> */}
            <StructureNavigation2000
              schemaRoot={dataSourceManager.getSchemaRoot()}
              currentRecord={currentRecord}
              hideList={node.record && !node.parent}
              entitySchema={node.dataSource.entitySchema!}
              onRelationSelected={(rel: RelationSchema) => setCurrentRelation(rel)}
              onRelationEnter={(rel: RelationSchema) => enterRelation(rel, null)}
              setMode={(mode: 'list' | 'details') => setCurrentMode(mode)}
              mode={currentMode}
              currentRelation={currentRelation}
              className='w-full h-1/2123 '
              dirty={dirty}
              entityLayout={layoutDescription.entityLayouts.find(
                (el) => el.entityName == node.dataSource.entitySchema?.name,
              )}
              classNameBorder={classNameAsideBorder}
            ></StructureNavigation2000>
          </div>
          <div className='w-full h-full max-w-full border-t-0 border-navigationBorder dark:border-navigationBorderDark border-r mt-0'>
            {currentRelation && currentRecord && (
              <>
                <div
                  className='p-2 m-0 pl-3 pb-3 border-b-0 font-bold
                 border-b-bg7 border-r-0 border-hairlineNavigation dark:border-hairlineNavigationDark'
                >
                  Preview Table
                </div>
                <PreviewTable
                  dataSource={
                    dataSourceManager.tryGetDataSource(currentRelation.foreignEntityName)!
                  }
                  onRecordEnter={(r: any) => {
                    enterRelation(currentRelation, r)
                  }}
                  onSelectedRecordsChange={(sr: any[]) => {}}
                  parentSchema={node.dataSource.entitySchema!}
                  schemaRoot={dataSourceManager.getSchemaRoot()}
                  parent={currentRecord}
                ></PreviewTable>
              </>
            )}
          </div>
          {/* {!currentRelation && <div className='h-full w-64 pr-1 mt-1'></div>} */}
        </aside>
        <div className='h-full w-full flex flex-col min-w-0'>
          {/* <header className='flex flex-col bg-breadcrumb dark:bg-breadcrumbDark border-b border-breadcrumbBorder dark:border-breadcrumbBorderDark border-l-0'>
            <Breadcrumb
              schemaRoot={dataSourceManager.getSchemaRoot()}
              nodes={nodes}
              onNodeClick={(n: ObjectGraphNode[], r: any) => {
                setCurrentRecord(r)
                setCurrentNodes(n)
                const newMode = r ? 'details' : 'list'
                const currentNode: ObjectGraphNode = n[n.length - 1]
                if (currentNode.record && !currentNode.parent) {
                  setCurrentRecord(currentNode.record)
                  setCurrentMode('details')
                }
                // setCurrentMode(newMode)
              }}
              dirty={dirty}
            ></Breadcrumb>
          </header> */}
          <div className='p-0 h-full overflow-auto'>
            {currentMode == 'list' && (
              <EntityTable
                dataSourceManagerForNavigations={dataSourceManager}
                dataSource={node.dataSource}
                onRecordEnter={(r: any) => {
                  enterRecord
                    ? enterRecord(r, node.dataSource.entitySchema!)
                    : console.log('record enter', r)
                }}
                onSelectedRecordsChange={(selectedRecords) =>
                  onSelectedRecordsChange(selectedRecords)
                }
                selectedRecord={currentRecord}
                onCreateRecord={createRecord}
                parentSchema={node.parent?.dataSource?.entitySchema}
                // schemaRoot={dataSourceManager.getSchemaRoot()}
                entitySchema={node.dataSource.entitySchema!}
                parent={node.parent?.record}
                layoutDescription={layoutDescription}
                formStyleType={formStyleType}
                formLabelPosition={labelPosition}
                className='px-2 pb-1'
                pageSizes={pageSizes}
              ></EntityTable>
            )}
            {currentMode == 'details' && (
              <EntityForm
                dataSourceManager={dataSourceManager}
                dataSource={node.dataSource}
                entity={currentRecord}
                dirty={dirty}
                setDirty={(d) => {
                  if (!d && isCreation) {
                    setCurrentRecord(null)
                    setCurrentMode('list')
                    setIsCreation(false)
                  }
                  setDirty(d)
                }}
                onSaved={(updatedEntity: any) => {
                  setCurrentRecord(updatedEntity)
                  setDirty(false)
                  setIsCreation(false)
                }}
                entityLayout={layoutDescription.entityLayouts.find(
                  (el) => el.entityName == node.dataSource.entitySchema?.name,
                )}
                styleType={formStyleType}
                uow={uow}
                persistUow={persistUow}
                isCreation={isCreation}
                labelPosition={labelPosition}
                classNameDropdownBg='bg-editor dark:bg-editorDark'
              ></EntityForm>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Guifad1
