import { LogicalExpression } from 'fusefx-repositorycontract'

export function getSelectedValues(filter: LogicalExpression): any[] {
  if (!filter || !filter.atomArguments || filter.atomArguments.length == 0) {
    return []
  }
  if (filter.atomArguments[0].relation != 'in') {
    return []
  }
  return filter.atomArguments[0].value
}
