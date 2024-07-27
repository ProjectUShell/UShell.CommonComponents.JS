import React from 'react'
import Dropdown from '../_Atoms/Dropdown'
import Paging from '../components/guifad/_Molecules/Paging'

const DropdownMultiSelectDemo = () => {
  return (
    <div
      className='cc_table z-10 relative overflow-hidden1 overflow-auto shadow-lg1 drop-shadow-md1 
    flex flex-col h-full w-full justify-between '
    >
      <div className='flex flex-col h-full w-full overflow-y-hidden overflow-x-auto '>
        <Dropdown>
          <div>Hi</div>
        </Dropdown>
      </div>
      <div className='z-0 relative'>
        <div>Paging</div>
        <div>Paging</div>
        <div>Paging</div>
      </div>
      {/* <Paging
        total={100}
        pagingParams={{ pageNumber: 1, pageSize: 10 }}
        onPagingParamsChange={() => {}}
      ></Paging> */}
    </div>
  )
}

export default DropdownMultiSelectDemo
