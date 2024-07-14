import React, { createRef, useEffect, useState } from 'react'

const Dropdown: React.FC<{
  setIsOpen?: (o: boolean) => void
  topOffset?: number
  bottomOffset?: number
  rightOffset?: number
  leftOffset?: number
  children: any
  className?: string
  minWidthRef?: any
}> = ({
  setIsOpen,
  children,
  topOffset,
  bottomOffset,
  rightOffset,
  leftOffset,
  className,
  minWidthRef,
}) => {
  const [render, setRender] = useState(0)

  useEffect(() => {
    console.log('minWidth', minWidthRef)
    setRender((r) => r + 1)
  }, [minWidthRef])

  useEffect(() => {
    if (!setIsOpen) {
      return
    }
    const handleEscape = (e: any) => {
      if (e.key == 'Esc' || e.key == 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [setIsOpen])

  const dummy: React.FC = () => {
    return (
      <div className='top-0'>
        <div className='top-1'></div>
        <div className='top-2'></div>
        <div className='top-3'></div>
        <div className='top-4'></div>
        <div className='top-5'></div>
        <div className='top-6'></div>
        <div className='top-7'></div>
        <div className='top-8'></div>
        <div className='-top-1'></div>
        <div className='-top-2'></div>
        <div className='-top-3'></div>
        <div className='-top-4'></div>
        <div className='-top-5'></div>
        <div className='-top-6'></div>
        <div className='-top-7'></div>
        <div className='-top-8'></div>
        <div className='bottom-1'></div>
        <div className='bottom-2'></div>
        <div className='bottom-3'></div>
        <div className='bottom-4'></div>
        <div className='bottom-5'></div>
        <div className='bottom-6'></div>
        <div className='bottom-7'></div>
        <div className='bottom-8'></div>
        <div className='-top-1'></div>
        <div className='-top-2'></div>
        <div className='-top-3'></div>
        <div className='-top-4'></div>
        <div className='-top-5'></div>
        <div className='-top-6'></div>
        <div className='-top-7'></div>
        <div className='-top-8'></div>
        <div className='right-0'></div>
        <div className='right-1'></div>
        <div className='right-2'></div>
        <div className='right-3'></div>
        <div className='right-4'></div>
        <div className='right-5'></div>
        <div className='right-6'></div>
        <div className='right-7'></div>
        <div className='right-8'></div>
        <div className='-right-1'></div>
        <div className='-right-2'></div>
        <div className='-right-3'></div>
        <div className='-right-4'></div>
        <div className='-right-5'></div>
        <div className='-right-6'></div>
        <div className='-right-7'></div>
        <div className='-right-8'></div>
        <div className='left-0'></div>
        <div className='left-1'></div>
        <div className='left-2'></div>
        <div className='left-3'></div>
        <div className='left-4'></div>
        <div className='left-5'></div>
        <div className='left-6'></div>
        <div className='left-7'></div>
        <div className='left-8'></div>
        <div className='-left-1'></div>
        <div className='-left-2'></div>
        <div className='-left-3'></div>
        <div className='-left-4'></div>
        <div className='-left-5'></div>
        <div className='-left-6'></div>
        <div className='-left-7'></div>
        <div className='-left-8'></div>
      </div>
    )
  }

  let topOffsetCss: string = topOffset
    ? topOffset > 0
      ? `top-${topOffset}`
      : `-top-${-topOffset}`
    : 'top-0'
  let bottomOffsetCss: string = bottomOffset
    ? bottomOffset > 0
      ? `bottom-${bottomOffset}`
      : `-bottom-${-bottomOffset}`
    : ''
  let rightOffsetCss: string = rightOffset
    ? rightOffset > 0
      ? `right-${rightOffset}`
      : `-right-${-rightOffset}`
    : 'right-0'
  let leftOffsetCss: string = leftOffset
    ? leftOffset > 0
      ? `left-${leftOffset}`
      : `-left-${-leftOffset}`
    : 'left-0'

  if (leftOffset && !rightOffset) {
    rightOffsetCss = ''
  }

  if (rightOffset && !leftOffset) {
    leftOffsetCss = ''
  }

  if (bottomOffset && !topOffset) {
    topOffsetCss = ''
  }

  if (topOffset && !bottomOffset) {
    bottomOffsetCss = ''
  }

  return (
    <>
      {setIsOpen && (
        <button
          id='button1'
          className='fixed z-50 cursor-default inset-0 bg-black bg-opacity-0'
          onClick={() => setIsOpen(false)}
        ></button>
      )}
      <div className='relative'>
        <div
          className={`absolute z-50  shadow-md
           ${rightOffsetCss} ${topOffsetCss} ${leftOffsetCss} ${bottomOffsetCss}
             flex justify-center items-center w-max ${className}`}
        >
          <div
            style={{ minWidth: `${minWidthRef?.current?.clientWidth}px` }}
            className='rounded-md'
          >
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default Dropdown
