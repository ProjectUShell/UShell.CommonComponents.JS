import { LogicalExpression, PagingParams, SortingField } from 'fusefx-repositorycontract'
import { FieldPredicate } from 'fusefx-repositorycontract/lib/FieldPredicate'
import { TableColumn } from '../components/guifad/_Organisms/Table'
import { EntitySchema, FieldSchema } from 'fusefx-modeldescription'
import { EntitySchemaService } from '../data/EntitySchemaService'

export function getSelectedValues(filter: LogicalExpression, fieldName: string): any[] {
  if (!filter || !filter.predicates || filter.predicates.length == 0) {
    return []
  }
  for (let p of filter.predicates) {
    if (p.fieldName == fieldName && p.operator == 'in') {
      return JSON.parse(p.valueSerialized)
    }
  }
  return []
}

export function getFirstEqualsFilterValue(filter: LogicalExpression, fieldName: string): string {
  if (!filter || !filter.predicates || filter.predicates.length == 0) {
    return ''
  }
  for (let p of filter.predicates) {
    if (p.fieldName == fieldName && p.operator == '=') {
      return JSON.parse(p.valueSerialized)
    }
  }
  return ''
}

export function buildEqualsFilter(fieldName: string, value: any): LogicalExpression {
  return {
    matchAll: true,
    negate: false,
    subTree: [],
    predicates: [
      {
        fieldName: fieldName,
        operator: '=',
        valueSerialized: JSON.stringify(value),
      },
    ],
  }
}

export function buildIsInFilter(fieldName: string, values: any[]): LogicalExpression {
  return {
    matchAll: true,
    negate: false,
    subTree: [],
    predicates: [
      {
        fieldName: fieldName,
        operator: 'in',
        valueSerialized: JSON.stringify(values),
      },
    ],
  }
}

export function applyFilter(records: any[], filter: LogicalExpression, entitySchema: EntitySchema) {
  const result: any[] = []
  for (let r of records) {
    if (satisfiesFilter(r, filter, entitySchema)) {
      result.push(r)
    }
  }
  return result
}

export function compare1(
  a: any,
  b: any,
  sortingField: SortingField,
  column: { fieldType: string },
): number {
  switch (column.fieldType) {
    case 'int32':
      const aNumber: number = a[sortingField.fieldName] as number
      const bNumber: number = b[sortingField.fieldName] as number
      if (aNumber < bNumber) return sortingField.descending ? 1 : -1
      if (aNumber > bNumber) return sortingField.descending ? -1 : 1
      return 0
    default:
      const aString: string = a[sortingField.fieldName] as string
      const bString: string = b[sortingField.fieldName] as string
      const localC: number = aString.localeCompare(bString)
      return sortingField.descending ? -localC : localC
  }
}

export function compare(
  a: any,
  b: any,
  sortingFields: SortingField[],
  columns: { fieldType: string }[],
): number {
  let i: number = 0
  for (let c of columns) {
    const sf: SortingField = sortingFields[i]
    const innerResult: number = compare1(a, b, sf, c)
    if (innerResult != 0) return innerResult
    i++
  }
  return 0
}

export function applySorting(
  records: any[],
  sortingFields: SortingField[],
  columns: { fieldType: string }[],
) {
  return records.sort((a, b) => compare(a, b, sortingFields, columns))
}

export function applyPaging(records: any[], pagingParams: PagingParams) {
  return records.slice(
    (pagingParams.pageNumber - 1) * pagingParams.pageSize,
    pagingParams.pageNumber * pagingParams.pageSize,
  )
}

export function satisfiesFilter(
  record: any,
  filter: LogicalExpression,
  entitySchema: EntitySchema,
): boolean {
  let matchesOne: boolean = false
  let machesAll: boolean = true
  for (let p of filter?.predicates) {
    if (satisfiesPredicate(record, p, entitySchema)) {
      matchesOne = true
    } else {
      machesAll = false
    }
  }
  for (let f of filter?.subTree) {
    if (satisfiesFilter(record, f, entitySchema)) {
      matchesOne = true
    } else {
      machesAll = false
    }
  }
  return (filter.matchAll && machesAll) || (!filter.matchAll && matchesOne)
}

export function satisfiesPredicate(
  record: any,
  filter: FieldPredicate,
  entitySchema: EntitySchema,
): boolean {
  if (!(filter.fieldName in record)) return true
  let filterValue: any
  try {
    filterValue = JSON.parse(filter.valueSerialized)
  } catch (e) {
    filterValue = filter.valueSerialized
  }
  switch (filter.operator) {
    case '=':
      return record[filter.fieldName] == filterValue
    case 'in':
      return filterValue.includes(record[filter.fieldName])
    case 'contains':
    case '>=': {
      const fieldSchema: FieldSchema | undefined = entitySchema.fields.find(
        (f) => f.name == filter.fieldName,
      )
      if (!fieldSchema) return false
      if (EntitySchemaService.isNumber(fieldSchema.type)) {
        return record[filter.fieldName] >= filterValue
      } else {
        return record[filter.fieldName].includes(filterValue)
      }
    }
    case '<=': {
      const fieldSchema: FieldSchema | undefined = entitySchema.fields.find(
        (f) => f.name == filter.fieldName,
      )
      if (!fieldSchema) return false
      if (EntitySchemaService.isNumber(fieldSchema.type)) {
        return record[filter.fieldName] <= filterValue
      } else {
        return filterValue.includes(record[filter.fieldName])
      }
    }
    case 'startsWith':
    case 'starts with':
    case '|*': {
      return record[filter.fieldName].startsWith(filterValue)
    }
    case 'endsWith':
    case 'ends with':
    case '*|': {
      return record[filter.fieldName].endsWith(filterValue)
    }
  }
  return true
}
