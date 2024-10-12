import React, { useEffect, useState } from 'react'
import XMark from '../components/shell-layout/_Icons/XMark'

const Modal: React.FC<{
  terminate?: (() => void) | undefined
  children: any
  marginY?: number
  marginX?: number
}> = ({ terminate, children, marginY = 10, marginX = 20 }) => {
  const [full, setFull] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setFull(true)
    }, 1)
  }, [])
  return (
    <div
      className='fixed top-0 left-0 right-0 bottom-0
     z-40 w-full h-full bg-black bg-transparent1 bg-opacity-50 border-0 border-red-400'
    >
      <div
        style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}
        className={`${
          full ? 'w1-fit h1-fit' : 'w1-24 h1-24'
        } fixed bg-opacity-100 z-50  border-0 border-blue-400 transition-all duration-1000`}
      >
        {terminate && (
          <div className='bg-opacity-0 w-full bg-red-400 py-2 flex justify-end'>
            <button
              className='bg-opacity-100 text-opacity-100 bg-bg10 text-black dark:bg-bg1dark hover:bg-bg5 dark:hover:bg-bg5dark rounded-full'
              onClick={() => terminate()}
            >
              <XMark></XMark>
            </button>
          </div>
        )}
        <div
          className={`${
            full ? 'scale-100' : 'scale-50'
          }  bg-bg1 border-0 border-bg4 dark:bg-bg1dark dark:border-bg4dark shadow-md rounded-sm transition-all`}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
