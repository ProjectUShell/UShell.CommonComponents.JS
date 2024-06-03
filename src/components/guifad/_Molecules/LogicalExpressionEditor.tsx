import React, { useEffect, useState } from 'react'
import { FieldSchema, RelationSchema } from 'fusefx-modeldescription'
import { LogicalExpression } from 'fusefx-repositorycontract'
import TrashIcon from '../../../_Icons/TrashIcon'
import LogicalExpressionTree from './LogicalExpressionTree'
import { getEmptyExpression, isExpressionValid } from '../ExpressionService'
import { FieldPredicate } from 'fusefx-repositorycontract/lib/FieldPredicate'
import { IDataSourceManagerBase } from 'ushell-modulebase'

function getCopy(e: LogicalExpression | null): LogicalExpression {
  if (e == null) {
    return getEmptyExpression()
  }
  const result: LogicalExpression = new LogicalExpression()
  result.matchAll = e.matchAll
  result.negate = e.negate
  result.predicates = []
  result.subTree = []

  for (let i = 0; i < e.predicates.length; i++) {
    const atomArgument = new FieldPredicate()
    atomArgument.fieldName = e.predicates[i].fieldName
    atomArgument.operator = e.predicates[i].operator
    atomArgument.value = e.predicates[i].value
    result.predicates.push(atomArgument)
  }
  for (let i = 0; i < e.subTree.length; i++) {
    result.subTree.push(getCopy(e.subTree[i]))
  }
  return result
}

const LogicalExpressionEditor: React.FC<{
  intialExpression: LogicalExpression | null
  onUpdateExpression: (e: LogicalExpression) => void
  fields: FieldSchema[]
  fkRelations: RelationSchema[]
  dataSourceManager: IDataSourceManagerBase
}> = ({ intialExpression, fields, fkRelations, onUpdateExpression, dataSourceManager }) => {
  console.log('LogicalExpressionEditor dataSourceManager', dataSourceManager)
  const [originalExpression, setOriginalExpression] = useState<LogicalExpression | null>(
    getCopy(intialExpression),
  )
  const [expression, setExpression] = useState<LogicalExpression>()

  useEffect(() => {
    setExpression(intialExpression ? getCopy(intialExpression) : getEmptyExpression())
  }, [intialExpression])

  if (!expression) return <div>Nein</div>

  console.log('expression LE1', expression)
  // console.log('initialExpression LE1', intialExpression)
  return (
    <div
      className='bg-bg2 dark:bg-bg1dark p-2 rounded-md shadow-md'
      onKeyDown={(e) => {
        if (e.key == 'Enter' && isExpressionValid(expression)) {
          onUpdateExpression(expression!)
        }
      }}
    >
      <LogicalExpressionTree
        fields={fields}
        fkRelations={fkRelations}
        onUpdateExpression={(e) => {
          setExpression(e)
        }}
        expression={expression}
        dataSourceManager={dataSourceManager}
      ></LogicalExpressionTree>
      <div className='flex gap-1 justify-end border-t pt-1 border-gray-400'>
        <button
          className='bg-backgroundthree dark:bg-backgroundthreedark p-1 rounded-md disabled:text-gray-400'
          onClick={(e) => {
            setExpression(originalExpression ? getCopy(originalExpression) : getEmptyExpression())
          }}
        >
          Cancel
        </button>
        <button
          className='bg-backgroundthree dark:bg-backgroundthreedark p-1 rounded-md disabled:text-gray-400'
          disabled={!isExpressionValid(expression)}
          onClick={(e) => {
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
