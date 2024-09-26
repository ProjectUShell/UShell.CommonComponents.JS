import { LogicalExpression, SortingField } from 'fusefx-repositorycontract'
import { FieldPredicate } from 'fusefx-repositorycontract/lib/FieldPredicate'
import { TableColumn } from '../components/guifad/_Organisms/Table'

export function getSelectedValues(filter: LogicalExpression, fieldName: string): any[] {
  if (!filter || !filter.predicates || filter.predicates.length == 0) {
    return []
  }
  for (let p of filter.predicates) {
    if (p.fieldName == fieldName && p.operator == 'in') {
      return p.value
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
      return p.value
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
        value: value,
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
        value: values,
      },
    ],
  }
}

export function applyFilter(records: any[], filter: LogicalExpression) {
  const result: any[] = []
  for (let r of records) {
    if (satisfiesFilter(r, filter)) {
      result.push(r)
    }
  }
  return result
}

export function compare1(a: any, b: any, sortingField: SortingField, column: TableColumn): number {
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
      console.log('compare string', localC)
      return sortingField.descending ? -localC : localC
  }
}

export function compare(
  a: any,
  b: any,
  sortingFields: SortingField[],
  columns: TableColumn[],
): number {
  console.log('comparing', sortingFields)
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
  columns: TableColumn[],
) {
  return records.sort((a, b) => compare(a, b, sortingFields, columns))
}

export function satisfiesFilter(record: any, filter: LogicalExpression): boolean {
  let matchesOne: boolean = false
  let machesAll: boolean = true
  for (let p of filter?.predicates) {
    if (satisfiesPredicate(record, p)) {
      matchesOne = true
    } else {
      machesAll = false
    }
  }
  return (filter.matchAll && machesAll) || (!filter.matchAll && matchesOne)
}

export function satisfiesPredicate(record: any, filter: FieldPredicate): boolean {
  if (!(filter.fieldName in record)) return true
  switch (filter.operator) {
    case '=':
      return record[filter.fieldName] == filter.value
    case 'in':
      return filter.value.includes(record[filter.fieldName])
  }
  return true
}
