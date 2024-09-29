import React, { useEffect, useState } from 'react'
import { RelationSchema } from 'fusefx-modeldescription'
import { IDataSource, IDataSourceManagerBase } from 'ushell-modulebase'
import DropdownSelect from '../../../_Atoms/DropdownSelect'
import { PaginatedList } from 'fusefx-repositorycontract'
import ErrorPage from '../../../_Molecules/ErrorScreen'

const LookUpSelect: React.FC<{
  dataSourceManager: IDataSourceManagerBase
  lookUpRelation: RelationSchema
  initialValue: any
  onValueSet: (keyValues: any[]) => void
  inputClassName?: string
  showLabel?: boolean
}> = ({
  dataSourceManager,
  lookUpRelation,
  initialValue,
  onValueSet,
  inputClassName = '',
  showLabel = true,
}) => {
  const [lookUpList, setLookUpList] = useState<{ label: string; value: string }[]>([])
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
          setLookUpList(lul)
        })
        .catch((err) => setError('Failed to get Entity Refs'))
      setError(null)
    } catch (err) {
      setError(err)
    }
  }, [lookUpRelation, dataSourceManager])

  if (error) {
    return <ErrorPage messages={[error]}></ErrorPage>
  }
  return (
    <div>
      {showLabel && (
        <label className='block mb-2 text-xs font-medium'>
          {lookUpRelation.foreignNavigationName && lookUpRelation.foreignNavigationName != ''
            ? lookUpRelation.foreignNavigationName
            : lookUpRelation.primaryEntityName}
        </label>
      )}
      <DropdownSelect
        options={lookUpList}
        onOptionSet={(o) => {
          onValueSet(o?.value)
        }}
        initialOption={lookUpList.find((li) => li.value == initialValue)}
        topOffset={0}
        inputClassname={inputClassName}
      ></DropdownSelect>
    </div>
  )
}

export default LookUpSelect
