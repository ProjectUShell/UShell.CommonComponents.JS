import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { IDataSource, IDataSourceManagerBase } from 'ushell-modulebase'
import Table, { TableColumn } from './Table'
import PlusCircleIcon from '../../../_Icons/PlusCircleIcon'
import TrashIcon from '../../../_Icons/TrashIcon'
import {
  QueryClient,
  QueryClientContext,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { EntitySchema, SchemaRoot, RelationSchema } from 'fusefx-modeldescription'
import { LogicalExpression, PagingParams, SortingField } from 'fusefx-repositorycontract'
import { getParentFilter } from '../../../data/DataSourceService'
import FunnelIcon from '../../../_Icons/FunnelIcon'
import Modal from '../../../_Atoms/Modal'
import Dropdown from '../../../_Atoms/Dropdown'
import DropdownButton from '../../../_Atoms/DropdownButton'
import LogicalExpressionEditor from '../_Molecules/LogicalExpressionEditor'
import FilterTagBar from '../_Molecules/FilterTagBar'
import { EntitySchemaService } from '../../../data/EntitySchemaService'
import ArrowUturnUpd from '../../../_Icons/ArrowUturnUpd'
import Tooltip from '../../../_Atoms/Tooltip'
import ErrorPage from '../../../_Molecules/ErrorScreen'
import LoadingScreen from '../../../_Molecules/LoadingScreen'
import { filter } from 'rxjs'
import SearchBar from '../../../_Molecules/SearchBar'
import AdjustmentsHorizontalIcon from '../../../_Icons/AdjustmentsHorizontalIcon'
import BookmarkSquareIcon from '../../../_Icons/BookmarkSquareIcon'
import QueryLibrary from './QueryLibrary'
import { IDataSourceManagerWidget } from '../_Templates/IDataSourceManagerWidget'
import EntityFormModal from './EntityFormModal'
import { LayoutDescriptionRoot } from '../../../[Move2LayoutDescription]/LayoutDescriptionRoot'
import { EntityLayout } from '../../../[Move2LayoutDescription]/EntityLayout'
import { FieldLayout } from '../../../[Move2LayoutDescription]/FieldLayout'

const EntityTable: React.FC<{
  dataSourceManagerForNavigations?: IDataSourceManagerWidget
  dataSource: IDataSource
  parentSchema?: EntitySchema | undefined
  parent?: any
  layoutDescription?: LayoutDescriptionRoot
  entitySchema: EntitySchema
  className?: string
  onRecordEnter?: (r: any) => void
  onSelectedRecordsChange?: (selectedRecords: any[]) => void
  selectedRecord?: any | null
  onCreateRecord?: () => void
  classNameBgToolbar?: string
}> = ({
  dataSourceManagerForNavigations: dataSourceManager,
  dataSource,
  // schemaRoot,
  entitySchema,
  parentSchema,
  parent,
  className,
  onRecordEnter,
  onSelectedRecordsChange,
  selectedRecord,
  onCreateRecord,
  layoutDescription,
  classNameBgToolbar,
}) => {
  console.log('get queryClient')
  const qcc: any = QueryClientContext
  console.log('QueryClientContext', qcc._currentValue)
  if (!qcc._currentValue)
    return (
      <QueryClientProvider client={new QueryClient()}>
        <EntityTableInternal
          dataSourceManagerForNavigations={dataSourceManager}
          dataSource={dataSource}
          // schemaRoot={dataSourceManager.getSchemaRoot()}
          entitySchema={entitySchema}
          parentSchema={parentSchema}
          parent={parent}
          className={className}
          onRecordEnter={onRecordEnter}
          onSelectedRecordsChange={onSelectedRecordsChange}
          selectedRecord={selectedRecord}
          onCreateRecord={onCreateRecord}
          layoutDescription={layoutDescription}
          classNameBgToolbar={classNameBgToolbar}
        ></EntityTableInternal>
      </QueryClientProvider>
    )
  return (
    <EntityTableInternal
      dataSourceManagerForNavigations={dataSourceManager}
      dataSource={dataSource}
      // schemaRoot={dataSourceManager.getSchemaRoot()}
      entitySchema={entitySchema}
      parentSchema={parentSchema}
      parent={parent}
      className={className}
      onRecordEnter={onRecordEnter}
      onSelectedRecordsChange={onSelectedRecordsChange}
      selectedRecord={selectedRecord}
      onCreateRecord={onCreateRecord}
    ></EntityTableInternal>
  )
}
const EntityTableInternal: React.FC<{
  dataSourceManagerForNavigations?: IDataSourceManagerWidget
  dataSource: IDataSource
  parentSchema?: EntitySchema | undefined
  parent?: any
  layoutDescription?: LayoutDescriptionRoot
  // schemaRoot: SchemaRoot
  entitySchema: EntitySchema
  className?: string
  onRecordEnter?: (r: any) => void
  onSelectedRecordsChange?: (selectedRecords: any[]) => void
  selectedRecord?: any | null
  onCreateRecord?: () => void
  classNameBgToolbar?: string
}> = ({
  dataSourceManagerForNavigations,
  dataSource,
  // schemaRoot,
  entitySchema,
  parentSchema,
  parent,
  className,
  onRecordEnter,
  onSelectedRecordsChange,
  selectedRecord,
  onCreateRecord,
  layoutDescription,
  classNameBgToolbar,
}) => {
  // const [records, setRecords] = useState<any[]>([])
  const [selectedRecords, setSelectedRecords] = useState<any[]>([])
  // const [columns, setColumns] = useState<TableColumn[]>([])
  const [pagingParams, setPagingParams] = useState<PagingParams>({ pageNumber: 1, pageSize: 10 })
  const [sortingParamsByEntityName, setSortingParamsByEntityName] = useState<{
    [entityName: string]: SortingField[]
  }>({})
  const [filterByEntityName, setFilterByEntityName] = useState<{
    [entityName: string]: LogicalExpression[]
  }>(loadFilter())
  const [useParentFilter, setUseParentFilter] = useState(true)
  const [reloadTrigger, setReloadTrigger] = useState(0)

  const [universalSearchText, setUniversalSearchText] = useState('')
  const [filterTagsVisible, setFilterTagsVisible] = useState(true)
  const [detailsVisible, setDetailsVisible] = useState(false)

  function forceReload() {
    setReloadTrigger((r) => r + 1)
  }

  function loadFilter(): {
    [entityName: string]: LogicalExpression[]
  } {
    const filterJson: string | null = localStorage.getItem('filterByEntityName')
    if (!filterJson) return {}
    const result: {
      [entityName: string]: LogicalExpression[]
    } = JSON.parse(filterJson)
    return result
  }

  useEffect(() => {
    setSelectedRecords([selectedRecord])
  }, [selectedRecord])

  useEffect(() => {
    if (universalSearchText == '') return
    const searchExpression: LogicalExpression | null =
      EntitySchemaService.getUniversalSearchExpression(
        dataSource.entitySchema!,
        universalSearchText,
      )
    if (!searchExpression) return
    setFilterByEntityName((ofi: { [entityName: string]: LogicalExpression[] }) => {
      const newF: any = { ...ofi }
      if (newF[entitySchema.name]) {
        newF[entitySchema.name] = [...newF[entitySchema.name], searchExpression]
      } else {
        newF[entitySchema.name] = [searchExpression]
      }
      return newF
    })
  }, [universalSearchText, entitySchema.name])

  useEffect(() => {
    localStorage.setItem('filterByEntityName', JSON.stringify(filterByEntityName))
  }, [filterByEntityName])

  const columns: TableColumn[] = useMemo(() => {
    const newColumns: TableColumn[] = dataSource.entitySchema!.fields.map((f) => {
      const foreignKeyRelations: RelationSchema[] = dataSourceManagerForNavigations
        ? EntitySchemaService.getRelationsByFilter(
            dataSourceManagerForNavigations.getSchemaRoot(),
            (r) => r.foreignEntityName == entitySchema.name && r.foreignKeyIndexName == f.name,
          )
        : []

      if (dataSourceManagerForNavigations && foreignKeyRelations.length > 0) {
        const fkRelation: RelationSchema = foreignKeyRelations[0]
        if (fkRelation.foreignNavigationName && fkRelation.foreignNavigationName != '') {
          return {
            label: fkRelation.foreignNavigationName,
            fieldName: fkRelation.foreignNavigationName,
            fieldType: f.type,
            key: fkRelation.foreignNavigationName,
            onRenderCell: (cellValue) => {
              return (
                <div>
                  {EntitySchemaService.getLabel(
                    dataSourceManagerForNavigations.getSchemaRoot(),
                    fkRelation.primaryEntityName,
                    cellValue,
                  )}
                </div>
              )
            },
          }
        }
      }
      const entityLayout: EntityLayout | undefined = layoutDescription?.entityLayouts.find(
        (el) => el.entityName == entitySchema.name,
      )
      const fieldLayout: FieldLayout | undefined = entityLayout?.fieldLayouts.find(
        (fl) => fl.fieldName.toLocaleLowerCase() == f.name.toLocaleLowerCase(),
      )
      console.log('fieldLayout', fieldLayout)
      return {
        label: fieldLayout ? fieldLayout.displayLabel : f.name,
        fieldName: f.name,
        fieldType: f.type,
        key: f.name,
        sortable: true,
      }
    })
    return newColumns
    // setColumns(newColumns)
    // dataSource.getRecords().then((r) => {
    //   setRecords(r)
    // })
  }, [dataSource, dataSourceManagerForNavigations, entitySchema])

  const getId = useCallback(
    (e: any) => EntitySchemaService.getPrimaryKey(entitySchema, e),
    [entitySchema],
  )

  function applyQuery(queries: LogicalExpression[]) {
    const newF: any = { ...filterByEntityName }
    newF[entitySchema.name] = queries
    setFilterByEntityName(newF)
  }

  function buildFilterExpression(): LogicalExpression | undefined {
    const result: LogicalExpression = new LogicalExpression()
    const filters: LogicalExpression[] = filterByEntityName[entitySchema.name] || []
    filters.forEach((f) => result.subTree.push(f))
    if (useParentFilter && dataSourceManagerForNavigations) {
      const parentFilter: LogicalExpression | null =
        parentSchema && parent
          ? getParentFilter(
              dataSourceManagerForNavigations.getSchemaRoot(),
              parentSchema,
              dataSource.entitySchema!,
              parent,
            )
          : null
      if (parentFilter) {
        result.subTree.push(parentFilter)
      }
    }
    return result
  }

  const { isLoading, error, data } = useQuery({
    queryKey: [
      dataSource.entitySchema!.name,
      pagingParams,
      sortingParamsByEntityName,
      reloadTrigger,
      filterByEntityName,
      parent,
      parentSchema,
      dataSourceManagerForNavigations,
      useParentFilter,
    ],
    queryFn: () => {
      try {
        return dataSource.getRecords(
          buildFilterExpression(),
          pagingParams,
          sortingParamsByEntityName[entitySchema.name],
        )
      } catch (error) {
        return null
      }
    },
  })

  const data1: any = data

  if (error) return <ErrorPage messages={['An error has occurred', error.toString()]}></ErrorPage>
  function addRecord() {
    if (!onCreateRecord) {
      setDetailsVisible(true)
      return
    }
    onCreateRecord()
  }

  function deleteRecords() {
    if (selectedRecords.length == 0) {
      return
    }
    dataSource.entityDeleteMethod(selectedRecords).then((r) => {
      setSelectedRecords([])
      onSelectedRecordsChange && onSelectedRecordsChange([])
      forceReload()
    })
  }

  return (
    <>
      <div className='UShell_EntityTable flex flex-col h-full'>
        <div
          className={`UShell_EntityTable_Toolbar 
            ${classNameBgToolbar || 'bg-toolbar dark:bg-toolbarDark'}
            border-toolbarBorder dark:border-toolbarBorderDark 
            rounded-sm border flex justify-between items-center my-1`}
        >
          <div className={`flex justify-end p-1 ${className} rounded-md`}>
            <button
              className='rounded-md p-1 text-green-600 dark:text-green-400 hover:bg-toolbarHover dark:hover:bg-toolbarHoverDark'
              onClick={(e) => addRecord()}
            >
              <PlusCircleIcon></PlusCircleIcon>
            </button>
            <button
              className='rounded-md p-1 text-red-600 dark:text-red-400 hover:bg-toolbarHover dark:hover:bg-toolbarHoverDark'
              onClick={(e) => deleteRecords()}
            >
              <TrashIcon></TrashIcon>
            </button>
          </div>
          <div className={`flex p-1 ${className} rounded-md `}>
            <div className='p-0'>
              <SearchBar
                onSearch={(searchText: string) => {
                  setUniversalSearchText(searchText)
                }}
              ></SearchBar>
            </div>

            <button
              className={`hover:bg-toolbarHover dark:hover:bg-toolbarHoverDark p-1 rounded-md ${
                filterByEntityName[dataSource.entitySchema!.name]?.length > 0
                  ? 'text-green-600'
                  : ''
              }`}
              onClick={() => setFilterTagsVisible((x) => !x)}
            >
              <div id='ShowFilterTagsButton'>
                <AdjustmentsHorizontalIcon size={5}></AdjustmentsHorizontalIcon>
              </div>
              <Tooltip targetId='ShowFilterTagsButton'>
                <div className='bg-bg1 dark:bg-bg1dark text-textone dark:text-textonedark w-20'>
                  {filterTagsVisible ? 'Hide Filters' : 'Show Filters'}
                </div>
              </Tooltip>
            </button>
            <button
              className={`hover:bg-toolbarHover dark:hover:bg-toolbarHoverDark p-1 rounded-md ${
                useParentFilter ? 'text-green-600' : ''
              }`}
              onClick={() => setUseParentFilter((x) => !x)}
            >
              <div id='ParentFilterButton'>
                <ArrowUturnUpd size={5} className=''></ArrowUturnUpd>
              </div>
              <Tooltip targetId='ParentFilterButton'>
                <div className=' bg-bg1 dark:bg-bg1dark text-textone dark:text-textonedark  w-40'>
                  {useParentFilter ? 'Disable Parent Filter' : 'Activate Parent Filter'}
                </div>
              </Tooltip>
            </button>
          </div>
        </div>
        <div>
          {filterTagsVisible && (
            <div className='FilterBar flex justify-between'>
              <FilterTagBar
                dataSourceManagerForNavigations={dataSourceManagerForNavigations}
                className='mb-1 rounded-md'
                filters={filterByEntityName[entitySchema.name] || []}
                fkRelations={
                  dataSourceManagerForNavigations
                    ? EntitySchemaService.getRelationsByFilter(
                        dataSourceManagerForNavigations.getSchemaRoot(),
                        (r) => r.foreignEntityName == dataSource.entitySchema!.name,
                      )
                    : []
                }
                fields={dataSource.entitySchema!.fields}
                onUpdateFilters={(uf) => {
                  setFilterByEntityName((ofi: { [entityName: string]: LogicalExpression[] }) => {
                    const newF: any = { ...ofi }
                    newF[entitySchema.name] = uf
                    return newF
                  })
                  // setFilter(uf)
                }}
              ></FilterTagBar>
              <div className='flex'>
                <DropdownButton
                  className=''
                  rightOffset={1}
                  topOffset={1}
                  buttonContent={
                    <FunnelIcon
                      size={6}
                      className='hover:bg-tableHover dark:hover:bg-tableHoverDark rounded-sm p-0.5'
                    ></FunnelIcon>
                  }
                  initialOpen={{ o: false }}
                >
                  <div className='border-2 dark:border-bg7dark'>
                    <LogicalExpressionEditor
                      classNameBg='bg-menu dark:bg-navigationDark'
                      // classNameBgDark='bg-red-200'
                      intialExpression={null}
                      fields={dataSource.entitySchema!.fields}
                      fkRelations={
                        dataSourceManagerForNavigations
                          ? EntitySchemaService.getRelationsByFilter(
                              dataSourceManagerForNavigations.getSchemaRoot(),
                              (r) => r.foreignEntityName == dataSource.entitySchema!.name,
                            )
                          : []
                      }
                      dataSourceManagerForNavigations={dataSourceManagerForNavigations}
                      onUpdateExpression={(e) => {
                        setFilterByEntityName(
                          (ofi: { [entityName: string]: LogicalExpression[] }) => {
                            const newF: any = { ...ofi }
                            if (newF[entitySchema.name]) {
                              newF[entitySchema.name] = [...newF[entitySchema.name], e]
                            } else {
                              newF[entitySchema.name] = [e]
                            }
                            return newF
                          },
                        )
                        // setFilter((f) => [...f, e])
                      }}
                    ></LogicalExpressionEditor>
                  </div>
                </DropdownButton>
                <QueryLibrary
                  expressions={filterByEntityName[dataSource.entitySchema!.name] || []}
                  entityName={dataSource.entitySchema!.name}
                  applySavedQuery={(q: LogicalExpression[]) => applyQuery(q)}
                ></QueryLibrary>
              </div>
            </div>
          )}
        </div>
        {!data ? (
          <LoadingScreen message={'loading ' + entitySchema.name}></LoadingScreen>
        ) : (
          <Table
            className='overflow-auto h-full'
            columns={columns}
            records={data1.page}
            getId={getId}
            onRecordEnter={onRecordEnter || ((sr) => setDetailsVisible(true))}
            onSelectedRecordsChange={(sr) => {
              onSelectedRecordsChange && onSelectedRecordsChange(sr)
              setSelectedRecords(sr)
            }}
            selectedRecord={selectedRecords.length > 1 ? null : selectedRecord}
            pagingParams={pagingParams}
            totalCount={data1!.total}
            onPagingParamsChange={(pp) => setPagingParams(pp)}
            initialSortingParams={sortingParamsByEntityName[entitySchema.name]}
            onSortingParamsChange={(sp) => {
              setSortingParamsByEntityName((o) => {
                const newSp: any = { ...o }
                newSp[entitySchema.name] = sp
                return newSp
              })
            }}
            rowHeight={1}
          ></Table>
        )}
      </div>
      {detailsVisible && (
        <EntityFormModal
          dataSource={dataSource}
          dataSourceManager={dataSourceManagerForNavigations}
          dirty={true}
          entity={
            selectedRecords.length == 1 ? selectedRecords[0] : dataSource.entityFactoryMethod()
          }
          onChange={() => {
            setDetailsVisible(false)
            forceReload()
          }}
          onCancel={() => setDetailsVisible(false)}
          entityLayout={layoutDescription?.entityLayouts.find(
            (el) => el.entityName == entitySchema.name,
          )}
        ></EntityFormModal>
      )}
    </>
  )
}

export default EntityTable
