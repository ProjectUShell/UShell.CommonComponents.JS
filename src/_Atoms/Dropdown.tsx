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

  function tryFindFixedParent(el: HTMLElement): HTMLElement | null {
    let parentElement: HTMLElement | null = el.parentElement
    while (parentElement) {
      if (parentElement.style.position == 'fixed') {
        return parentElement
      }
      if (parentElement.className.includes('UShell_Modal_Inner')) {
        return parentElement
      }
      parentElement = parentElement.parentElement
    }
    return null
  }

  function getTop(): number | undefined {
    const el = document.getElementById(refId)
    if (!el) return undefined
    const t = el.getBoundingClientRect().top + el.getBoundingClientRect().height

    const hHalf = window.innerHeight / 2
    if (t <= hHalf) {
      const fixedParent: HTMLElement | null = tryFindFixedParent(el)
      if (fixedParent) {
        return t - fixedParent.getBoundingClientRect().top
      }
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
      const fixedParent: HTMLElement | null = tryFindFixedParent(el)
      if (fixedParent) {
        return (
          window.innerHeight -
          el.getBoundingClientRect().top -
          fixedParent.getBoundingClientRect().top * 0
        )
      }
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
      const fixedParent: HTMLElement | null = tryFindFixedParent(el)
      if (fixedParent) {
        return l - fixedParent.getBoundingClientRect().left
      }
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
      const fixedParent: HTMLElement | null = tryFindFixedParent(el)
      if (fixedParent) {
        return (
          window.innerWidth -
          (el.getBoundingClientRect().left + el.getBoundingClientRect().width) -
          fixedParent.getBoundingClientRect().left
        )
        // return (
        //   r + (fixedParent.getBoundingClientRect().left - fixedParent.getBoundingClientRect().width)
        // )
      }
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
