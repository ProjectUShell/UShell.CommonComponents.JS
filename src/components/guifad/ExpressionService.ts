import { LogicalExpression } from 'fusefx-repositorycontract'
import { FieldPredicate } from 'fusefx-repositorycontract/lib/FieldPredicate'

export function isExpressionValid(e: LogicalExpression | null | undefined) {
  if (!e) {
    return false
  }
  for (const r of e.predicates) {
    if (!isRelationValid(r)) {
      return false
    }
  }
  for (const r of e.subTree) {
    if (!isExpressionValid(r)) {
      return false
    }
  }
  return true
}

export function isRelationValid(r: FieldPredicate) {
  return r.fieldName && r.operator
}

export function getEmptyRelationElement(): FieldPredicate {
  const result = new FieldPredicate()
  result.valueSerialized = ''
  return result
}
export function getEmptyExpression(): LogicalExpression {
  const result = new LogicalExpression()
  result.subTree = []
  result.predicates = [getEmptyRelationElement()]
  return result
}
