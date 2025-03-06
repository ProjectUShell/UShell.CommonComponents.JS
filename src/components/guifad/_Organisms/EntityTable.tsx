import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { IDataSource } from 'ushell-modulebase'
import Table, { TableColors, TableColumn } from './Table'
import PlusCircleIcon from '../../../_Icons/PlusCircleIcon'
import TrashIcon from '../../../_Icons/TrashIcon'
import {
  QueryClient,
  QueryClientContext,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { EntitySchema, RelationSchema } from 'fusefx-modeldescription'
import { LogicalExpression, PagingParams, SortingField } from 'fusefx-repositorycontract'
import { getParentFilter } from '../../../data/DataSourceService'
import FunnelIcon from '../../../_Icons/FunnelIcon'
import DropdownButton from '../../../_Atoms/DropdownButton'
import LogicalExpressionEditor from '../_Molecules/LogicalExpressionEditor'
import FilterTagBar from '../_Molecules/FilterTagBar'
import { EntitySchemaService } from '../../../data/EntitySchemaService'
import ArrowUturnUpd from '../../../_Icons/ArrowUturnUpd'
import Tooltip from '../../../_Atoms/Tooltip'
import ErrorPage from '../../../_Molecules/ErrorScreen'
import LoadingScreen from '../../../_Molecules/LoadingScreen'
import SearchBar from '../../../_Molecules/SearchBar'
import AdjustmentsHorizontalIcon from '../../../_Icons/AdjustmentsHorizontalIcon'
import QueryLibrary from './QueryLibrary'
import { IDataSourceManagerWidget } from '../_Templates/IDataSourceManagerWidget'
import EntityFormModal from './EntityFormModal'
import { LayoutDescriptionRoot } from '../../../[Move2LayoutDescription]/LayoutDescriptionRoot'
import { EntityLayout } from '../../../[Move2LayoutDescription]/EntityLayout'
import { FieldLayout } from '../../../[Move2LayoutDescription]/FieldLayout'
import { renderCustomAvailableValuesFilter } from '../../../_Molecules/AvailableValuesFilter'
import ListBulletIcon from '../../../_Icons/ListBulletIcon'
import ListTreeIcon from '../../../_Icons/ListTreeIcon'
import ArchiveBoxArrowDown from '../../../_Icons/ArchiveBoxArrowDown'
import {
  exportTableToCsv,
  exportTableToTsv,
  exportToCsv,
  exportToTsv,
  saveFile,
} from '../../../utils/IoUtils'
import Menu, { Menu1 } from '../../../_Molecules/Menu'
import { showDialog2 } from '../../../_Molecules/Dialog'
import { showNotification } from '../../../_Molecules/Notification'
import DocumentDuplicate from '../../../_Icons/DocumentDuplicateIcon'
import DocumentDuplicateIcon from '../../../_Icons/DocumentDuplicateIcon'

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
  enableCrud?: boolean
  enableParentFilter?: boolean
  enableQueryEditor?: boolean
  enableSearch?: boolean
  formStyleType?: number
  formLabelPosition?: 'left' | 'top'
  rowHeight?: number
  customColumns?: TableColumn[]
  reloadTriggerObject?: any
  isParent?: (c: any, p: any) => boolean
  onRecordsChanged?: () => void
  tableColors?: TableColors
  minWidthInput?: number
}> = ({
  dataSourceManagerForNavigations,
  dataSource,
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
  enableCrud = true,
  enableParentFilter = true,
  enableQueryEditor = true,
  formStyleType = 0,
  formLabelPosition = 'top',
  enableSearch = true,
  rowHeight = 1,
  customColumns = [],
  reloadTriggerObject,
  isParent,
  onRecordsChanged,
  tableColors,
  minWidthInput,
}) => {
  return (
    <EntityTable1
      dataSourceManagerForNavigations={dataSourceManagerForNavigations}
      dataSource={dataSource}
      dataSourcesForm={null}
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
      enableCrud={enableCrud}
      enableParentFilter={enableParentFilter}
      enableQueryEditor={enableQueryEditor}
      formStyleType={formStyleType}
      formLabelPosition={formLabelPosition}
      enableSearch={enableSearch}
      customColumns={customColumns}
      reloadTriggerObject={reloadTriggerObject}
      rowHeight={rowHeight}
      isParent={isParent}
      onRecordsChanged={onRecordsChanged}
      tableColors={tableColors}
      minWidthInput={minWidthInput}
    ></EntityTable1>
  )
}
export const EntityTable1: React.FC<{
  dataSourceManagerForNavigations?: IDataSourceManagerWidget
  dataSource: IDataSource
  dataSourcesForm: IDataSource[] | null
  parentSchema?: EntitySchema | undefined
  parent?: any
  layoutDescription?: LayoutDescriptionRoot
  entitySchema?: EntitySchema
  className?: string
  onRecordEnter?: (r: any) => void
  onSelectedRecordsChange?: (selectedRecords: any[]) => void
  selectedRecord?: any | null
  onCreateRecord?: () => void
  classNameBgToolbar?: string
  enableCrud?: boolean
  enableParentFilter?: boolean
  enableQueryEditor?: boolean
  enableSearch?: boolean
  formStyleType?: number
  formLabelPosition?: 'left' | 'top'
  rowHeight?: number
  customColumns?: TableColumn[]
  reloadTriggerObject?: any
  isParent?: (c: any, p: any) => boolean
  onRecordsChanged?: () => void
  tableColors?: TableColors
  minWidthInput?: number
}> = ({
  dataSourceManagerForNavigations,
  dataSource,
  dataSourcesForm,
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
  enableCrud = true,
  enableParentFilter = true,
  enableQueryEditor = true,
  formStyleType = 0,
  formLabelPosition = 'top',
  enableSearch = true,
  rowHeight = 1,
  customColumns = [],
  reloadTriggerObject,
  isParent,
  onRecordsChanged,
  tableColors,
  minWidthInput,
}) => {
  const qcc: any = QueryClientContext
  if (!qcc._currentValue)
    return (
      <QueryClientProvider client={new QueryClient()}>
        <EntityTableInternal
          dataSourceManagerForNavigations={dataSourceManagerForNavigations}
          dataSource={dataSource}
          dataSourcesForm={dataSourcesForm}
          parentSchema={parentSchema}
          parent={parent}
          className={className}
          onRecordEnter={onRecordEnter}
          onSelectedRecordsChange={onSelectedRecordsChange}
          selectedRecord={selectedRecord}
          onCreateRecord={onCreateRecord}
          layoutDescription={layoutDescription}
          classNameBgToolbar={classNameBgToolbar}
          enableCrud={enableCrud}
          formStyleType={formStyleType}
          formLabelPosition={formLabelPosition}
          enableParentFilter={enableParentFilter}
          enableQueryEditor={enableQueryEditor}
          enableSearch={enableSearch}
          rowHeight={rowHeight}
          customColumns={customColumns}
          reloadTriggerObject={reloadTriggerObject}
          isParent={isParent}
          onRecordsChanged={onRecordsChanged}
          tableColors={tableColors}
          minWidthInput={minWidthInput}
        ></EntityTableInternal>
      </QueryClientProvider>
    )
  return (
    <EntityTableInternal
      dataSourceManagerForNavigations={dataSourceManagerForNavigations}
      dataSource={dataSource}
      dataSourcesForm={dataSourcesForm}
      parentSchema={parentSchema}
      parent={parent}
      className={className}
      onRecordEnter={onRecordEnter}
      onSelectedRecordsChange={onSelectedRecordsChange}
      selectedRecord={selectedRecord}
      onCreateRecord={onCreateRecord}
      enableCrud={enableCrud}
      formStyleType={formStyleType}
      formLabelPosition={formLabelPosition}
      enableParentFilter={enableParentFilter}
      enableQueryEditor={enableQueryEditor}
      enableSearch={enableSearch}
      rowHeight={rowHeight}
      customColumns={customColumns}
      reloadTriggerObject={reloadTriggerObject}
      isParent={isParent}
      onRecordsChanged={onRecordsChanged}
      tableColors={tableColors}
      minWidthInput={minWidthInput}
    ></EntityTableInternal>
  )
}
const EntityTableInternal: React.FC<{
  dataSourceManagerForNavigations?: IDataSourceManagerWidget
  dataSource: IDataSource
  dataSourcesForm: IDataSource[] | null
  parentSchema?: EntitySchema | undefined
  parent?: any
  layoutDescription?: LayoutDescriptionRoot
  className?: string
  onRecordEnter?: (r: any) => void
  onSelectedRecordsChange?: (selectedRecords: any[]) => void
  selectedRecord?: any | null
  onCreateRecord?: () => void
  classNameBgToolbar?: string
  enableCrud: boolean
  enableParentFilter: boolean
  enableSearch: boolean
  enableQueryEditor: boolean
  formStyleType: number
  formLabelPosition: 'left' | 'top'
  rowHeight: number
  customColumns: TableColumn[]
  reloadTriggerObject: any
  isParent?: (c: any, p: any) => boolean
  onRecordsChanged?: () => void
  tableColors?: TableColors
  minWidthInput?: number
}> = ({
  dataSourceManagerForNavigations,
  dataSource,
  dataSourcesForm,
  parentSchema,
  parent,
  className,
  onRecordEnter,
  onSelectedRecordsChange,
  selectedRecord,
  onCreateRecord,
  layoutDescription,
  classNameBgToolbar,
  enableCrud,
  enableParentFilter,
  enableQueryEditor,
  enableSearch,
  formStyleType = 0,
  formLabelPosition,
  rowHeight,
  customColumns,
  reloadTriggerObject,
  isParent,
  onRecordsChanged,
  tableColors,
  minWidthInput,
}) => {
  // const [records, setRecords] = useState<any[]>([])
  const [selectedRecords, setSelectedRecords] = useState<any[]>([])
  // const [columns, setColumns] = useState<TableColumn[]>([])
  const [pagingParams, setPagingParams] = useState<PagingParams>({ pageNumber: 1, pageSize: 50 })
  const [sortingParamsByEntityName, setSortingParamsByEntityName] = useState<{
    [entityName: string]: SortingField[]
  }>({})
  const [filterByEntityName, setFilterByEntityName] = useState<{
    [entityName: string]: LogicalExpression[]
  }>(loadFilter())
  const [columnFilters, setColumnFilters] = useState<{
    [columnName: string]: LogicalExpression
  }>({})
  const [useParentFilter, setUseParentFilter] = useState(true)
  const [reloadTrigger, setReloadTrigger] = useState(0)

  const [universalSearchText, setUniversalSearchText] = useState('')
  const [filterTagsVisible, setFilterTagsVisible] = useState(true)
  const [detailsVisible, setDetailsVisible] = useState(false)
  const [isCreation, setIsCreation] = useState(false)

  const [showTree, setShowTree] = useState(true)

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

  //TODO do this correctly!
  // useEffect(() => {
  //   setSelectedRecords(selectedRecord ? [selectedRecord] : [])
  // }, [selectedRecord])

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
      if (newF[dataSource.entitySchema!.name]) {
        newF[dataSource.entitySchema!.name] = [
          ...newF[dataSource.entitySchema!.name],
          searchExpression,
        ]
      } else {
        newF[dataSource.entitySchema!.name] = [searchExpression]
      }
      return newF
    })
  }, [universalSearchText, dataSource.entitySchema!.name])

  useEffect(() => {
    localStorage.setItem('filterByEntityName', JSON.stringify(filterByEntityName))
  }, [filterByEntityName])

  const columns: TableColumn[] = useMemo(() => {
    const entityLayout: EntityLayout | undefined = layoutDescription?.entityLayouts.find(
      (el) => el.entityName == dataSource.entitySchema!.name,
    )

    const newColumns: TableColumn[] = dataSource
      .entitySchema!.fields.filter((f) => {
        if (!entityLayout) return true
        if (!entityLayout.tableFields) return true
        if (entityLayout.tableFields.length == 0) return true
        return entityLayout.tableFields.includes(f.name)
      })
      .map((f) => {
        const foreignKeyRelations: RelationSchema[] = dataSourceManagerForNavigations
          ? EntitySchemaService.getRelationsByFilter(
              dataSourceManagerForNavigations.getSchemaRoot(),
              (r) =>
                r.foreignEntityName == dataSource.entitySchema!.name &&
                r.foreignKeyIndexName == f.name,
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

        const fieldLayout: FieldLayout | undefined = entityLayout?.fieldLayouts.find(
          (fl) => fl.fieldName.toLocaleLowerCase() == f.name.toLocaleLowerCase(),
        )
        return {
          label: fieldLayout ? fieldLayout.displayLabel : f.name,
          fieldName: f.name,
          fieldType: f.type,
          key: f.name,
          sortable: true,
          renderFilter:
            f.filterable > 0
              ? (filter, onFilterChanged, column, availableRecords) =>
                  renderCustomAvailableValuesFilter(
                    fieldLayout && fieldLayout.dropdownStaticEntries
                      ? Object.keys(fieldLayout.dropdownStaticEntries).map(
                          //TODO_RWE respect labels!
                          (av) => fieldLayout.dropdownStaticEntries![av],
                        )
                      : availableRecords.map((r) => r[f.name]),
                    filter,
                    onFilterChanged,
                    column,
                  )
              : undefined,
        }
      })
    customColumns.forEach((cc: TableColumn) => newColumns.push(cc))
    const sortedColumns: TableColumn[] = []
    if (entityLayout?.tableFields && entityLayout.tableFields.length > 0) {
      entityLayout.tableFields.forEach((tf) => {
        const column: TableColumn | undefined = newColumns.find(
          (c) => c.fieldName.toLocaleLowerCase() == tf.toLocaleLowerCase(),
        )
        if (column) {
          sortedColumns.push(column)
        }
      })
      return sortedColumns
    } else {
      return newColumns
    }
    // setColumns(newColumns)
    // dataSource.getRecords().then((r) => {
    //   setRecords(r)
    // })
  }, [dataSource, dataSourceManagerForNavigations])

  const getId = useCallback(
    (e: any) => EntitySchemaService.getPrimaryKey(dataSource.entitySchema!, e),
    [dataSource],
  )

  function applyQuery(queries: LogicalExpression[]) {
    const newF: any = { ...filterByEntityName }
    newF[dataSource.entitySchema!.name] = queries
    setFilterByEntityName(newF)
  }

  function buildFilterExpression(): LogicalExpression {
    const result: LogicalExpression = new LogicalExpression()
    const filters: LogicalExpression[] = filterByEntityName[dataSource.entitySchema!.name] || []
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
    Object.keys(columnFilters).forEach((c) => {
      result.subTree.push(columnFilters[c])
    })
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
      columnFilters,
      reloadTriggerObject,
    ],
    queryFn: () => {
      try {
        return dataSource.getRecords(
          buildFilterExpression(),
          pagingParams,
          sortingParamsByEntityName[dataSource.entitySchema!.name],
        )
      } catch (error) {
        console.error('error in getRecords', error)
        return null
      }
    },
  })

  const data1: any = data

  if (error) return <ErrorPage messages={['An error has occurred', error.toString()]}></ErrorPage>
  function addRecord() {
    if (!onCreateRecord) {
      setDetailsVisible(true)
      setIsCreation(true)
      return
    }
    onCreateRecord()
  }

  function deleteRecords() {
    if (selectedRecords.length == 0) {
      return
    }
    showDialog2(
      'Confirm Deletion',
      ['Cancel', 'Ok'],
      <div className='p-2'>{`Are you sure you want to delete ${
        selectedRecords.length == 1
          ? 'the selected record'
          : `the ${selectedRecords.length} selected records`
      }?`}</div>,
      (r) => {
        if (r == 'Ok') {
          dataSource.entityDeleteMethod(selectedRecords).then((r) => {
            setSelectedRecords([])
            onSelectedRecordsChange && onSelectedRecordsChange([])
            forceReload()
            if (r) {
              showNotification('Deletion successful', 'Success')
            } else {
              showNotification('Deletion of Entity failed', 'Error')
            }
          })
        }
      },
    )
  }

  function cloneRecord() {
    if (!(selectedRecords.length == 1)) return
    const clonedRecord: any = EntitySchemaService.clone(
      selectedRecords[0],
      dataSource.entitySchema!,
    )
    dataSource.entityInsertMethod(clonedRecord).then((v) => {
      onRecordsChanged && onRecordsChanged()
      setReloadTrigger((r) => r + 1)
    })
  }

  function createEntity(): any {
    if (dataSourcesForm && dataSourcesForm.length > 0) {
      return dataSourcesForm[0].entityFactoryMethod()
    } else {
      return dataSource.entityFactoryMethod()
    }
  }

  return (
    <>
      <div className='UShell_EntityTable flex flex-col h-full w-full overflow-hidden border-0 border-red-400'>
        {(enableCrud || enableParentFilter || enableQueryEditor || enableSearch) && (
          <div
            className={`UShell_EntityTable_Toolbar 
            ${classNameBgToolbar || 'bg-toolbar dark:bg-toolbarDark'}
            border-toolbarBorder dark:border-toolbarBorderDark 
            rounded-sm border flex justify-between items-center my-0`}
          >
            <div className='flex'>
              {enableCrud && (
                <div className={`flex justify-end p-1 ${className} rounded-md`}>
                  <button
                    className='rounded-md p-1 text-green-600 dark:text-green-600 hover:bg-toolbarHover dark:hover:bg-toolbarHoverDark'
                    onClick={(e) => addRecord()}
                  >
                    <PlusCircleIcon></PlusCircleIcon>
                  </button>
                  <button
                    disabled={selectedRecords.length != 1}
                    className={`rounded-md p-1 ${
                      selectedRecords.length == 1
                        ? 'text-green-600 dark:text-green-600 hover:bg-toolbarHover dark:hover:bg-toolbarHoverDark'
                        : 'cursor-default text-gray-400 dark:text-gray-600'
                    } `}
                    onClick={(e) => cloneRecord()}
                  >
                    <DocumentDuplicateIcon></DocumentDuplicateIcon>
                  </button>
                  <button
                    disabled={selectedRecords.length == 0}
                    className={`rounded-md p-1 ${
                      selectedRecords.length != 0
                        ? 'text-red-600 dark:text-red-400 hover:bg-toolbarHover dark:hover:bg-toolbarHoverDark'
                        : 'cursor-default text-gray-400 dark:text-gray-600'
                    } `}
                    onClick={(e) => deleteRecords()}
                  >
                    <TrashIcon></TrashIcon>
                  </button>
                </div>
              )}
              <DropdownButton
                buttonContent={
                  <div className='hover:bg-toolbarHover dark:hover:bg-toolbarHoverDark p-1 rounded-md'>
                    <ArchiveBoxArrowDown></ArchiveBoxArrowDown>
                  </div>
                }
              >
                <div className='bg-menu dark:bg-menuDark p-0 border dark:border-menuBorderDark'>
                  <Menu1
                    styleType={1}
                    direction='Vertical'
                    menuItems={[
                      {
                        id: 'Table_Raw_Export',
                        label: 'Export Raw Data',
                        selectable: false,
                        type: 'SubMenu',
                        children: [
                          {
                            id: 'Table_Raw_Export_Csv',
                            label: 'Export To Csv',
                            selectable: false,
                            type: 'Command',
                            command: () => {
                              exportToCsv(
                                dataSource,
                                buildFilterExpression(),
                                sortingParamsByEntityName[dataSource.entitySchema!.name],
                              ).then((b) => {
                                saveFile(b)
                              })
                            },
                            children: [],
                          },
                          {
                            id: 'Table_Raw_Export_Tsv',
                            label: 'Export To Tsv',
                            selectable: false,
                            type: 'Command',
                            command: () => {
                              exportToTsv(
                                dataSource,
                                buildFilterExpression(),
                                sortingParamsByEntityName[dataSource.entitySchema!.name],
                              ).then((b) => {
                                saveFile(b)
                              })
                            },
                            children: [],
                          },
                        ],
                      },
                      {
                        id: 'Table_Table_Export',
                        label: 'Export Table Data',
                        selectable: false,
                        type: 'SubMenu',
                        children: [
                          {
                            id: 'Table_Table_Export_Csv',
                            label: 'Export To Csv',
                            selectable: false,
                            type: 'Command',
                            command: () => {
                              exportTableToCsv(
                                dataSource,
                                buildFilterExpression(),
                                sortingParamsByEntityName[dataSource.entitySchema!.name],
                                columns,
                              ).then((b) => {
                                saveFile(b)
                              })
                            },
                            children: [],
                          },
                          {
                            id: 'Table_Table_Export_Tsv',
                            label: 'Export To Tsv',
                            selectable: false,
                            type: 'Command',
                            command: () => {
                              exportTableToTsv(
                                dataSource,
                                buildFilterExpression(),
                                sortingParamsByEntityName[dataSource.entitySchema!.name],
                                columns,
                              ).then((b) => {
                                saveFile(b)
                              })
                            },
                            children: [],
                          },
                        ],
                      },
                    ]}
                  ></Menu1>
                </div>
              </DropdownButton>
            </div>

            {isParent && (
              <div className='flex'>
                <button
                  className={`p-1 hover:bg-toolbarHover dark:hover:bg-toolbarHoverDark ${
                    showTree ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
                  }`}
                  onClick={() => setShowTree((x) => !x)}
                >
                  <ListTreeIcon></ListTreeIcon>
                </button>
              </div>
            )}
            <div className={`flex p-1 ${className} rounded-md `}>
              {enableSearch && (
                <div className='p-0'>
                  <SearchBar
                    onSearch={(searchText: string) => {
                      setUniversalSearchText(searchText)
                    }}
                  ></SearchBar>
                </div>
              )}

              {(enableQueryEditor || enableSearch) && (
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
              )}
              {enableParentFilter && (
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
              )}
            </div>
          </div>
        )}
        <div>
          {(enableQueryEditor || enableSearch) && filterTagsVisible && (
            <div className='FilterBar flex justify-between'>
              <FilterTagBar
                dataSourceManagerForNavigations={dataSourceManagerForNavigations}
                className='mb-1 rounded-md'
                filters={filterByEntityName[dataSource.entitySchema!.name] || []}
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
                    newF[dataSource.entitySchema!.name] = uf
                    return newF
                  })
                  // setFilter(uf)
                }}
              ></FilterTagBar>
              {enableQueryEditor && (
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
                    <div className=''>
                      <LogicalExpressionEditor
                        classNameBg='bg-content dark:bg-contentDark'
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
                              if (newF[dataSource.entitySchema!.name]) {
                                newF[dataSource.entitySchema!.name] = [
                                  ...newF[dataSource.entitySchema!.name],
                                  e,
                                ]
                              } else {
                                newF[dataSource.entitySchema!.name] = [e]
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
              )}
            </div>
          )}
        </div>
        {!data ? (
          <LoadingScreen message={'loading ' + dataSource.entitySchema!.name}></LoadingScreen>
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
            selectedRecords={selectedRecords}
            // selectedRecord={selectedRecords.length > 1 ? null : selectedRecords[0]} //TODO do this correctly!!!
            pagingParams={pagingParams}
            totalCount={data1!.total}
            onPagingParamsChange={(pp) => setPagingParams(pp)}
            initialSortingParams={sortingParamsByEntityName[dataSource.entitySchema!.name]}
            onSortingParamsChange={(sp) => {
              setSortingParamsByEntityName((o) => {
                const newSp: any = { ...o }
                newSp[dataSource.entitySchema!.name] = sp
                return newSp
              })
            }}
            rowHeight={rowHeight}
            initialFilters={columnFilters}
            onFilterChanged={(filterByColumn: { [c: string]: LogicalExpression }) => {
              setColumnFilters({ ...filterByColumn })
            }}
            isParent={isParent}
            showTree={showTree}
            tableColors={tableColors}
          ></Table>
        )}
      </div>
      {detailsVisible && (
        <EntityFormModal
          dataSources={dataSourcesForm ? dataSourcesForm : [dataSource]}
          dataSourceManager={dataSourceManagerForNavigations}
          dirty={true}
          entity={
            isCreation
              ? createEntity()
              : selectedRecords.length == 1
              ? selectedRecords[0]
              : createEntity()
          }
          onChange={() => {
            setDetailsVisible(false)
            setIsCreation(false)
            forceReload()
            onRecordsChanged && onRecordsChanged()
          }}
          onCancel={() => setDetailsVisible(false)}
          entityLayouts={layoutDescription?.entityLayouts}
          readOnly={!enableCrud}
          styleType={formStyleType}
          labelPosition={formLabelPosition}
          isCreation={isCreation}
          classNameDropdownBg=''
          classNameDropdownHoverBg=''
          minWidthInput={minWidthInput}
        ></EntityFormModal>
      )}
    </>
  )
}

export default EntityTable
