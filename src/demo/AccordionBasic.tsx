import React from 'react'
import Accordion from '../_Molecules/Accordion'

const AccordionBasic = () => {
  return (
    <Accordion
      items={[
        { id: '1', label: 'First Drawer', content: <div>Content of First Drawer</div> },
        { id: '2', label: 'Second Drawer', content: <div>Content of Second Drawer</div> },
        { id: '3', label: 'Third Drawer', content: <div>Content of Third Drawer</div> },
      ]}
    ></Accordion>
  )
}

export default AccordionBasic
