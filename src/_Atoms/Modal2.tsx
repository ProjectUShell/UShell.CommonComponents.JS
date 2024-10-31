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
  const sizeRefId: string = crypto.randomUUID()

  return (
    <>
      <div
        id={sizeRefId}
        className='fixed flex overflow-hidden flex-grow invisible border-4 border-green-400'
      >
        {children}
      </div>
      <Modal2Internal
        title={title}
        terminate={terminate}
        children={children}
        top={top}
        bottom={bottom}
        left={left}
        right={right}
        width={width}
        height={height}
        sizeRefId={sizeRefId}
      ></Modal2Internal>
    </>
  )
}
const Modal2Internal: React.FC<{
  title: string
  terminate?: (() => void) | undefined
  children: any
  top?: string | undefined
  bottom?: string | undefined
  left?: string | undefined
  right?: string | undefined
  width?: string | undefined
  height?: string | undefined
  sizeRefId: string
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
  sizeRefId,
}) => {
  const [full, setFull] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!ready) {
      setTimeout(() => {
        setReady(true)
      }, 10)
      return
    }
    setTimeout(() => {
      setFull(true)
    }, 1)
  }, [ready])

  const sizeRefEl: any = document.getElementById(sizeRefId)

  const sizeRect = sizeRefEl?.getBoundingClientRect()
  if (!sizeRefEl) return <></>
  const width1 = sizeRect.width + 10
  const height1 = sizeRect.height + 100
  const left1 = (window.innerWidth - width1) / 2
  const height2 = height1 > window.innerHeight * 0.9 ? window.innerHeight * 0.9 : height1
  const top1 = (window.innerHeight - height2) / 2
  return (
    <div
      className='UShell_Modal fixed top-0 left-0 right-0 bottom-0
        z-40 w-full h-full bg-black bg-transparent1 bg-opacity-50 border-0 border-red-400 justify-center items-center'
    >
      <div
        style={{
          top: top1,
          // bottom: '20px',
          left: left1,
          // right: right,
          width: width1,
          height: height2,
          maxHeight: '90%',
          scale: full ? undefined : '50%',
        }}
        className={`UShell_Modal_Inn1er fixed flex flex-col
           bg-content dark:bg-contentDark dark:text-textonedark transition-all duration-300 border-0 border-green-400 rounded-md`}
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
