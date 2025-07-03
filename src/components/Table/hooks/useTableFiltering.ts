import { useState, useEffect } from 'react'
import { LogicalExpression } from 'fusefx-repositorycontract'
import { TableColumn } from '../../guifad/_Organisms/Table'
import { EntitySchema, FieldSchema } from 'fusefx-modeldescription'
import { applyFilter } from '../../../utils/LogicUtils'

export function useTableFiltering(
  records: any[],
  columns: TableColumn[],
  initialFilters?: { [c: string]: LogicalExpression },
  useClientFilter: boolean = false,
  onFilterChanged?: (filterByColumn: { [c: string]: LogicalExpression }) => void,
) {
  const [filterByColumn, setFilterByColumn] = useState<{ [c: string]: LogicalExpression }>(
    initialFilters || {},
  )
  const [filterVisible, setFilterVisible] = useState<{ [c: string]: boolean }>({})

  useEffect(() => {
    if (initialFilters) setFilterByColumn(initialFilters)
  }, [initialFilters])

  let filteredRecords = records
  if (useClientFilter) {
    for (let f in filterByColumn) {
      filteredRecords = applyFilter(
        filteredRecords,
        filterByColumn[f],
        getEntitySchemaFromColumns(columns),
      )
    }
  }

  function onColumnFilterChange(columnFilter: LogicalExpression | null, column: TableColumn) {
    if (!onFilterChanged && !useClientFilter) {
      return
    }
    if (columnFilter) {
      filterByColumn[column.fieldName] = columnFilter
    } else {
      delete filterByColumn[column.fieldName]
    }
    setFilterByColumn({ ...filterByColumn })
    setFilterVisible((fv) => {
      fv[column.fieldName] = false
      return { ...fv }
    })
    if (onFilterChanged) {
      onFilterChanged(filterByColumn)
    }
  }

  function onSetFilterVisible(c: string, v: boolean) {
    setFilterVisible((f) => {
      const newFilterVisible = { ...f }
      newFilterVisible[c] = v
      return newFilterVisible
    })
  }

  function getEntitySchemaFromColumns(columns: TableColumn[]): EntitySchema {
    const fields: FieldSchema[] = columns.map((c) => {
      const fieldSchema: FieldSchema = new FieldSchema(c.fieldName, c.fieldType)
      return fieldSchema
    })
    const result: EntitySchema = new EntitySchema()
    result.fields = fields
    result.name = 'TableEntity'
    return result
  }

  return {
    filteredRecords,
    filterByColumn,
    filterVisible,
    setFilterVisible,
    onColumnFilterChange,
    onSetFilterVisible,
    setFilterByColumn,
  }
}
