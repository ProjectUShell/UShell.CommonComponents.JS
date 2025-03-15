import React from 'react'

const StructureIcon: React.FC<{ rotate?: number; size?: number; strokeWidth?: number }> = ({
  rotate,
  size = 1.5,
  strokeWidth = 1.5,
}) => {
  return (
    <div>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        style={{ rotate: `${rotate}deg`, width: `${size}rem`, height: `${size}rem` }}
        viewBox='0 0 24 24'
      >
        <path
          fill='none'
          stroke='currentColor'
          stroke-linecap='round'
          stroke-linejoin='round'
          strokeWidth={strokeWidth}
          d='M2 5c0-2.482.518-3 3-3h2c2.482 0 3 .518 3 3s-.518 3-3 3H5c-2.482 0-3-.518-3-3m13 4c0-2.482.453-3 2.625-3h1.75C21.547 6 22 6.518 22 9s-.453 3-2.625 3h-1.75C15.453 12 15 11.482 15 9m-2 10c0-2.482.518-3 3-3h2c2.482 0 3 .518 3 3s-.518 3-3 3h-2c-2.482 0-3-.518-3-3m2-12l-5-2l3.571 11'
          color='currentColor'
        />
      </svg>
    </div>
  )
}

export default StructureIcon
