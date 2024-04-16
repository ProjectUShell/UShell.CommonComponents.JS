import { LogicalExpression } from 'fusefx-repositorycontract'

export function getSelectedValues(filter: LogicalExpression): any[] {
  if (!filter || !filter.predicates || filter.predicates.length == 0) {
    return []
  }
  // if (filter.predicates[0].operator != 'in') {
  return []
  // }
  // return filter.predicates[0].value
}
