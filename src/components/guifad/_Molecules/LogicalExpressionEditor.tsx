import React, { useEffect, useState } from 'react'
import { FieldSchema } from 'fusefx-modeldescription'
import { RelationElement, LogicalExpression } from 'fusefx-repositorycontract'
import TrashIcon from '../../../_Icons/TrashIcon'
import LogicalExpressionTree from './LogicalExpressionTree'
import { getEmptyExpression, isExpressionValid } from '../ExpressionService'

function getCopy(e: LogicalExpression | null): LogicalExpression {
  if (e == null) {
    return getEmptyExpression()
  }
  const result: LogicalExpression = new LogicalExpression()
  result.atomArguments = []
  result.expressionArguments = []
  result.operator = e.operator
  for (let i = 0; i < e.atomArguments.length; i++) {
    const atomArgument = new RelationElement()
    atomArgument.propertyName = e.atomArguments[i].propertyName
    atomArgument.propertyType = e.atomArguments[i].propertyType
    atomArgument.relation = e.atomArguments[i].relation
    atomArgument.value = e.atomArguments[i].value
    result.atomArguments.push(atomArgument)
  }
  for (let i = 0; i < e.expressionArguments.length; i++) {
    result.expressionArguments.push(getCopy(e.expressionArguments[i]))
  }
  return result
}

const LogicalExpressionEditor: React.FC<{
  intialExpression: LogicalExpression | null
  onUpdateExpression: (e: LogicalExpression) => void
  fields: FieldSchema[]
}> = ({ intialExpression, fields, onUpdateExpression }) => {
  const [originalExpression, setOriginalExpression] = useState<LogicalExpression | null>(getCopy(intialExpression))
  const [expression, setExpression] = useState<LogicalExpression>()

  useEffect(() => {
    setExpression(intialExpression ? getCopy(intialExpression) : getEmptyExpression())
  }, [intialExpression])

  if (!expression) return <div>Nein</div>

  // console.log('expression LE1', expression)
  // console.log('initialExpression LE1', intialExpression)
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
      <LogicalExpressionTree
        fields={fields}
        onUpdateExpression={(e) => {
          console.log('onUpdateExpression LE1', e)
          setExpression(e)
        }}
        expression={expression}
      ></LogicalExpressionTree>
      <div className='flex gap-1 justify-end border-t pt-1 border-gray-400'>
        <button
          className='bg-backgroundthree dark:bg-backgroundthreedark p-1 rounded-md disabled:text-gray-400'
          onClick={(e) => {
            console.log('cancel LE1', originalExpression)
            setExpression(originalExpression ? getCopy(originalExpression) : getEmptyExpression())
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

export default LogicalExpressionEditor
