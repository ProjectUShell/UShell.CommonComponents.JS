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
import TabControl from '../../../_Organisms/TabControl'
import SidePanelTabControl from '../_Organisms/SidePanelTabControl'
import ArrowUturnLeftIcon from '../../../_Icons/ArrowUturnLeftIcon'
import { EntitySchemaService } from '../../../data/EntitySchemaService'
import Tooltip from '../../../_Atoms/Tooltip'
import PencilIcon from '../../../_Icons/PencilIcon'
import SidePanelSecondary from '../_Organisms/SidePanelSecondary'
import MultiPanelLayout from '../../../_Organisms/MultiPanelLayout'
import EntityStructureControl from '../_Organisms/EntityStructureControl'
import StructureIcon from '../../../_Icons/StructureIcon'
import ListIcon from '../../../_Icons/ListIcon'

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
  const [sidepanelMode, setSidepanelMode] = useState<'tab' | 'split'>('tab')

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
  console.log('currentRecord', currentRecord)
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
        border-0 border-green-400 bg-navigation dark:bg-navigationDark`}
      >
        <MultiPanelLayout
          leftCollapsable={sidepanelMode == 'split'}
          rightCollapsable={true}
          leftCollapsedMode='smallTabs'
          rightCollapsedMode='smallTabs'
          mainContent={
            <div
              className={`h-full w-full flex flex-col min-w-0 border-0 border-blue-400 ${classNameContent}`}
            >
              <div className='p-0 h-full overflow-auto'>
                {currentMode == 'list' && (
                  <EntityTable
                    dataSourceManagerForNavigations={dataSourceManager}
                    dataSource={node.dataSource}
                    onRecordEnter={(r: any) => {
                      if (enterRecord) {
                        enterRecord(r, node.dataSource.entitySchema!)
                      } else {
                        setCurrentRecord(r)
                        setCurrentMode('details')
                      }
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
                    toolbarItems={
                      currentRecord && (
                        <button
                          className='rounded-md p-2 text-blue-600 dark:text-blue-600 hover:bg-toolbarHover dark:hover:bg-toolbarHoverDark'
                          onClick={() => setCurrentMode('details')}
                        >
                          <PencilIcon></PencilIcon>
                        </button>
                      )
                    }
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
                    toolbarItems={
                      <>
                        <div className='flex gap-2 mr-6 items-center'>
                          <button
                            id='UShell_Guifad1_Toolbar_Back'
                            className='hover:bg-toolbarHover dark:hover:bg-toolbarHoverDark p-2 px-2 rounded-md'
                            onClick={() => setCurrentMode('list')}
                          >
                            <ArrowUturnLeftIcon></ArrowUturnLeftIcon>
                          </button>
                          <div>
                            {EntitySchemaService.getLabel(
                              dataSourceManager.getSchemaRoot(),
                              node.dataSource.entitySchema!.name,
                              currentRecord,
                            )}
                          </div>
                        </div>
                        <Tooltip targetId='UShell_Guifad1_Toolbar_Back'>
                          <div className='m-4'>back to list...</div>
                        </Tooltip>
                      </>
                    }
                  ></EntityForm>
                )}
              </div>
            </div>
          }
          initialLeftPanelContent={[
            {
              title: 'Structure',
              content: (
                <aside
                  // style={{ minWidth: '300px', maxWidth: '500px', width: '20%' }}
                  className={`UShell_Guifad_Aside overflow-hidden h-full w-full flex flex-col justify-between border-0
                   border-navigationBorder dark:border-navigationBorderDark
                    ${classNameAside}  py-0`}
                >
                  <div className='flex flex-col h-full border-0 border-navigationBorder dark:border-navigationBorderDark'>
                    <EntityStructureControl
                      dataSourceManager={dataSourceManager}
                      currentRecord={currentRecord}
                      dataSource={node.dataSource}
                      enterRelation={enterRelation}
                      dirty={dirty}
                      layoutDescription={layoutDescription}
                      classNameAsideBorder={classNameAsideBorder}
                    ></EntityStructureControl>
                  </div>
                </aside>
              ),
              icon: <StructureIcon size={1.3} strokeWidth={2}></StructureIcon>,
            },
          ]}
          initialRightPanelContent={[
            {
              title: 'Stack',
              content: <div>Stack</div>,
              icon: <ListIcon size={1.3} strokeWidth={2}></ListIcon>,
            },
          ]}
        ></MultiPanelLayout>
      </div>
    </div>
  )
}

export default Guifad1
