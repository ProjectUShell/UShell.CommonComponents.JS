import React, { useEffect, useState } from 'react'
import { RelationSchema } from 'fusefx-modeldescription'
import { IDataSource, IDataSourceManagerBase } from 'ushell-modulebase'
import DropdownSelect from '../../../_Atoms/DropdownSelect'
import { PaginatedList } from 'fusefx-repositorycontract'
import ErrorPage from '../../../_Molecules/ErrorScreen'
import { IDataSourceManagerWidget } from '../_Templates/IDataSourceManagerWidget'

const LookUpSelect: React.FC<{
  label?: string
  dataSourceManager: IDataSourceManagerWidget
  lookUpRelation: RelationSchema
  initialValue: any
  onValueSet: (keyValues: any[]) => void
  allowNull: boolean
  inputClassName?: string
  styleType?: number
  classNameBg?: string
  classNameHoverBg?: string
  classNameHoverBgDark?: string
  classNameDropdownBg?: string
  classNameDropdownHoverBg?: string
  showLabel?: boolean
  allowCrud?: boolean
}> = ({
  dataSourceManager,
  lookUpRelation,
  initialValue,
  onValueSet,
  allowNull,
  styleType,
  classNameBg,
  classNameHoverBg,
  classNameHoverBgDark,
  classNameDropdownBg,
  classNameDropdownHoverBg,
  showLabel = true,
  allowCrud = false,
  label = lookUpRelation.foreignNavigationName && lookUpRelation.foreignNavigationName != ''
    ? lookUpRelation.foreignNavigationName
    : lookUpRelation.foreignKeyIndexName,
}) => {
  const [lookUpList, setLookUpList] = useState<{ label: string; value: string }[]>([])
  const [renderTrigger, setRenderTrigger] = useState(0)
  const [error, setError] = useState<any>(null)
  useEffect(() => {
    try {
      const dataSource: IDataSource | null = dataSourceManager.tryGetDataSource(
        lookUpRelation.primaryEntityName,
      )
      if (!dataSource) {
        console.error('No DataSource for LookUps', lookUpRelation)
        setError('No DataSource for LookUps')
        return
      }
      dataSource
        .getEntityRefs(undefined, { pageNumber: 1, pageSize: 200 }, undefined)
        .then((r: PaginatedList) => {
          const lul = r.page.map((e: any) => {
            return { value: e.key, label: e.label }
          })
          lul.sort((a, b) => a.label.localeCompare(b.label))
          if (allowNull) {
            lul.unshift({ value: null, label: 'None' })
          }
          setLookUpList(lul)
        })
        .catch((err) => setError(`Failed to get Entity Refs: ${err}`))
      setError(null)
    } catch (err) {
      setError(err)
    }
  }, [lookUpRelation, dataSourceManager, renderTrigger])

  function createNew(): void {
    console.debug('createNew LookUp')
    const dataSource: IDataSource | null = dataSourceManager.tryGetDataSource(
      lookUpRelation.primaryEntityName,
    )
    if (!dataSource) {
      console.error('No DataSource for LookUps', lookUpRelation)
      setError('No DataSource for LookUps')
      return
    }

    dataSource
      .entityInsertMethod(dataSource.entityFactoryMethod())
      .then((s) => setRenderTrigger((r) => r + 1))
  }

  if (error) {
    return <ErrorPage messages={[error.toString()]}></ErrorPage>
  }
  return (
    <>
      {showLabel && <label className='block mb-2 text-xs font-medium'>{label}</label>}
      <DropdownSelect
        options={lookUpList}
        onOptionSet={(o) => {
          onValueSet(o?.value)
        }}
        initialOption={lookUpList.find((li) => li.value == initialValue)}
        topOffset={0}
        classNameBg={classNameBg}
        classNameHoverBg={classNameHoverBg}
        classNameHoverBgDark={classNameHoverBgDark}
        classNameDropdownBg={classNameDropdownBg}
        classNameDropdownHoverBg={classNameDropdownHoverBg}
        styleType={styleType}
        additionalElements={
          allowCrud
            ? [
                <div
                  className='w-full flex justify-center items-center align-middle'
                  key={lookUpRelation.primaryEntityName}
                >
                  <button
                    className='p-2 m-2 w-full bg-green-200 hover:bg-green-300 dark:bg-green-600 dark:hover:bg-green-700 rounded-lg'
                    onMouseDown={(e) => {
                      createNew()
                    }}
                  >
                    Create New
                  </button>
                </div>,
              ]
            : undefined
        }
      ></DropdownSelect>
    </>
  )
}

export default LookUpSelect
