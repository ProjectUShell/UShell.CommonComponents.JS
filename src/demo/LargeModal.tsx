import React, { useState } from 'react'
import Modal3 from '../_Atoms/Modal3'

const ModalContent = () => {
  console.log('render Modal Content')
  return (
    <div className='p-4 whitespace-normal1 flex1 flex-col1'>
      <div>
        LoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLoremLorem
        ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse id nibh quis anteLorem ipsum
        dolor sit amet, consectetur adipiscing elit. Suspendisse id nibh quis anteLorem ipsum dolor
        sit amet, consectetur adipiscing elit. Suspendisse id nibh quis anteLorem ipsum dolor sit
        amet, consectetur adipiscing elit. Suspendisse id nibh quis anteLorem ipsum dolor sit amet,
        consectetur adipiscing elit. Suspendisse id nibh quis anteLorem ipsum dolor sit amet,
        consectetur adipiscing elit. Suspendisse id nibh quis anteLorem ipsum dolor sit amet,
        consectetur adipiscing elit. Suspendisse id nibh quis anteLorem ipsum dolor sit amet,
        consectetur adipiscing elit. Suspendisse id nibh quis ante
      </div>
      <div>pulvinar posuere vitae id odio. Pellentesque at ex gravida, ultrices metus eget,</div>
      <div>pellentesque sem. Orci varius natoque penatibus et magnis dis parturient montes,</div>
      <div>
        nascetur ridiculus mus. Maecenas vitae consequat orci, vel ultricies mi. Maecenas ut
      </div>
      <div>
        vulputate metus. Aliquam ut quam mi. Aliquam massa diam, elementum sit amet porta eu,
      </div>
      <div>
        maximus eu augue. Mauris molestie, odio at tincidunt mattis, sem nibh condimentum nunc,
      </div>
      <div>vitae auctor lorem leo lacinia massa. Pellentesque nec placerat felis. Pellentesque</div>
      <div>
        imperdiet diam et turpis posuere consectetur. Etiam varius hendrerit odio at congue. Sed
      </div>
      <div>
        vehicula, tellus quis condimentum facilisis, velit dui egestas mauris, et condimentum
      </div>
      <div>ante augue non est. Donec rutrum porta orci a placerat.</div>
    </div>
  )
}

const LargeModal = () => {
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
        <Modal3 title='Example Modal' terminate={() => setOpen(false)}>
          <ModalContent></ModalContent>
        </Modal3>
      )}
    </>
  )
}

export default LargeModal
