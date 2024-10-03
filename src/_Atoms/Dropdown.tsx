import React, { createRef, useEffect, useId, useMemo, useState } from 'react'

const Dropdown: React.FC<{
  setIsOpen?: (o: boolean) => void
  topOffset?: number
  bottomOffset?: number
  rightOffset?: number
  leftOffset?: number
  children: any
  refId: string
  className?: string
  minWidth?: boolean
}> = ({
  setIsOpen,
  children,
  topOffset,
  bottomOffset,
  rightOffset,
  leftOffset,
  refId,
  className,
  minWidth,
}) => {
  const [render, setRender] = useState(0)

  useEffect(() => {
    setRender((r) => r + 1)
  }, [minWidth])

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

  function getTop(): number | undefined {
    const el = document.getElementById(refId)
    if (!el) return undefined
    const t = el.getBoundingClientRect().top + el.getBoundingClientRect().height
    const hHalf = window.innerHeight / 2
    if (t <= hHalf) {
      return t
    } else {
      return undefined
    }
  }
  function getBottom(): number | undefined {
    const el = document.getElementById(refId)
    if (!el) return undefined
    const t = el.getBoundingClientRect().top + el.getBoundingClientRect().height
    const hHalf = window.innerHeight / 2
    if (t > hHalf) {
      return window.innerHeight - el.getBoundingClientRect().top
    } else {
      return undefined
    }
  }
  function getLeft(): number | undefined {
    const el = document.getElementById(refId)
    if (!el) return 100
    const l = el.getBoundingClientRect().left
    const wHalf = window.innerWidth / 2
    if (l <= wHalf) {
      return l
    } else {
      return undefined
    }
  }
  function getRight(): number | undefined {
    const el = document.getElementById(refId)
    if (!el) return 100
    const r = window.innerWidth - el.getBoundingClientRect().right
    const wHalf = window.innerWidth / 2
    if (r < wHalf) {
      return r
    } else {
      return undefined
    }
  }

  function getHeight(): number {
    const el = document.getElementById(refId)
    if (!el) return 100
    const t = getTop()
    if (t) {
      return window.innerHeight - t
    } else {
      return el.getBoundingClientRect().y
    }
  }

  function getWidth(): number {
    const el = document.getElementById(refId)
    if (!el) return 100
    return el.getBoundingClientRect().width
  }

  return (
    <>
      {setIsOpen && (
        <button
          id='button1'
          className='fixed z-50 cursor-default inset-0 bg-black bg-opacity-0'
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            setIsOpen(false)
          }}
        ></button>
      )}
      <div className=''>
        <div
          style={{
            height: undefined,
            maxHeight: getHeight(),
            width: minWidth ? getWidth() : undefined,
            bottom: getBottom(),
            top: getTop(),
            left: getLeft(),
            right: getRight(),
          }}
          className={`fixed z-50  shadow-lg overflow-hidden 
             flex flex-col justify-center items-center w-max ${className} border-0 bg-transparent border-pink-400`}
        >
          {children}
        </div>
      </div>
    </>
  )
}

export default Dropdown
