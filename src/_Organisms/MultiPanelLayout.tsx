import React, { useState, useRef } from 'react'
import ArrowUpIcon2 from '../_Icons/ArrowUpIcon2'

const MultiPanelLayout: React.FC<{
  topPanelContent?: React.ReactNode
  leftPanelContent?: React.ReactNode
  bottomPanelContent?: React.ReactNode
  rightPanelContent?: React.ReactNode
  mainContent: React.ReactNode
  classNameButtons?: string
  classNameSplitter?: string
  classNameBorder?: string
}> = ({
  topPanelContent,
  leftPanelContent,
  bottomPanelContent,
  rightPanelContent,
  mainContent,
  classNameButtons,
  classNameBorder = 'border-navigationBorder dark:border-navigationBorderDark',
  classNameSplitter,
}) => {
  const [isTopPanelVisible, setTopPanelVisible] = useState(true)
  const [isLeftPanelVisible, setLeftPanelVisible] = useState(true)
  const [isBottomPanelVisible, setBottomPanelVisible] = useState(true)
  const [isRightPanelVisible, setRightPanelVisible] = useState(true)

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
      <div className='flex flex-1'>
        {leftPanelContent && isLeftPanelVisible && (
          <div
            ref={leftPanelRef}
            className={`border-r p-2 overflow-auto relative ${classNameBorder}`}
            style={{ width: leftPanelWidth }}
          >
            <button
              className={`absolute top-5 right-1 transform -translate-y-1/2 z-40 ${classNameButtons}`}
              onClick={() => setLeftPanelVisible(false)}
            >
              <ArrowUpIcon2 rotate={270}></ArrowUpIcon2>
            </button>
            {leftPanelContent}
            <div
              className={`absolute top-0 right-0 w-2 h-full cursor-col-resize border-0 border-orange-400 ${classNameSplitter}`}
              onMouseDown={(e) => handleMouseDown(e, 'left')}
            ></div>
          </div>
        )}
        {leftPanelContent && !isLeftPanelVisible && (
          <button
            className={`absolute top-1/2 left-0 transform -translate-y-1/2  p-1 z-40 ${classNameButtons}`}
            onClick={() => setLeftPanelVisible(true)}
          >
            <ArrowUpIcon2 rotate={90}></ArrowUpIcon2>
          </button>
        )}
        <div className={`flex-1 border-0 p-2 overflow-auto relative ${classNameBorder}`}>
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
            className={`border-l p-2 overflow-auto ${classNameBorder} relative`}
            style={{ width: rightPanelWidth }}
          >
            <button
              className={`absolute top-5 right-1 transform -translate-y-1/2 z-40 ${classNameButtons}`}
              onClick={() => setRightPanelVisible(false)}
            >
              <ArrowUpIcon2 rotate={90}></ArrowUpIcon2>
            </button>
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
