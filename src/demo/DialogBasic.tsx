import React, { useState } from 'react'
import Accordion from '../_Molecules/Accordion'
import Dialog, { DialogResult, showDialog, showDialog2 } from '../_Molecules/Dialog'

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

  function deleteSomething2() {
    showDialog2(
      'Delete?',
      ['Cancel', 'Ok'],
      <div>Do you really want to delete something?</div>,
      (r) => {
        console.log('result', r)
      },
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
      <button
        className='hover:bg-bg1 dark:hover:bg-bg1dark p-2 border dark:border-bg8dark text-red-400'
        onClick={() => {
          deleteSomething2()
        }}
      >
        Delete Something 2
      </button>
      {dialog}
    </>
  )
}

export default DialogBasic
