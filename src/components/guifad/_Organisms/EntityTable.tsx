import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { IDataSource, IDataSourceManagerBase } from 'ushell-modulebase'
import Table, { TableColumn } from './Table'
import PlusCircleIcon from '../../../_Icons/PlusCircleIcon'
import TrashIcon from '../../../_Icons/TrashIcon'
import { useQuery } from '@tanstack/react-query'
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

const EntityTable: React.FC<{
  dataSourceManager: IDataSourceManagerBase
  dataSource: IDataSource
  parentSchema: EntitySchema | undefined
  parent: any | undefined
  schemaRoot: SchemaRoot
  entitySchema: EntitySchema
  className?: string
  onRecordEnter: (r: any) => void
  onSelectedRecordsChange: (selectedRecords: any[]) => void
  selectedRecord: any | null
  onCreateRecord: () => void
}> = ({
  dataSourceManager,
  dataSource,
  schemaRoot,
  entitySchema,
  parentSchema,
  parent,
  className,
  onRecordEnter,
  onSelectedRecordsChange,
  selectedRecord,
  onCreateRecord,
}) => {
  console.log('EntityTable dataSourceManager', dataSourceManager)
  // const [records, setRecords] = useState<any[]>([])
  const [selectedRecords, setSelectedRecords] = useState<any[]>([])
  // const [columns, setColumns] = useState<TableColumn[]>([])
  const [pagingParams, setPagingParams] = useState<PagingParams>({ pageNumber: 1, pageSize: 10 })
  const [sortingParamsByEntityName, setSortingParamsByEntityName] = useState<{ [entityName: string]: SortingField[] }>(
    {},
  )
  const [filterByEntityName, setFilterByEntityName] = useState<{ [entityName: string]: LogicalExpression[] }>({})
  const [useParentFilter, setUseParentFilter] = useState(true)
  const [reloadTrigger, setReloadTrigger] = useState(0)

  const [universalSearchText, setUniversalSearchText] = useState('')
  const [filterTagsVisible, setFilterTagsVisible] = useState(false)

  function forceReload() {
    setReloadTrigger((r) => r + 1)
  }

  useEffect(() => {
    setSelectedRecords([selectedRecord])
  }, [selectedRecord])

  useEffect(() => {
    if (universalSearchText == '') return
    const searchExpression: LogicalExpression | null = EntitySchemaService.getUniversalSearchExpression(
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

  const columns: TableColumn[] = useMemo(() => {
    const newColumns: TableColumn[] = dataSource.entitySchema!.fields.map((f) => {
      const foreignKeyRelations: RelationSchema[] = EntitySchemaService.getRelationsByFilter(
        schemaRoot,
        (r) => r.foreignEntityName == entitySchema.name && r.foreignKeyIndexName == f.name,
      )

      if (foreignKeyRelations.length > 0) {
        const fkRelation: RelationSchema = foreignKeyRelations[0]
        if (fkRelation.foreignNavigationName && fkRelation.foreignNavigationName != '') {
          return {
            label: fkRelation.foreignNavigationName,
            fieldName: fkRelation.foreignNavigationName,
            fieldType: f.type,
            key: fkRelation.foreignNavigationName,
            onRenderCell: (cellValue) => {
              return <div>{EntitySchemaService.getLabel(schemaRoot, fkRelation.primaryEntityName, cellValue)}</div>
            },
          }
        }
      }

      return { label: f.name, fieldName: f.name, fieldType: f.type, key: f.name, sortable: true }
    })
    return newColumns
    // setColumns(newColumns)
    // dataSource.getRecords().then((r) => {
    //   setRecords(r)
    // })
  }, [dataSource, schemaRoot, entitySchema])

  const getId = useCallback((e: any) => EntitySchemaService.getPrimaryKey(entitySchema, e), [entitySchema])

  function buildFilterExpression(): LogicalExpression | undefined {
    const result: LogicalExpression = new LogicalExpression()
    const filters: LogicalExpression[] = filterByEntityName[entitySchema.name] || []
    filters.forEach((f) => result.subTree.push(f))
    if (useParentFilter) {
      const parentFilter: LogicalExpression | null =
        parentSchema && parent && schemaRoot
          ? getParentFilter(schemaRoot, parentSchema, dataSource.entitySchema!, parent)
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
      schemaRoot,
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
    onCreateRecord()
  }

  function deleteRecords() {
    console.log('deleteRecords', selectedRecords)
    if (selectedRecords.length == 0) {
      return
    }
    dataSource.entityDeleteMethod(selectedRecords).then((r) => {
      setSelectedRecords([])
      onSelectedRecordsChange([])
      forceReload()
    })
  }

  return (
    <div className='flex flex-col h-full'>
      <div className='flex justify-between items-center'>
        <div className={`flex justify-end p-1 ${className} rounded-md bg-backgroundtwo dark:bg-backgroundtwodark `}>
          <button
            className='rounded-md p-1 text-green-600 dark:text-green-400 hover:bg-backgroundone dark:hover:bg-backgroundonedark'
            onClick={(e) => addRecord()}
          >
            <PlusCircleIcon></PlusCircleIcon>
          </button>
          <button
            className='rounded-md p-1 text-red-600 dark:text-red-400 hover:bg-backgroundone dark:hover:bg-backgroundonedark'
            onClick={(e) => deleteRecords()}
          >
            <TrashIcon></TrashIcon>
          </button>
        </div>
        <div className={`flex p-1 ${className} rounded-md bg-backgroundtwo dark:bg-backgroundtwodark `}>
          <div className='p-1'>
            <SearchBar
              onSearch={(searchText: string) => {
                setUniversalSearchText(searchText)
              }}
            ></SearchBar>
          </div>
          <DropdownButton
            className='p-1'
            rightOffset={1}
            topOffset={-1}
            buttonContent={<FunnelIcon size={5}></FunnelIcon>}
          >
            <LogicalExpressionEditor
              intialExpression={null}
              fields={dataSource.entitySchema!.fields}
              fkRelations={EntitySchemaService.getRelationsByFilter(
                schemaRoot,
                (r) => r.foreignEntityName == dataSource.entitySchema!.name,
              )}
              dataSourceManager={dataSourceManager}
              onUpdateExpression={(e) => {
                setFilterByEntityName((ofi: { [entityName: string]: LogicalExpression[] }) => {
                  const newF: any = { ...ofi }
                  if (newF[entitySchema.name]) {
                    newF[entitySchema.name] = [...newF[entitySchema.name], e]
                  } else {
                    newF[entitySchema.name] = [e]
                  }
                  return newF
                })
                // setFilter((f) => [...f, e])
              }}
            ></LogicalExpressionEditor>
          </DropdownButton>
          <button
            id='ParentFilterButton'
            className={`hover:bg-backgroundthree hover:dark:bg-backgroundthreedark p-1 rounded-md ${
              useParentFilter ? 'text-green-600' : ''
            }`}
            onClick={() => setUseParentFilter((x) => !x)}
          >
            <ArrowUturnUpd size={5}></ArrowUturnUpd>
            <Tooltip targetId='ParentFilterButton'>
              <div className='text-textone dark:text-textonedark'>
                {useParentFilter ? 'Disable Parent Filter' : 'Activate Parent Filter'}
              </div>
            </Tooltip>
          </button>
          <button
            id='ShowFilterTagsButton'
            className={`hover:bg-backgroundthree hover:dark:bg-backgroundthreedark p-1 rounded-md ${
              filterByEntityName[dataSource.entitySchema!.name]?.length > 0 ? 'text-green-600' : ''
            }`}
            onClick={() => setFilterTagsVisible((x) => !x)}
          >
            <AdjustmentsHorizontalIcon size={5}></AdjustmentsHorizontalIcon>
            <Tooltip targetId='ShowFilterTagsButton'>
              <div className='text-textone dark:text-textonedark'>
                {filterTagsVisible ? 'Hide Filters' : 'Show Filters'}
              </div>
            </Tooltip>
          </button>
        </div>
      </div>
      <div>
        {filterTagsVisible && filterByEntityName[dataSource.entitySchema!.name]?.length > 0 && (
          <FilterTagBar
            dataSourceManager={dataSourceManager}
            className='mb-1 rounded-md'
            filters={filterByEntityName[entitySchema.name] || []}
            fkRelations={EntitySchemaService.getRelationsByFilter(
              schemaRoot,
              (r) => r.foreignEntityName == dataSource.entitySchema!.name,
            )}
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
          onRecordEnter={onRecordEnter}
          onSelectedRecordsChange={(sr) => {
            console.log('selected change', sr)
            onSelectedRecordsChange(sr)
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
          rowHeight={2}
        ></Table>
      )}
    </div>
  )
}

export default EntityTable
