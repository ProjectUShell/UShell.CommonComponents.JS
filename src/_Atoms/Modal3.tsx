import React, { useEffect, useState } from 'react'
import XMark from '../components/shell-layout/_Icons/XMark'

const Modal3: React.FC<{
  title: string
  terminate?: (() => void) | undefined
  children: any
  top?: string | undefined
  bottom?: string | undefined
  left?: string | undefined
  right?: string | undefined
  width?: string | undefined
  height?: string | undefined
  classNameBg?: string
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
  classNameBg,
}) => {
  const [full, setFull] = useState(false)
  const [ready, setReady] = useState(false)

  const [sizes, setSizes] = useState<any>(null)
  const [beginTransition, setBeginTransition] = useState(false)

  const sizeRefId: string = crypto.randomUUID()

  useEffect(() => {
    if (!sizes) return
    setTimeout(() => {
      setBeginTransition(true)
    }, 10)
    // if (!ready) {
    //   setTimeout(() => {
    //     setReady(true)
    //   }, 10000)
    //   return
    // }
    setTimeout(() => {
      setFull(true)
    }, 20)
  }, [ready, sizes])

  return (
    <div
      style={{ backgroundColor: 'rgb(0 0 0 / 0.5)' }}
      className='UShell_Modal fixed top-0 left-0 right-0 bottom-0
        z-40 w-full h-full bg-black bg-opacity-50 border-0 border-red-400 justify-center items-center'
    >
      <div
        style={{
          top: sizes?.t || '0',
          // bottom: '20px',
          left: sizes?.l || '0',
          // right: right,
          width: sizes?.w || '100%',
          height: sizes?.h || '100%',
          maxHeight: '90%',
          scale: full || !sizes ? undefined : '50%',
        }}
        className={`UShell_Modal_Inn1er ${!sizes && 'invisible'} fixed flex flex-col
           ${classNameBg || ' bg-content dark:bg-contentDark '} dark:text-textonedark ${
          beginTransition && 'transition-all duration-300 '
        }  border-0 border-green-400 rounded-md`}
      >
        <div className='h-full flex flex-col overflow-hidden flex-grow border-0  border-blue-400 p-1 px-0'>
          <div className='w-full flex whitespace-nowrap border-b dark:border-toolbarBorderDark p-3'>
            <div className='align-middle font-medium p-0 text-lg'>{title}</div>
            {terminate && (
              <div className='bg-opacity-0 w-full bg-red-400 py-0 flex justify-end'>
                <button
                  className='bg-opacity-100 text-opacity-100
                   bg-bg1 text-black dark:bg-bg1dark
                    hover:text-black dark:hover:text-black hover:bg-bg4 dark:hover:bg-bg4dark rounded-full'
                  onClick={() => {
                    setSizes(null)
                    terminate()
                  }}
                >
                  <XMark></XMark>
                </button>
              </div>
            )}
          </div>
          <div
            id={sizeRefId}
            className={`${
              sizes
                ? 'flex fle1x-col overflow-hidden flex-grow border-0 border-orange-400'
                : 'fixed flex overflow-hidden flex-grow invisible border-4 border-green-400'
            }`}
          >
            {children}
          </div>
          {!sizes && (
            <SizeCalculator
              onSizesCalculated={(w, h, l, t) => {
                setSizes({ w: w, h: h, l: l, t: t })
              }}
              sizeRefId={sizeRefId}
            ></SizeCalculator>
          )}
        </div>
      </div>
    </div>
  )
}

const SizeCalculator: React.FC<{
  sizeRefId: string
  onSizesCalculated: (width: number, height: number, left: number, top: number) => void
}> = ({ onSizesCalculated, sizeRefId }) => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!ready) {
      setTimeout(() => {
        setReady(true)
      }, 1)
      return
    } else {
      onSizesCalculated(width1, height2, left1, top1)
    }
  }, [ready])

  const sizeRefEl: any = document.getElementById(sizeRefId)
  const sizeRect = sizeRefEl?.getBoundingClientRect()
  if (!sizeRefEl) return <></>
  const width1 = sizeRect.width + 10
  const height1 = sizeRect.height + 100
  const left1 = (window.innerWidth - width1) / 2
  const height2 = height1 > window.innerHeight * 0.9 ? window.innerHeight * 0.9 : height1
  const top1 = (window.innerHeight - height2) / 2

  return <></>
}

export default Modal3
