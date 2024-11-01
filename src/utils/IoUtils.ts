import { LogicalExpression, SortingField } from 'fusefx-repositorycontract'
import { IDataSource } from 'ushell-modulebase'
import { TableColumn } from '../components/guifad/_Organisms/Table'
import { capitalizeFirstLetter, lowerFirstLetter } from './StringUtils'

const chunkSize: number = 1000
const maxPageNumber: number = 1000

export function exportToCsv(
  dataSource: IDataSource,
  filter: LogicalExpression,
  sortingParams: SortingField[],
): Promise<Blob> {
  let result = ''
  dataSource.entitySchema?.fields.forEach((f, i) => {
    result += f.name
    if (i < dataSource.entitySchema!.fields.length - 1) {
      result += ';'
    }
  })
  result += '\r\n'
  return exportToSvInternal(dataSource, filter, sortingParams, 1, result, ';')
}
export function exportToTsv(
  dataSource: IDataSource,
  filter: LogicalExpression,
  sortingParams: SortingField[],
): Promise<Blob> {
  let result = ''
  dataSource.entitySchema?.fields.forEach((f, i) => {
    result += f.name
    if (i < dataSource.entitySchema!.fields.length - 1) {
      result += '\t'
    }
  })
  result += '\r\n'
  return exportToSvInternal(dataSource, filter, sortingParams, 1, result, '\t')
}

export function exportTableToCsv(
  dataSource: IDataSource,
  filter: LogicalExpression,
  sortingParams: SortingField[],
  columns: TableColumn[],
): Promise<Blob> {
  let result = ''
  columns.forEach((c, i) => {
    result += c.label
    if (i < columns.length - 1) {
      result += ';'
    }
  })
  result += '\r\n'
  return exportTableToSvInternal(dataSource, filter, sortingParams, columns, 1, result, ';')
}

export function exportTableToTsv(
  dataSource: IDataSource,
  filter: LogicalExpression,
  sortingParams: SortingField[],
  columns: TableColumn[],
): Promise<Blob> {
  let result = ''
  columns.forEach((c, i) => {
    result += c.label
    if (i < columns.length - 1) {
      result += '\t'
    }
  })
  result += '\r\n'
  return exportTableToSvInternal(dataSource, filter, sortingParams, columns, 1, result, '\t')
}

function exportTableToSvInternal(
  dataSource: IDataSource,
  filter: LogicalExpression,
  sortingParams: SortingField[],
  columns: TableColumn[],
  pageNumber: number,
  currentResult: string,
  separator: string,
): Promise<Blob> {
  return dataSource
    .getRecords(filter, { pageNumber: pageNumber, pageSize: chunkSize }, sortingParams)
    .then((pl) => {
      if (pl.total == 0 || pageNumber > maxPageNumber) {
        var data: Blob = new Blob([currentResult], { type: 'text/plain' })
        return data
      }

      const pageResult: string = serializeTableToSv(pl.page, separator, columns)
      currentResult += pageResult
      return exportTableToSvInternal(
        dataSource,
        filter,
        sortingParams,
        columns,
        pageNumber + 1,
        currentResult,
        separator,
      )
    })
}

function serializeTableToSv(page: any[], separator: string, columns: TableColumn[]): string {
  let result = ''

  page.forEach((r, i) => {
    let line: string = ''
    columns.forEach((c, j) => {
      const cellValue: any =
        c.fieldName in r
          ? r[c.fieldName]
          : lowerFirstLetter(c.fieldName) in r
          ? r[lowerFirstLetter(c.fieldName)]
          : capitalizeFirstLetter(c.fieldName) in r
          ? r[capitalizeFirstLetter(c.fieldName)]
          : undefined

      const cellValueDisply = c.onRenderCell
        ? c.onRenderCell(cellValue, r)
        : cellValue == undefined
        ? ''
        : cellValue

      line += cellValueDisply
      if (j < columns.length - 1) {
        line += separator
      }
    })

    result += line
    result += '\r\n'
  })

  return result
}

function exportToSvInternal(
  dataSource: IDataSource,
  filter: LogicalExpression,
  sortingParams: SortingField[],
  pageNumber: number,
  currentResult: string,
  separator: string,
): Promise<Blob> {
  return dataSource
    .getRecords(filter, { pageNumber: pageNumber, pageSize: chunkSize }, sortingParams)
    .then((pl) => {
      if (pl.total == 0 || pageNumber > maxPageNumber) {
        var data: Blob = new Blob([currentResult], { type: 'text/plain' })
        return data
      }

      const pageResult: string = serializeToSv(pl.page, separator)
      currentResult += pageResult
      return exportToSvInternal(
        dataSource,
        filter,
        sortingParams,
        pageNumber + 1,
        currentResult,
        separator,
      )
    })
}

function serializeToSv(page: any[], separator: string): string {
  let result = ''
  page.forEach((r, i) => {
    let line: string = ''
    const props: string[] = Object.keys(r)
    const numberProps: number = props.length
    Object.keys(r).forEach((k, j) => {
      line += r[k]
      if (j < numberProps - 1) {
        line += separator
      }
    })
    result += line
    result += '\r\n'
  })
  return result
}

export const saveFile = async (blob: any) => {
  const a = document.createElement('a')
  a.download = 'my-file.txt'
  a.href = URL.createObjectURL(blob)
  a.addEventListener('click', (e) => {
    setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000)
  })
  a.click()
}
