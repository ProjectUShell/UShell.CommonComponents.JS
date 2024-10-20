import React, { useEffect, useState } from 'react'
import XMark from '../components/shell-layout/_Icons/XMark'

const Modal: React.FC<{
  title: string
  terminate?: (() => void) | undefined
  children: any
  marginY?: number
  marginX?: number
}> = ({ title, terminate, children, marginY = 10, marginX = 20 }) => {
  const [full, setFull] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setFull(true)
    }, 1)
  }, [])
  return (
    <div
      className='UShell_Modal fixed top-0 left-0 right-0 bottom-0
        z-40 w-full h-full bg-black bg-transparent1 bg-opacity-50 border-0 border-red-400'
    >
      <div
        style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}
        className={`UShell_Modal_Inner ${
          full ? '' : ''
        } fixed bg-opacity-100 z-50  border-0 border-blue-400 transition-all duration-300 max-h-full overflow-hidden flex flex-col rounded-md`}
      >
        <div
          style={{
            transform:
              'translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))',
          }}
          className={`${
            full ? 'scale-100' : 'scale-50 rounded-sm'
          }   shadow-md1 rounded-sm bg-bg1 dark:bg-bg1dark transition-all duration-500`}
        >
          <div
            className={`w-full border-b dark:border-bg9dark bg-bg1 dark:bg-bg1dark flex whitespace-nowrap items-center px-2`}
          >
            <div className='align-middle font-medium py-2'>{title}</div>
            {terminate && (
              <div className='bg-opacity-0 w-full bg-red-400 py-2 flex justify-end'>
                <button
                  className='bg-opacity-100 text-opacity-100 bg-bg1 text-black dark:bg-bg1dark hover:text-texttwo dark:hover:text-bg10dark rounded-full'
                  onClick={() => terminate()}
                >
                  <XMark></XMark>
                </button>
              </div>
            )}
          </div>
          <div
            // style={{
            //   transform:
            //     'translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))',
            // }}
            className={``}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
