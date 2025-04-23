import React, { useState, useRef, useEffect } from 'react'
import ArrowUpIcon2 from '../_Icons/ArrowUpIcon2'
import Tooltip from '../_Atoms/Tooltip'
import Bars3Icon from '../_Icons/Bars3Icon'

export class PanelItem {
  icon: React.ReactNode
  content: React.ReactNode
  title: string = ''
}

const MultiPanelLayout: React.FC<{
  topPanelContent?: React.ReactNode
  initialLeftPanelContent?: React.ReactNode | PanelItem[]
  setLeftPanelContent?: (value: React.ReactNode | PanelItem[]) => void
  bottomPanelContent?: React.ReactNode
  initialRightPanelContent?: React.ReactNode | PanelItem[]
  setRightPanelContent?: (value: React.ReactNode | PanelItem[]) => void
  leftCollapsable?: boolean
  rightCollapsable?: boolean
  leftCollapsedMode?: 'arrow' | 'smallBar' | 'smallTabs' | 'none'
  rightCollapsedMode?: 'arrow' | 'smallBar' | 'smallTabs' | 'none'
  mainContent: React.ReactNode
  classNameButtons?: string
  classNameSplitter?: string
  classNameBorder?: string
  leftVisible?: boolean
  rightVisible?: boolean
  topVisible?: boolean
  bottomVisible?: boolean
  setLeftVisible?: (value: boolean) => void
  setRightVisible?: (value: boolean) => void
  setTopVisible?: (value: boolean) => void
  setBottomVisible?: (value: boolean) => void
}> = ({
  topPanelContent,
  initialLeftPanelContent,
  bottomPanelContent,
  initialRightPanelContent,
  mainContent,
  classNameButtons,
  classNameBorder = 'border-navigationBorder dark:border-navigationBorderDark',
  classNameSplitter,
  leftCollapsable = true,
  rightCollapsable = true,
  leftCollapsedMode = 'arrow',
  rightCollapsedMode = 'arrow',
  leftVisible = true,
  rightVisible = true,
  topVisible = true,
  bottomVisible = true,
  setLeftVisible,
  setRightVisible,
  setTopVisible,
  setBottomVisible,
}) => {
  const [isTopPanelVisible, setTopPanelVisible] = useState(true)
  const [isLeftPanelVisible1, setLeftPanelVisible1] = useState(true)
  const [isBottomPanelVisible, setBottomPanelVisible] = useState(true)
  const [isRightPanelVisible1, setRightPanelVisible1] = useState(true)

  const [leftPanelIndex, setLeftPanelIndex] = useState(0)
  const [rightPanelIndex, setRightPanelIndex] = useState(0)

  const [topPanelHeight, setTopPanelHeight] = useState('20%')
  const [leftPanelWidth, setLeftPanelWidth] = useState('20%')
  const [bottomPanelHeight, setBottomPanelHeight] = useState('20%')
  const [rightPanelWidth, setRightPanelWidth] = useState('20%')

  const topPanelRef = useRef<HTMLDivElement>(null)
  const leftPanelRef = useRef<HTMLDivElement>(null)
  const bottomPanelRef = useRef<HTMLDivElement>(null)
  const rightPanelRef = useRef<HTMLDivElement>(null)

  const [leftPanelContent, setLeftPanelContent] = useState<React.ReactNode | PanelItem[]>(
    getInitialLeftPanelContent(),
  )
  const [rightPanelContent, setRightPanelContent] = useState<React.ReactNode | PanelItem[]>(
    getInitialRightPanelContent(),
  )

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean
    x: number
    y: number
    panel: 'left' | 'right'
    index: number
  }>({ visible: false, x: 0, y: 0, panel: 'left', index: -1 })

  useEffect(() => {
    if (!Array.isArray(leftPanelContent)) return
    if (!Array.isArray(rightPanelContent)) return
    localStorage.setItem(
      'multiPanelLayout',
      JSON.stringify({
        left: leftPanelContent.map((x) => x.title),
        right: rightPanelContent.map((x) => x.title),
      }),
    )
  }, [leftPanelContent, rightPanelContent])
  const handleMouseDown = (e: React.MouseEvent, direction: string) => {
    const startX = e.clientX
    const startY = e.clientY
    const startHeightTop = topPanelRef.current?.offsetHeight || 0
    const startHeightBottom = bottomPanelRef.current?.offsetHeight || 0
    const startWidthLeft = leftPanelRef.current?.offsetWidth || 0
    const startWidthRight = rightPanelRef.current?.offsetWidth || 0

    const handleMouseMove = (e: MouseEvent) => {
      if (direction === 'top') {
        const newHeight = startHeightTop + (e.clientY - startY)
        setTopPanelHeight(`${newHeight}px`)
      } else if (direction === 'left') {
        const newWidth = startWidthLeft + (e.clientX - startX)
        setLeftPanelWidth(`${newWidth}px`)
      } else if (direction === 'bottom') {
        const newHeight = startHeightBottom - (e.clientY - startY)
        setBottomPanelHeight(`${newHeight}px`)
      } else if (direction === 'right') {
        const newWidth = startWidthRight - (e.clientX - startX)
        setRightPanelWidth(`${newWidth}px`)
      }
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  function getInitialLeftPanelContent(): React.ReactNode | PanelItem[] {
    if (!initialLeftPanelContent) return <></>
    if (!Array.isArray(initialLeftPanelContent)) return initialLeftPanelContent
    const multiPanelLayoutJson = localStorage.getItem('multiPanelLayout')
    if (!multiPanelLayoutJson) return initialLeftPanelContent
    const multiPanelLayout: { left: string[]; right: string[] } = JSON.parse(multiPanelLayoutJson)
    const result: PanelItem[] = []
    initialLeftPanelContent.forEach((item, index) => {
      if (!multiPanelLayout.right.includes(item.title)) {
        result.push(item)
      }
    })
    multiPanelLayout.left.forEach((item) => {
      if (result.map((x) => x.title).includes(item)) return
      const foundItem = initialLeftPanelContent.find((x) => x.title === item)
      if (foundItem) {
        result.push(foundItem as PanelItem)
      }
      if (!initialRightPanelContent) return
      if (!Array.isArray(initialRightPanelContent)) return
      const foundItemR = initialRightPanelContent.find((x) => x.title === item)
      if (foundItemR) {
        result.push(foundItemR as PanelItem)
      }
    })

    return result
  }

  function getInitialRightPanelContent(): React.ReactNode | PanelItem[] {
    if (!initialRightPanelContent) return <></>
    if (!Array.isArray(initialRightPanelContent)) return initialRightPanelContent
    const multiPanelLayoutJson = localStorage.getItem('multiPanelLayout')
    if (!multiPanelLayoutJson) return initialRightPanelContent
    const multiPanelLayout: { left: string[]; right: string[] } = JSON.parse(multiPanelLayoutJson)
    const result: PanelItem[] = []
    initialRightPanelContent.forEach((item, index) => {
      if (!multiPanelLayout.left.includes(item.title)) {
        result.push(item)
      }
    })
    multiPanelLayout.right.forEach((item) => {
      if (result.map((x) => x.title).includes(item)) return
      const foundItem = initialRightPanelContent.find((x) => x.title === item)
      if (foundItem) {
        result.push(foundItem as PanelItem)
      }
      if (!initialLeftPanelContent) return
      if (!Array.isArray(initialLeftPanelContent)) return
      const foundItemR = initialLeftPanelContent.find((x) => x.title === item)
      if (foundItemR) {
        result.push(foundItemR as PanelItem)
      }
    })
    return result
  }

  const handleContextMenu = (e: React.MouseEvent, panel: 'left' | 'right', index: number) => {
    e.preventDefault()
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, panel, index })
  }

  const handleMoveToOtherPanel = () => {
    const { panel, index } = contextMenu
    if (panel === 'left' && Array.isArray(leftPanelContent)) {
      const item = (leftPanelContent as PanelItem[]).splice(index, 1)[0]
      if (Array.isArray(rightPanelContent)) {
        ;(rightPanelContent as PanelItem[]).push(item)
        setRightPanelContent && setRightPanelContent([...rightPanelContent])
      }
    } else if (panel === 'right' && Array.isArray(rightPanelContent)) {
      const item = (rightPanelContent as PanelItem[]).splice(index, 1)[0]
      if (Array.isArray(leftPanelContent)) {
        ;(leftPanelContent as PanelItem[]).push(item)
        setLeftPanelContent && setLeftPanelContent([...leftPanelContent])
      }
    }
    setContextMenu({ visible: false, x: 0, y: 0, panel: 'left', index: -1 })
  }

  const handleCloseContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, panel: 'left', index: -1 })
  }

  const isLeftPanelVisible: boolean =
    leftCollapsedMode == 'none' ? leftVisible : isLeftPanelVisible1
  const isRightPanelVisible: boolean =
    rightCollapsedMode == 'none' ? rightVisible : isRightPanelVisible1

  const setLeftPanelVisible = (value: boolean) => {
    if (leftCollapsedMode == 'none') {
      setLeftVisible && setLeftVisible(value)
    } else {
      setLeftPanelVisible1(value)
    }
  }

  function getLeftPanelContent(): React.ReactNode {
    if (Array.isArray(leftPanelContent)) {
      return (
        <div className='flex flex-col h-full border-0'>
          {leftPanelContent.map((item, index) => {
            return (
              <div key={index} className='h-full1 border-0'>
                {index == leftPanelIndex && (
                  <div className='flex flex-col items-center h-full  border-0'>
                    <div className='self-start flex justify-start border-0 pt-2 pb-1 pl-4 uppercase text-xs'>
                      {item.title}
                    </div>
                    {item.content}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )
    } else {
      return leftPanelContent
    }
  }

  function getLeftTabs(): React.ReactNode[] {
    if (Array.isArray(leftPanelContent) && leftPanelContent.length == 0) {
      return [
        <div
          id={'leftPanelTabDummy'}
          className={`flex items-center cursor-pointer p-1 bg-navigation dark:bg-navigationDark
            ${'text-slate-500 dark:text-slate-400'} 
             hover:text-textone hover:dark:text-textonedark
             `}
          onClick={() => {
            setLeftPanelVisible(!isLeftPanelVisible)
          }}
        >
          <Bars3Icon></Bars3Icon>
        </div>,
      ]
    }
    return (leftPanelContent as PanelItem[]).map((item, index) => {
      return (
        <div
          key={index}
          id={'leftPanelTab' + index}
          className={`flex items-center cursor-pointer p-1 bg-navigation dark:bg-navigationDark
            ${
              index == leftPanelIndex
                ? isLeftPanelVisible
                  ? 'border-l-2 border-prim4 dark:border-prim8'
                  : 'pl-1.5'
                : 'text-slate-500 dark:text-slate-400 pl-1.5'
            } 
             hover:text-textone hover:dark:text-textonedark
             `}
          draggable
          onDragStart={(e) => handleDragStart(e, 'left', index)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, 'left')}
          onContextMenu={(e) => handleContextMenu(e, 'left', index)}
          onClick={() => {
            if (leftPanelIndex == index) {
              setLeftPanelVisible(!isLeftPanelVisible)
            }
            if (!isLeftPanelVisible) setLeftPanelVisible(true)
            setLeftPanelIndex(index)
          }}
        >
          {item.icon}
        </div>
      )
    })
  }

  const setRightPanelVisible = (value: boolean) => {
    if (rightCollapsedMode == 'none') {
      setRightVisible && setRightVisible(value)
    } else {
      setRightPanelVisible1(value)
    }
  }

  function getRightPanelContent(): React.ReactNode {
    if (Array.isArray(rightPanelContent)) {
      return (
        <div>
          {rightPanelContent.map((item, index) => {
            return (
              <div key={index}>
                {index == rightPanelIndex && (
                  <div className='flex flex-col items-center'>
                    <div className='self-start flex justify-start border-0 pt-2 pb-1 pl-4 uppercase text-xs'>
                      {item.title}
                    </div>
                    {item.content}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )
    } else {
      return rightPanelContent
    }
  }

  function getRightTabs(): React.ReactNode[] {
    if (Array.isArray(rightPanelContent) && rightPanelContent.length == 0) {
      return [
        <div
          id={'rightPanelTabDummy'}
          className={`flex items-center cursor-pointer p-1 bg-navigation dark:bg-navigationDark
            ${'text-slate-500 dark:text-slate-400'} 
             hover:text-textone hover:dark:text-textonedark
             `}
          onClick={() => {
            setRightPanelVisible(!isRightPanelVisible)
          }}
        >
          <Bars3Icon></Bars3Icon>
        </div>,
      ]
    }
    return (rightPanelContent as PanelItem[]).map((item, index) => {
      return (
        <div
          key={index}
          id={'rightPanelTab' + index}
          className={`flex items-center cursor-pointer p-1 bg-navigation dark:bg-navigationDark
            ${
              index == rightPanelIndex
                ? isRightPanelVisible
                  ? 'border-r-2 border-prim5 dark:border-prim8'
                  : 'pr-1.5'
                : 'text-slate-500 dark:text-slate-400 pr-1.5'
            } 
             hover:text-textone hover:dark:text-textonedark
             `}
          draggable
          onDragStart={(e) => handleDragStart(e, 'right', index)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, 'right')}
          onContextMenu={(e) => handleContextMenu(e, 'right', index)}
          onClick={() => {
            if (rightPanelIndex == index) {
              setRightPanelVisible(!isRightPanelVisible)
            }
            if (!isRightPanelVisible) setRightPanelVisible(true)
            setRightPanelIndex(index)
          }}
        >
          {item.icon}
        </div>
      )
    })
  }

  const handleDragStart = (e: React.DragEvent, panel: string, index: number) => {
    e.dataTransfer.setData('panel', panel)
    e.dataTransfer.setData('index', index.toString())
  }

  const handleDrop = (e: React.DragEvent, targetPanel: string) => {
    const sourcePanel = e.dataTransfer.getData('panel')
    const index = parseInt(e.dataTransfer.getData('index'))

    if (sourcePanel === targetPanel) return

    if (sourcePanel === 'left' && Array.isArray(leftPanelContent)) {
      const item = (leftPanelContent as PanelItem[]).splice(index, 1)[0]
      if (Array.isArray(rightPanelContent)) {
        ;(rightPanelContent as PanelItem[]).push(item)
        setRightPanelContent && setRightPanelContent([...rightPanelContent])
        setRightPanelIndex(index + 1)
      }
    } else if (sourcePanel === 'right' && Array.isArray(rightPanelContent)) {
      const item = (rightPanelContent as PanelItem[]).splice(index, 1)[0]
      if (Array.isArray(leftPanelContent)) {
        ;(leftPanelContent as PanelItem[]).push(item)
        setLeftPanelContent && setLeftPanelContent([...leftPanelContent])
        setLeftPanelIndex(index + 1)
      }
    }

    // setLeftPanelIndex(0)
    // setRightPanelIndex(0)
    setLeftPanelVisible(true)
    setRightPanelVisible(true)
  }

  return (
    <div className='relative flex flex-col h-full w-full border-0 border-red-400'>
      {topPanelContent && isTopPanelVisible && (
        <div
          ref={topPanelRef}
          className={`border-b p-2 overflow-auto relative ${classNameBorder}`}
          style={{ height: topPanelHeight }}
        >
          <button
            className={`absolute top-0 left-1/2 transform -translate-x-1/2 z-40 ${classNameButtons}`}
            onClick={() => setTopPanelVisible(false)}
          >
            <ArrowUpIcon2 rotate={180}></ArrowUpIcon2>
          </button>
          {topPanelContent}
          <div
            className={`absolute bottom-0 left-0 w-full h-2 cursor-row-resize border-0 border-violet-400 ${classNameSplitter}`}
            onMouseDown={(e) => handleMouseDown(e, 'top')}
          ></div>
        </div>
      )}
      {topPanelContent && !isTopPanelVisible && (
        <button
          className={`absolute top-0 left-1/2 transform -translate-x-1/2  p-1 z-40 ${classNameButtons}`}
          onClick={() => setTopPanelVisible(true)}
        >
          <ArrowUpIcon2 rotate={180}></ArrowUpIcon2>
        </button>
      )}
      <div className='flex flex-1 h-full'>
        {leftPanelContent && leftCollapsedMode == 'smallTabs' && (
          <div
            className={`UShell_MultiPanelLayout_LeftTabBar border-r h-full flex flex-col p-1 py-2
            ${classNameBorder}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, 'left')}
          >
            {getLeftTabs()}
          </div>
        )}
        {leftPanelContent && (
          <div
            ref={leftPanelRef}
            className={`p-0 overflow-auto relative transition-all ${
              isLeftPanelVisible && classNameBorder
            } ${isLeftPanelVisible ? 'border-r' : 'border-0 border-red-400 overflow-hidden'} `}
            style={{
              width: isLeftPanelVisible ? leftPanelWidth : 0,
              transitionProperty: 'width',
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDuration: '150ms',
            }}
          >
            {leftCollapsable &&
              (leftCollapsedMode == 'arrow' || leftCollapsedMode == 'smallBar') && (
                <button
                  className={`absolute top-5 right-1 transform -translate-y-1/2 z-40 ${classNameButtons}`}
                  onClick={() => setLeftPanelVisible(false)}
                >
                  <ArrowUpIcon2 rotate={270}></ArrowUpIcon2>
                </button>
              )}
            {getLeftPanelContent()}
            <div
              className={`absolute top-0 right-0 w-2 h-full cursor-col-resize border-0 border-orange-400 ${classNameSplitter}`}
              onMouseDown={(e) => handleMouseDown(e, 'left')}
            ></div>
          </div>
        )}
        {leftPanelContent && !isLeftPanelVisible && leftCollapsedMode == 'arrow' && (
          <button
            className={`absolute top-1/2 left-0 transform -translate-y-1/2  p-1 z-40 ${classNameButtons}`}
            onClick={() => setLeftPanelVisible(true)}
          >
            <ArrowUpIcon2 rotate={90}></ArrowUpIcon2>
          </button>
        )}
        {leftPanelContent && !isLeftPanelVisible && leftCollapsedMode == 'smallBar' && (
          <button
            className={`static top-0 left-0 h-full w-6 transform  p-0 z-40 border-r ${classNameBorder}
             bg-navigation dark:bg-navigationDark hover:bg-navigationHover dark:hover:bg-navigationHoverDark`}
            onClick={() => setLeftPanelVisible(true)}
          >
            <ArrowUpIcon2 size={0.9} rotate={90}></ArrowUpIcon2>
          </button>
        )}
        <div className={`flex-1 border-0 p-0 overflow-auto relative ${classNameBorder}`}>
          {mainContent}
          {isRightPanelVisible && (
            <div
              ref={rightPanelRef}
              className={`absolute top-0 right-0 w-2 h-full cursor-col-resize border-0 border-blue-400 ${classNameSplitter}`}
              onMouseDown={(e) => handleMouseDown(e, 'right')}
            ></div>
          )}
        </div>

        {rightPanelContent &&
          (!Array.isArray(rightPanelContent) || rightPanelContent.length > 0) && (
            <div
              ref={rightPanelRef}
              className={`p-0 overflow-auto relative transition-all ${
                isRightPanelVisible && classNameBorder
              } ${isRightPanelVisible ? 'border-l' : 'border-0 border-red-400 overflow-hidden'} `}
              style={{
                width: isRightPanelVisible ? rightPanelWidth : 0,
                transitionProperty: 'width',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                transitionDuration: '150ms',
              }}
            >
              {rightCollapsable && rightCollapsedMode == 'arrow' && (
                <button
                  className={`absolute top-5 right-1 transform -translate-y-1/2 z-40 ${classNameButtons}`}
                  onClick={() => setRightPanelVisible(false)}
                >
                  <ArrowUpIcon2 rotate={90}></ArrowUpIcon2>
                </button>
              )}
              {getRightPanelContent()}
            </div>
          )}
        {rightPanelContent &&
          rightCollapsedMode == 'smallTabs' &&
          (!Array.isArray(rightPanelContent) || rightPanelContent.length > 0) && (
            <div
              className={`UShell_MultiPanelLayout_RightTabBar border-l h-full flex flex-col p-1 py-2
            ${classNameBorder}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, 'right')}
            >
              {getRightTabs()}
            </div>
          )}
        {rightPanelContent && !isRightPanelVisible && rightCollapsedMode == 'arrow' && (
          <button
            className={`absolute top-1/2 right-0 transform -translate-y-1/2  p-1 z-40 ${classNameButtons}`}
            onClick={() => setRightPanelVisible(true)}
          >
            <ArrowUpIcon2 rotate={270}></ArrowUpIcon2>
          </button>
        )}
        {rightPanelContent && !isRightPanelVisible && rightCollapsedMode == 'smallBar' && (
          <button
            className={`static top-0 h-full w-6 right-0 transform z-40 border-l ${classNameBorder}
            bg-navigation dark:bg-navigationDark hover:bg-navigationHover dark:hover:bg-navigationHoverDark`}
            onClick={() => setRightPanelVisible(true)}
          >
            <ArrowUpIcon2 size={0.9} rotate={270}></ArrowUpIcon2>
          </button>
        )}
      </div>
      {bottomPanelContent && isBottomPanelVisible && (
        <div
          ref={bottomPanelRef}
          className={`border-t p-2 overflow-auto relative ${classNameBorder}`}
          style={{ height: bottomPanelHeight }}
        >
          <button
            className={`absolute top-0 left-1/2 transform -translate-x-1/2 z-40 ${classNameButtons}`}
            onClick={() => setBottomPanelVisible(false)}
          >
            <ArrowUpIcon2 rotate={0}></ArrowUpIcon2>
          </button>
          {bottomPanelContent}
          <div
            className={`absolute top-0 left-0 w-full h-2 cursor-row-resize border-0 border-pink-400 ${classNameSplitter}`}
            onMouseDown={(e) => handleMouseDown(e, 'bottom')}
          ></div>
        </div>
      )}
      {bottomPanelContent && !isBottomPanelVisible && (
        <button
          className={`absolute bottom-0 left-1/2 transform -translate-x-1/2  p-1 z-40 ${classNameButtons}`}
          onClick={() => setBottomPanelVisible(true)}
        >
          <ArrowUpIcon2 rotate={0}></ArrowUpIcon2>
        </button>
      )}
      {contextMenu.visible && (
        <div
          className='fixed text-sm bg-content dark:bg-conetnDark border-contentBorder dark:border-contentBorderDark shadow-md p-1 rounded-md'
          style={{
            top: contextMenu.y,
            left: contextMenu.panel === 'left' ? contextMenu.x : undefined,
            right: contextMenu.panel === 'right' ? window.innerWidth - contextMenu.x : undefined,
          }}
          onMouseLeave={handleCloseContextMenu}
        >
          <button
            className='block w-full text-left px-2 py-1 hover:bg-contentHover dark:hover:bg-contentHoverDark rounded-sm'
            onClick={handleMoveToOtherPanel}
          >
            Move to {contextMenu.panel === 'left' ? 'Right' : 'Left'} Panel
          </button>
        </div>
      )}
    </div>
  )
}

export default MultiPanelLayout
