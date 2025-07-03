import { useState, useEffect } from 'react'
import { SortingField } from 'fusefx-repositorycontract'
import { applySorting } from '../../../utils/LogicUtils'
import { TableColumn } from '../../guifad/_Organisms/Table'

export function useTableSorting(
  columns: TableColumn[],
  initialSortingParams?: SortingField[],
  onSortingParamsChange?: (sortingParams: SortingField[], changedField: SortingField) => void,
) {
  const [sortingParams, setSortingParams] = useState<SortingField[]>(initialSortingParams || [])

  useEffect(() => {
    if (initialSortingParams) setSortingParams(initialSortingParams)
  }, [initialSortingParams])

  function toggleSorting(colKey: string) {
    const newSortingParams = [...sortingParams]
    const currentSortingField: SortingField | undefined = newSortingParams?.find(
      (sf) => sf.fieldName == colKey,
    )
    if (!currentSortingField) {
      newSortingParams.push({ fieldName: colKey, descending: false })
    } else if (currentSortingField.descending) {
      newSortingParams.splice(newSortingParams.indexOf(currentSortingField), 1)
      currentSortingField.descending = false
    } else {
      currentSortingField.descending = true
    }
    setSortingParams(newSortingParams)
    if (onSortingParamsChange) {
      onSortingParamsChange(
        newSortingParams,
        currentSortingField ? currentSortingField : { fieldName: colKey, descending: false },
      )
    }
  }

  function getSortedRecords(records: any[]) {
    return applySorting(
      records,
      sortingParams,
      sortingParams.map((sp) => columns.find((c) => c.fieldName == sp.fieldName)!),
    )
  }

  return {
    sortingParams,
    setSortingParams,
    toggleSorting,
    getSortedRecords,
  }
}
