import React from 'react'

const SearchBar: React.FC<{ onSearch: (searchText: string) => void }> = ({ onSearch }) => {
  function onKeyUp(e: any) {
    if (!(e.key === 'Enter')) return
    onSearch(e.target.value)
    e.target.value = ''
  }

  return (
    <div className='bg-backgroundfour dark:bg-backgroundfourdark'>
      <input
        onBlur={(e) => {
          onSearch(e.target.value)
          e.target.value = ''
        }}
        onKeyUp={onKeyUp}
        placeholder='search'
        className='px-1 rounded-sm outline-none  p-1 bg-backgroundfour dark:bg-backgroundfourdark
      w-56  focus:w-80 transition-all'
      ></input>
    </div>
  )
}

export default SearchBar
