import React, { useEffect, useState } from 'react'
import RelationEditor from './RelationEditor'
import { FieldSchema } from 'fusefx-modeldescription'
import { RelationElement, LogicalExpression } from 'fusefx-repositorycontract'
import TrashIcon from '../../../_Icons/TrashIcon'
import { getEmptyRelationElement, isRelationValid } from '../ExpressionService'

const LogicalExpressionTree: React.FC<{
  expression: LogicalExpression
  onUpdateExpression: (e: LogicalExpression) => void
  fields: FieldSchema[]
}> = ({ expression, fields, onUpdateExpression }) => {
  function onRelationUpdated(r: RelationElement, index: number) {
    expression.atomArguments[index] = r
    onUpdateExpression({ ...expression })
    console.log('expression', expression)
    console.log('valid?', r)
  }

  function deleteRelation(index: number) {
    const newAtomArguments: RelationElement[] = []
    expression.atomArguments.forEach((r, i) => {
      if (i !== index) {
        newAtomArguments.push(r)
      }
    })
    expression.atomArguments = newAtomArguments
    onUpdateExpression(expression)
  }

  function onExpressionUpdated(e: LogicalExpression, index: number) {
    expression.expressionArguments[index] = e
    onUpdateExpression({ ...expression })
    console.log('expression', expression)
  }

  function appendRelation(r: RelationElement, index: number, operator: 'or' | 'and' | 'not' | 'atom' | '') {
    if (expression.operator == operator) {
      expression.atomArguments.push(getEmptyRelationElement())
      onUpdateExpression({ ...expression })
    } else {
      const newExpressionArgument: LogicalExpression = {
        expressionArguments: [],
        atomArguments: [r, getEmptyRelationElement()],
        operator: operator,
      }
      const newAtomArguments: RelationElement[] = []
      expression.atomArguments.forEach((r, i) => {
        if (i !== index) {
          newAtomArguments.push(r)
        }
      })
      expression.atomArguments = newAtomArguments
      expression.expressionArguments.push(newExpressionArgument)
      onUpdateExpression({ ...expression })
    }
  }

  console.log('expression LE', expression)

  return (
    <div className='bg-backgroundone dark:bg-backgroundonedark p-2 rounded-md text-sm'>
      {expression.atomArguments.map((a, i) => (
        <div key={i}>
          {i > 0 && <div>{expression.operator}</div>}
          <div className='flex gap-1'>
            <RelationEditor
              fields={fields}
              initialRelation={a}
              onUpdateRelation={(r: RelationElement) => onRelationUpdated(r, i)}
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
      {expression.atomArguments.length >= 0 && expression.expressionArguments.length > 0 && (
        <div>{expression.operator}</div>
      )}
      {expression.expressionArguments.map((e, i) => (
        <div key={i}>
          {i > 0 && <div>{expression.operator}</div>}
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
