import React from 'react'
import Accordion from '../_Molecules/Accordion'

const AccordionMultiple = () => {
  return (
    <Accordion
      items={[
        { label: 'First Drawer', content: <div>Content of First Drawer</div> },
        { label: 'Second Drawer', content: <div>Content of Second Drawer</div> },
        { label: 'Third Drawer', content: <div>Content of Third Drawer</div> },
      ]}
      multipleOpenAllowed={true}
    ></Accordion>
  )
}

export default AccordionMultiple
