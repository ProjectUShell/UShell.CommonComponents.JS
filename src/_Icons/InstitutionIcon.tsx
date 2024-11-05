import React from 'react'

const InstitutionIcon: React.FC<{ rotate?: number; size?: number; strokeWidth?: number }> = ({
  rotate,
  size = 1.5,
  strokeWidth = 1.5,
}) => {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='currentColor'
      strokeWidth={strokeWidth}
      style={{ rotate: `${rotate}deg`, width: `${size}rem`, height: `${size}rem` }}
    >
      <path d='M21.857 8.485l-3-5A.997.997 0 0018 3h-4.586l-.707-.707a.999.999 0 00-1.414 0L10.586 3H6a.997.997 0 00-.857.485l-3 5A1.001 1.001 0 002.002 9H2v10a1 1 0 001 1h18a1 1 0 001-1V9h-.002c0-.178-.046-.356-.141-.515zM20 18h-6v-4h-4v4H4v-8h2.414l.293-.293 2-2L12 4.414l4.293 4.293 1 1 .293.293H20v8z' />
      <path d='M14 9.895 A2.105 2.105 0 0 1 11.895 12 A2.105 2.105 0 0 1 9.79 9.895 A2.105 2.105 0 0 1 14 9.895 z' />
      <path d='M6 12h2v3H6zm10 0h2v3h-2z' />
    </svg>
  )
}

export default InstitutionIcon
