import { LogicalExpression, RelationElement } from 'fusefx-repositorycontract'

export function isExpressionValid(e: LogicalExpression | null | undefined) {
  if (!e) {
    return false
  }
  for (const r of e.atomArguments) {
    if (!isRelationValid(r)) {
      return false
    }
  }
  for (const r of e.expressionArguments) {
    if (!isExpressionValid(r)) {
      return false
    }
  }
  return true
}

export function isRelationValid(r: RelationElement) {
  console.log('valid?', r)
  return r.propertyName && r.relation
}

export function getEmptyRelationElement(): RelationElement {
  const result = new RelationElement()
  result.value = ''
  return result
}
export function getEmptyExpression(): LogicalExpression {
  const result = new LogicalExpression()
  result.expressionArguments = []
  result.atomArguments = [getEmptyRelationElement()]
  result.operator = ''
  return result
}
