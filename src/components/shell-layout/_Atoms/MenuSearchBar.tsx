import React from 'react'
import XMarkIcon from '../../../_Icons/XMarkIcon'

interface MenuSearchBarProps {
  filter: string
  setFilter: React.Dispatch<React.SetStateAction<string>>
}

const MenuSearchBar: React.FC<MenuSearchBarProps> = ({ filter, setFilter }) => {
  return (
    <div
      className='bg-content dark:bg-contentDark p-0 px-4 text-sm w-full 
    flex justify-between items-center content-center border-b-2 border-menuBorder dark:border-menuBorderDark'
    >
      <input
        className='bg-content dark:bg-contentDark outline-none w-full border-0 p-2'
        placeholder='Filter...'
        onChange={(e) => setFilter(e.target.value)}
        value={filter}
      ></input>
      {filter && filter != '' && (
        <button
          className='hover:bg-contentHover dark:hover:bg-contentHoverDark p-2 rounded-md'
          onClick={() => setFilter('')}
        >
          <XMarkIcon size={1.0}></XMarkIcon>
        </button>
      )}
    </div>
  )
}

export default MenuSearchBar
