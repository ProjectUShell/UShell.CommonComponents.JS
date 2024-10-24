import React, { useState } from 'react'
import Accordion from '../_Molecules/Accordion'
import Dialog, { DialogResult, showDialog } from '../_Molecules/Dialog'

const DialogBasic = () => {
  const [dialog, setDialog] = useState<React.JSX.Element | null>(null)

  function deleteSomething() {
    setDialog(
      showDialog(
        'Delete?',
        ['Cancel', 'Ok'],
        (r: DialogResult) => {
          if (r == 'Ok') {
            console.log('Deleting Something')
          }
          // closeDialog()
          setDialog(null)
        },
        <div>Do you really want to delete something?</div>,
      ),
    )
  }

  return (
    <>
      <button
        className='hover:bg-bg1 dark:hover:bg-bg1dark p-2 border dark:border-bg8dark text-red-400'
        onClick={() => {
          deleteSomething()
        }}
      >
        Delete Something
      </button>
      {dialog}
    </>
  )
}

export default DialogBasic
