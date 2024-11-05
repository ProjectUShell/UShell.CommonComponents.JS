import React from 'react'

const ReportSearchIcon: React.FC<{ rotate?: number; size?: number; strokeWidth?: number }> = ({
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
      <path stroke='none' d='M0 0h24v24H0z' />
      <path d='M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h5.697M18 12V7a2 2 0 00-2-2h-2' />
      <path d='M10 3 H12 A2 2 0 0 1 14 5 V5 A2 2 0 0 1 12 7 H10 A2 2 0 0 1 8 5 V5 A2 2 0 0 1 10 3 z' />
      <path d='M8 11h4M8 15h3' />
      <path d='M19 17.5 A2.5 2.5 0 0 1 16.5 20 A2.5 2.5 0 0 1 14 17.5 A2.5 2.5 0 0 1 19 17.5 z' />
      <path d='M18.5 19.5L21 22' />
    </svg>
  )
}

export default ReportSearchIcon
