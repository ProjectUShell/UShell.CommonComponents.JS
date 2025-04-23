import React, { useEffect, useState } from 'react'
import { FieldSchema, RelationSchema } from 'fusefx-modeldescription'
import { LogicalExpression } from 'fusefx-repositorycontract'
import TrashIcon from '../../../_Icons/TrashIcon'
import LogicalExpressionTree from './LogicalExpressionTree'
import { getEmptyExpression, isExpressionValid } from '../ExpressionService'
import { FieldPredicate } from 'fusefx-repositorycontract/lib/FieldPredicate'
import { IDataSourceManagerBase } from 'ushell-modulebase'
import { IDataSourceManagerWidget } from '../_Templates/IDataSourceManagerWidget'

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
    atomArgument.valueSerialized = e.predicates[i].valueSerialized
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
  dataSourceManagerForNavigations?: IDataSourceManagerWidget
  classNameBg?: string
  classNameBgInput?: string
  classNameBgInputHover?: string
  classNameBgInputHoverDark?: string
}> = ({
  intialExpression,
  fields,
  fkRelations,
  onUpdateExpression,
  dataSourceManagerForNavigations,
  classNameBg,
  classNameBgInput,
  classNameBgInputHover,
  classNameBgInputHoverDark,
}) => {
  const [originalExpression, setOriginalExpression] = useState<LogicalExpression | null>(
    getCopy(intialExpression),
  )
  const [expression, setExpression] = useState<LogicalExpression>()

  useEffect(() => {
    setExpression(intialExpression ? getCopy(intialExpression) : getEmptyExpression())
  }, [intialExpression])

  if (!expression) return <div>Nein</div>

  return (
    <div
      className={`UShell_LogicalExpressionEditor border-2 dark:border-bg7dark p-2 rounded-md shadow-md ${
        classNameBg || ''
      } `}
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
        dataSourceManagerForNavigations={dataSourceManagerForNavigations}
        classNameBg={classNameBg}
        classNameBgInput={classNameBgInput}
        classNameBgInputHover={classNameBgInputHover}
        classNameBgInputHoverDark={classNameBgInputHoverDark}
      ></LogicalExpressionTree>
      <div className='flex gap-1 justify-end border-t pt-1 border-contetBorder dark:border-navigationBorderDark'>
        <button
          className='hover:bg-contentHover hover:dark:bg-contentHoverDark p-1 rounded-md disabled:text-gray-400'
          onClick={(e) => {
            setExpression(originalExpression ? getCopy(originalExpression) : getEmptyExpression())
          }}
        >
          Cancel
        </button>
        <button
          className='hover:bg-contentHover hover:dark:bg-contentHoverDark p-1 rounded-md disabled:text-gray-400'
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
