import React, { useEffect, useState } from 'react'
import RelationEditor from './RelationEditor'
import { FieldSchema } from 'fusefx-modeldescription'
import { LogicalExpression } from 'fusefx-repositorycontract'
import TrashIcon from '../../../_Icons/TrashIcon'
import { getEmptyRelationElement, isRelationValid } from '../ExpressionService'
import { FieldPredicate } from 'fusefx-repositorycontract/lib/FieldPredicate'

const LogicalExpressionTree: React.FC<{
  expression: LogicalExpression
  onUpdateExpression: (e: LogicalExpression) => void
  fields: FieldSchema[]
}> = ({ expression, fields, onUpdateExpression }) => {
  function onRelationUpdated(r: FieldPredicate, index: number) {
    expression.predicates[index] = r
    onUpdateExpression({ ...expression })
  }

  function deleteRelation(index: number) {
    const newAtomArguments: FieldPredicate[] = []
    expression.predicates.forEach((r, i) => {
      if (i !== index) {
        newAtomArguments.push(r)
      }
    })
    expression.predicates = newAtomArguments
    onUpdateExpression(expression)
  }

  function onExpressionUpdated(e: LogicalExpression, index: number) {
    expression.subTree[index] = e
    onUpdateExpression({ ...expression })
    console.log('expression', expression)
  }

  function appendRelation(r: FieldPredicate, index: number, operator: 'or' | 'and' | 'not' | 'atom' | '') {
    if ((expression.matchAll ? 'and' : 'or') == operator) {
      expression.predicates.push(getEmptyRelationElement())
      onUpdateExpression({ ...expression })
    } else {
      const newExpressionArgument: LogicalExpression = {
        subTree: [],
        predicates: [r, getEmptyRelationElement()],
        matchAll: operator == 'and',
        negate: operator == 'not',
      }
      const newAtomArguments: FieldPredicate[] = []
      expression.predicates.forEach((r, i) => {
        if (i !== index) {
          newAtomArguments.push(r)
        }
      })
      expression.predicates = newAtomArguments
      expression.subTree.push(newExpressionArgument)
      onUpdateExpression({ ...expression })
    }
  }

  console.log('expression LE', expression)

  return (
    <div className='bg-backgroundone dark:bg-backgroundonedark p-2 rounded-md text-sm'>
      {expression.predicates.map((a, i) => (
        <div key={i}>
          {i > 0 && <div>{expression.matchAll ? 'and' : 'or'}</div>}
          <div className='flex gap-1'>
            <RelationEditor
              fields={fields}
              initialRelation={a}
              onUpdateRelation={(r: FieldPredicate) => onRelationUpdated(r, i)}
            ></RelationEditor>

            {isRelationValid(a) && (
              <>
                <button className='text-red-400' onClick={(e) => deleteRelation(i)}>
                  <TrashIcon></TrashIcon>
                </button>
                <button className='underline' onClick={(e) => appendRelation(a, i, 'and')}>
                  And
                </button>
                <button className='underline' onClick={(e) => appendRelation(a, i, 'or')}>
                  Or
                </button>
              </>
            )}
          </div>
        </div>
      ))}
      {expression.predicates.length >= 0 && expression.subTree.length > 0 && (
        <div>{expression.matchAll ? 'and' : 'or'}</div>
      )}
      {expression.subTree.map((e, i) => (
        <div key={i}>
          {i > 0 && <div>{expression.matchAll ? 'and' : 'or'}</div>}
          <LogicalExpressionTree
            fields={fields}
            expression={e}
            onUpdateExpression={(e: LogicalExpression) => onExpressionUpdated(e, i)}
          ></LogicalExpressionTree>
        </div>
      ))}
    </div>
  )
}

export default LogicalExpressionTree