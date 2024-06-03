import { LogicalExpression } from 'fusefx-repositorycontract'
import React, { useEffect, useState } from 'react'
import Tooltip from '../../../_Atoms/Tooltip'
import BookmarkSquareIcon from '../../../_Icons/BookmarkSquareIcon'
import DropdownButton from '../../../_Atoms/DropdownButton'
import TrashIcon from '../../../_Icons/TrashIcon'

const QueryLibrary: React.FC<{
  entityName: string
  expressions: LogicalExpression[]
  applySavedQuery: (query: LogicalExpression[]) => void
}> = ({ entityName, expressions, applySavedQuery }) => {
  const [currentName, setCurrentName] = useState('')
  const [queryLib, setQueryLib] = useState<{ [queryName: string]: LogicalExpression[] }>(
    loadQueryLib(),
  )

  function loadQueryLib(): { [queryName: string]: LogicalExpression[] } {
    const localStoreId: string = 'QueryLib_' + entityName
    const queryLibString: string | null = localStorage.getItem(localStoreId)
    if (!queryLibString) return {}
    return JSON.parse(queryLibString)
  }

  function saveCurrentQuery() {
    const localStoreId: string = 'QueryLib_' + entityName
    setQueryLib((ql: any) => {
      const newQl: any = { ...ql }
      newQl[currentName] = expressions
      localStorage.setItem(localStoreId, JSON.stringify(newQl))
      return newQl
    })
    setCurrentName('')
  }

  function deleteQuery(queryName: string) {
    const localStoreId: string = 'QueryLib_' + entityName
    setQueryLib((ql: any) => {
      const newQl: any = { ...ql }
      delete newQl[queryName]
      localStorage.setItem(localStoreId, JSON.stringify(newQl))
      return newQl
    })
  }

  return (
    <DropdownButton
      rightOffset={1}
      topOffset={1}
      buttonContent={
        <BookmarkSquareIcon
          size={6}
          className='hover:bg-bg4 dark:hover:bg-bg3dark rounded-sm p-0.5'
        ></BookmarkSquareIcon>
      }
    >
      <div className='border dark:border-bg3dark'>
        <div className='bg-bg2 dark:bg-backgroundonedark p-2 z-50'>
          Use a saved query
          <div className='w-full border my-1 border-backgroundthree dark:border-backgroundthreedark'></div>
        </div>

        <div className='bg-bg2  dark:bg-backgroundonedark pb-1'>
          <div>
            {Object.keys(queryLib).map((queryName: string) => (
              <div
                key={queryName}
                className='hover:bg-hoverItem dark:hover:bg-backgroundthreedark
                w-full p-1 flex justify-between align-middle items-center cursor-pointer'
                onClick={() => applySavedQuery(queryLib[queryName])}
              >
                {queryName}
                <button
                  className='hover:text-red-300'
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    deleteQuery(queryName)
                  }}
                >
                  <TrashIcon></TrashIcon>
                </button>
              </div>
            ))}
          </div>
          <div className='w-full border my-1 border-backgroundthree dark:border-backgroundthreedark'></div>
          <div className='flex items-center align-middle gap-1 px-1'>
            <input
              className='p-1 outline-none bg-bg1 dark:bg-backgroundfourdark'
              placeholder='Save current Query'
              value={currentName}
              onChange={(e: any) => setCurrentName(e.target.value)}
            ></input>
            <button
              disabled={currentName == '' || expressions.length == 0}
              className='enabled:hover:bg-hoverItem enabled:dark:hover:bg-backgroundthreedark p-1 rounded-sm'
              onClick={() => saveCurrentQuery()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </DropdownButton>
  )

  return (
    <button
      id='SaveQueryButton'
      className={`hover:bg-backgroundthree hover:dark:bg-backgroundthreedark p-1 rounded-md ${
        expressions.length > 0 ? 'text-blue-600 dark:text-blue-400' : ''
      }`}
      onClick={() => saveCurrentQuery()}
    >
      <Tooltip targetId='SaveQueryButton'>
        <div className='text-textone dark:text-textonedark'>Save Current Query</div>
      </Tooltip>
    </button>
  )
}

export default QueryLibrary
