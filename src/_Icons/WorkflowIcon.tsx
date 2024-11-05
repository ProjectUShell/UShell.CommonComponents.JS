import React from 'react'

const WorkflowIcon: React.FC<{ rotate?: number; size?: number; strokeWidth?: number }> = ({
  rotate,
  size = 1.5,
  strokeWidth = 1.5,
}) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={strokeWidth}
      stroke='currentColor'
      className='transition-all'
      style={{ rotate: `${rotate}deg`, width: `${size}rem`, height: `${size}rem` }}
    >
      <path d='M5 3 H9 A2 2 0 0 1 11 5 V9 A2 2 0 0 1 9 11 H5 A2 2 0 0 1 3 9 V5 A2 2 0 0 1 5 3 z' />
      <path d='M7 11v4a2 2 0 002 2h4' />
      <path d='M15 13 H19 A2 2 0 0 1 21 15 V19 A2 2 0 0 1 19 21 H15 A2 2 0 0 1 13 19 V15 A2 2 0 0 1 15 13 z' />
    </svg>
  )
}

export default WorkflowIcon
