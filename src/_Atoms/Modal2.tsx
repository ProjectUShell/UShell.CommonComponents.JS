import React, { useEffect, useState } from 'react'
import XMark from '../components/shell-layout/_Icons/XMark'

const Modal2: React.FC<{
  title: string
  terminate?: (() => void) | undefined
  children: any
  top?: string | undefined
  bottom?: string | undefined
  left?: string | undefined
  right?: string | undefined
  width?: string | undefined
  height?: string | undefined
}> = ({
  title,
  terminate,
  children,
  top = '20px',
  bottom,
  left = '20%',
  right = '20%',
  width,
  height,
}) => {
  const [full, setFull] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setFull(true)
    }, 1)
  }, [])
  return (
    <div
      className='UShell_Modal fixed top-0 left-0 right-0 bottom-0
        z-40 w-full h-full bg-black bg-transparent1 bg-opacity-50 border-0 border-red-400 justify-center items-center'
    >
      <div
        style={{
          top: top,
          bottom: '20px',
          left: left,
          right: right,
          width: width,
          height: height,
          maxHeight: '90%',
          transform:
            'translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))',
        }}
        className={`fixed flex flex-col bg-content dark:bg-contentDark transition-all duration-300 border-0 border-green-400 ${
          full ? '' : 'scale-50'
        }`}
      >
        <div className='h-full flex flex-col overflow-hidden flex-grow border-0 border-blue-400 p-1 px-2'>
          <div className='w-full flex whitespace-nowrap'>
            <div className='align-middle font-medium py-2'>{title}</div>
            {terminate && (
              <div className='bg-opacity-0 w-full bg-red-400 py-2 flex justify-end'>
                <button
                  className='bg-opacity-100 text-opacity-100
                   bg-bg1 text-black dark:bg-bg1dark
                    hover:text-black dark:hover:text-black hover:bg-bg4 dark:hover:bg-bg4dark rounded-full'
                  onClick={() => terminate()}
                >
                  <XMark></XMark>
                </button>
              </div>
            )}
          </div>
          <div className='flex fle1x-col overflow-hidden flex-grow border-0 border-orange-400'>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal2
