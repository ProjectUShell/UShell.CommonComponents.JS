import React from 'react'

const ReportMedicalIcon: React.FC<{ rotate?: number; size?: number; strokeWidth?: number }> = ({
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
      <path d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2' />
      <path d='M11 3 H13 A2 2 0 0 1 15 5 V5 A2 2 0 0 1 13 7 H11 A2 2 0 0 1 9 5 V5 A2 2 0 0 1 11 3 z' />
      <path d='M10 14h4M12 12v4' />
    </svg>
  )
}

export default ReportMedicalIcon
