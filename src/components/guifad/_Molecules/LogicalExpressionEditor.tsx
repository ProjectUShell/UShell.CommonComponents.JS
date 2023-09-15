import React, { useEffect, useState } from 'react'
import { LogicalExpression } from '../../../fusefx-repositorycontract/LogicalExpression'
import RelationEditor from './RelationEditor'
import { FieldSchema } from 'fusefx-modeldescription'
import { RelationElement } from '../../../fusefx-repositorycontract/RelationElement'
import TrashIcon from '../../../_Icons/TrashIcon'

function isRelationValid(r: RelationElement) {
  console.log('valid?', r)
  return r.propertyName && r.relation
}

function getEmptyExpression(): LogicalExpression {
  return {
    expressionArguments: [],
    atomArguments: [getEmptyRelationElement()],
    operator: '',
  }
}
function getEmptyRelationElement(): RelationElement {
  return { propertyName: '', propertyType: '', relation: '', value: '' }
}

function getCopy(e: LogicalExpression): LogicalExpression {
  const result: LogicalExpression = { ...e }
  for (let i = 0; i < result.atomArguments.length; i++) {
    result.atomArguments[i] = { ...result.atomArguments[i] }
  }
  for (let i = 0; i < result.expressionArguments.length; i++) {
    result.expressionArguments[i] = getCopy(result.expressionArguments[i])
  }
  return result
}

const LogicalExpressionEditor: React.FC<{
  intialExpression?: LogicalExpression
  onUpdateExpression: (e: LogicalExpression) => void
  fields: FieldSchema[]
}> = ({ intialExpression, fields, onUpdateExpression }) => {
  const [expression, setExpression] = useState<LogicalExpression | null>(null)

  useEffect(() => {
    console.log('initialExpression changed LE1', intialExpression)
    setExpression(
      intialExpression
        ? getCopy(intialExpression)
        : {
            expressionArguments: [],
            atomArguments: [getEmptyRelationElement()],
            operator: '',
          },
    )
  }, [intialExpression])

  if (!expression) return <div>Nein</div>

  function isExpressionValid(e: LogicalExpression | null | undefined) {
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
  console.log('expression LE1', expression)
  console.log('initialExpression LE1', intialExpression)
  return (
    <div
      className='bg-backgroundone dark:bg-backgroundonedark p-2 rounded-md shadow-md'
      onKeyDown={(e) => {
        if (e.key == 'Enter' && isExpressionValid(expression)) {
          console.log('finish LE1')
          onUpdateExpression(expression!)
        }
      }}
    >
      <LogicalExpressionEditor1
        fields={fields}
        onUpdateExpression={(e) => {
          console.log('onUpdateExpression LE1', e)
          setExpression(e)
        }}
        expression={expression}
      ></LogicalExpressionEditor1>
      <div className='flex gap-1 justify-end border-t pt-1 border-gray-400'>
        <button
          className='bg-backgroundthree dark:bg-backgroundthreedark p-1 rounded-md disabled:text-gray-400'
          disabled={!isExpressionValid(expression)}
          onClick={(e) => {
            console.log('cancel', intialExpression)
            setExpression(intialExpression ? getCopy(intialExpression) : getEmptyExpression())
          }}
        >
          Cancel
        </button>
        <button
          className='bg-backgroundthree dark:bg-backgroundthreedark p-1 rounded-md disabled:text-gray-400'
          disabled={!isExpressionValid(expression)}
          onClick={(e) => {
            console.log('finish LE1')
            onUpdateExpression(expression!)
          }}
        >
          Apply
        </button>
      </div>
    </div>
  )
}

const LogicalExpressionEditor1: React.FC<{
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
      <div>{expression.operator}</div>
      {expression.atomArguments.map((a, i) => (
        <div key={i} className='flex gap-1'>
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
      ))}
      {expression.expressionArguments.map((e, i) => (
        <LogicalExpressionEditor1
          key={i}
          fields={fields}
          expression={e}
          onUpdateExpression={(e: LogicalExpression) => onExpressionUpdated(e, i)}
        ></LogicalExpressionEditor1>
      ))}
    </div>
  )
}

export default LogicalExpressionEditor
