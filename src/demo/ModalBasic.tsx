import React, { useState } from 'react'
import Accordion from '../_Molecules/Accordion'
import Modal from '../_Atoms/Modal'

const ModalBasic = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className='hover:bg-bg1 dark:hover:bg-bg1dark p-2 border dark:border-bg8dark'
        onClick={() => setOpen((o) => !o)}
      >
        Toggle Open
      </button>
      {open && (
        <Modal title='Example Modal' terminate={() => setOpen(false)}>
          <div className='p-4'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse id nibh quis ante
            pulvinar posuere vitae id odio. Pellentesque at ex gravida, ultrices metus eget,
            pellentesque sem. Orci varius natoque penatibus et magnis dis parturient montes,
            nascetur ridiculus mus. Maecenas vitae consequat orci, vel ultricies mi. Maecenas ut
            vulputate metus. Aliquam ut quam mi. Aliquam massa diam, elementum sit amet porta eu,
            maximus eu augue. Mauris molestie, odio at tincidunt mattis, sem nibh condimentum nunc,
            vitae auctor lorem leo lacinia massa. Pellentesque nec placerat felis. Pellentesque
            imperdiet diam et turpis posuere consectetur. Etiam varius hendrerit odio at congue. Sed
            vehicula, tellus quis condimentum facilisis, velit dui egestas mauris, et condimentum
            ante augue non est. Donec rutrum porta orci a placerat.
          </div>
        </Modal>
      )}
    </>
  )
}

export default ModalBasic
