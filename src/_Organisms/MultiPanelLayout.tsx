import React, { useState, useRef } from 'react'
import ArrowUpIcon2 from '../_Icons/ArrowUpIcon2'
import Tooltip from '../_Atoms/Tooltip'

export class PanelItem {
  icon: React.ReactNode
  content: React.ReactNode
  title: string = ''
}

const MultiPanelLayout: React.FC<{
  topPanelContent?: React.ReactNode
  leftPanelContent?: React.ReactNode | PanelItem[]
  bottomPanelContent?: React.ReactNode
  rightPanelContent?: React.ReactNode
  leftCollapsable?: boolean
  rightCollapsable?: boolean
  leftCollapsedMode?: 'arrow' | 'smallBar' | 'smallTabs' | 'none'
  rightCollapsedMode?: 'arrow' | 'smallBar' | 'none'
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
  leftPanelContent,
  bottomPanelContent,
  rightPanelContent,
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
        <div>
          {leftPanelContent.map((item, index) => {
            return (
              <div key={index}>
                {index == leftPanelIndex && <div className='flex items-center'>{item.content}</div>}
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
    return (leftPanelContent as PanelItem[]).map((item, index) => {
      return (
        <div
          key={index}
          id={'leftPanelTab' + index}
          className={`flex items-center cursor-pointer p-1 bg-navigation dark:bg-navigationDark
            ${index == leftPanelIndex ? '' : 'text-slate-500 dark:text-slate-400'} 
             hover:text-textone hover:dark:text-textonedark
             `}
          onClick={() => {
            if (leftPanelIndex == index) {
              setLeftPanelVisible(!isLeftPanelVisible)
            }
            setLeftPanelIndex(index)
          }}
        >
          {item.icon}
          <Tooltip targetId={'leftPanelTab' + index}>
            <div className='p-2'>{item.title}</div>
          </Tooltip>
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
            className={`border-r h-full flex flex-col px-1
            ${classNameBorder}`}
          >
            {getLeftTabs()}
          </div>
        )}
        {leftPanelContent && isLeftPanelVisible && (
          <div
            ref={leftPanelRef}
            className={`border-r p-0 overflow-auto relative ${classNameBorder}`}
            style={{ width: leftPanelWidth }}
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
        {rightPanelContent && isRightPanelVisible && (
          <div
            ref={rightPanelRef}
            className={`border-l p-0 overflow-auto ${classNameBorder} relative`}
            style={{ width: rightPanelWidth }}
          >
            {rightCollapsable && rightCollapsedMode != 'none' && (
              <button
                className={`absolute top-5 right-1 transform -translate-y-1/2 z-40 ${classNameButtons}`}
                onClick={() => setRightPanelVisible(false)}
              >
                <ArrowUpIcon2 rotate={90}></ArrowUpIcon2>
              </button>
            )}
            {rightPanelContent}
          </div>
        )}
        {rightPanelContent && !isRightPanelVisible && (
          <button
            className={`absolute top-1/2 right-0 transform -translate-y-1/2  p-1 z-40 ${classNameButtons}`}
            onClick={() => setRightPanelVisible(true)}
          >
            <ArrowUpIcon2 rotate={270}></ArrowUpIcon2>
          </button>
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
    </div>
  )
}

export default MultiPanelLayout
