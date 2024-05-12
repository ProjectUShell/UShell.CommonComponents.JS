import React from 'react'
import ArrowLeftStartOnRectangle from '../../../_Icons/ArrowLeftStartOnRectangle'
import ArrowRightStartOnRectangle from '../../../_Icons/ArrowRightStartOnRectangle'

const EditorToolbar: React.FC<{
  schemaName: string
  showProperties: boolean
  setShowProperties: (v: boolean) => void
}> = ({ showProperties, setShowProperties }) => {
  return (
    <div
      className='bg-bg3 dark:bg-bg3dark w-full relative py-1 flex justify-between
      items-center border-b border-bg4 dark:border-bg4dark'
    >
      <div className='px-2'>
        <input className='bg-bg2 dark:bg-bg2dark'></input>
      </div>
      <button
        className='p-1 rounded-sm mx-2 hover:bg-bg4 dark:hover:bg-bg4dark'
        onClick={() => setShowProperties(!showProperties)}
      >
        {!showProperties ? (
          <ArrowLeftStartOnRectangle></ArrowLeftStartOnRectangle>
        ) : (
          <ArrowRightStartOnRectangle></ArrowRightStartOnRectangle>
        )}
      </button>
    </div>
  )
}

export default EditorToolbar
