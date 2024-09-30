import React, { useEffect, useState } from 'react'
import RelationEditor from './RelationEditor'
import { FieldSchema, RelationSchema } from 'fusefx-modeldescription'
import { LogicalExpression } from 'fusefx-repositorycontract'
import TrashIcon from '../../../_Icons/TrashIcon'
import { getEmptyRelationElement, isRelationValid } from '../ExpressionService'
import { FieldPredicate } from 'fusefx-repositorycontract/lib/FieldPredicate'
import ChevrodnDownIcon from '../../../_Icons/ChevrodnDownIcon'
import { IDataSourceManagerBase } from 'ushell-modulebase'
import { IDataSourceManagerWidget } from '../_Templates/IDataSourceManagerWidget'

const LogicalExpressionTree: React.FC<{
  expression: LogicalExpression
  onUpdateExpression: (e: LogicalExpression) => void
  fields: FieldSchema[]
  fkRelations: RelationSchema[]
  dataSourceManager: IDataSourceManagerWidget
}> = ({ expression, fields, fkRelations, onUpdateExpression, dataSourceManager }) => {
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
    if (e.predicates.length == 0 && e.subTree.length == 0) {
      expression.subTree.splice(index, 1)
    } else {
      expression.subTree[index] = e
    }
    if (expression.predicates.length == 0 && expression.subTree.length == 1) {
      expression.predicates = expression.subTree[0].predicates
      expression.subTree = []
    }
    onUpdateExpression({ ...expression })
    console.log('expression', expression)
  }

  function appendRelation(
    r: FieldPredicate,
    index: number,
    operator: 'or' | 'and' | 'not' | 'atom' | '',
  ) {
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
      expression.subTree.unshift(newExpressionArgument)
      onUpdateExpression({ ...expression })
    }
  }

  // console.log('expression LE', expression)

  return (
    <div className='bg-bg1 dark:bg-bg1dark p-2 rounded-md text-sm'>
      <div className='-ml-3'>
        <ChevrodnDownIcon rotate={135} size={4}></ChevrodnDownIcon>
      </div>

      {expression.predicates.map((a, i) => (
        <div key={i}>
          {i > 0 && <div>{expression.matchAll ? 'and' : 'or'}</div>}
          <div className='flex gap-1'>
            <RelationEditor
              fields={fields}
              fkRelations={fkRelations}
              initialRelation={a}
              onUpdateRelation={(r: FieldPredicate) => onRelationUpdated(r, i)}
              dataSourceManager={dataSourceManager}
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
      {expression.predicates.length > 0 && expression.subTree.length > 0 && (
        <div>{expression.matchAll ? 'and' : 'or'}</div>
      )}
      {expression.subTree.map((e, i) => (
        <div key={i}>
          {i > 0 && <div>{expression.matchAll ? 'and' : 'or'}</div>}
          <LogicalExpressionTree
            fields={fields}
            fkRelations={fkRelations}
            expression={e}
            onUpdateExpression={(e: LogicalExpression) => onExpressionUpdated(e, i)}
            dataSourceManager={dataSourceManager}
          ></LogicalExpressionTree>
        </div>
      ))}
      <div className='-ml-3'>
        <ChevrodnDownIcon rotate={45} size={4}></ChevrodnDownIcon>
      </div>
    </div>
  )
}

export default LogicalExpressionTree
