import React from 'react'
import XMark from '../components/shell-layout/_Icons/XMark'

const Modal: React.FC<{
  terminate: () => void
  children: any
  margin?: number
}> = ({ terminate, children, margin = 10 }) => {
  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 z-40 w-full h-full bg-black bg-transparent1 bg-opacity-50'>
      <div
        style={{ top: `${margin}%`, bottom: `${margin}%`, left: `${margin}%`, right: `${margin}%` }}
        className='fixed bg-opacity-100 z-50
       '
      >
        <div className='bg-opacity-0 w-full bg-red-400 py-2 flex justify-end'>
          <button
            className='bg-opacity-100 text-opacity-100 bg-bg10 text-black dark:bg-bg1dark hover:bg-bg5 dark:hover:bg-bg5dark rounded-full'
            onClick={() => terminate()}
          >
            <XMark></XMark>
          </button>
        </div>
        <div className=' w-full h-full bg-bg1 border-2 border-bg4 dark:bg-bg1dark dark:border-bg4dark shadow-md p-1 rounded-sm'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
