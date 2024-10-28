import React from 'react'

const ChevronDown: React.FC<{ size?: 2 | 4 | 6; rotate?: number; strokeWidth?: number }> = ({
  size,
  rotate = 0,
  strokeWidth = 1.5,
}) => {
  if (!size) {
    size = 6
  }
  let sizeCss = 'w-6 h-6'
  switch (size) {
    case 2:
      sizeCss = 'w-2 h-2'
      break
    case 4:
      sizeCss = 'w-4 h-4'
      break
    case 6:
      sizeCss = 'w-6 h-6'
      break
  }
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={strokeWidth}
      stroke='currentColor'
      style={{ rotate: `${rotate}deg` }}
      className={sizeCss + ' transition-all'}
    >
      <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
    </svg>
  )
}

export default ChevronDown
