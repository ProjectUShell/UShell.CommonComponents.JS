import React from 'react'
import DocComponent from './DocComponent'
import AccordionBasic from './AccordionBasic'
import AccordionMultiple from './AccordionMultiple'
import AccordionMenuBasic from './AccordionMenuBasic'

const AccordionMenuDoc = () => {
  return (
    <DocComponent
      title='Accordion Menu'
      subTitle='Accordion...'
      explanation='...'
      demos={[
        {
          demoTitle: 'Basic',
          demoExplanation: '...',
          demoComponent: <AccordionMenuBasic></AccordionMenuBasic>,
          sourceCode: require('!!raw-loader!./AccordionMenuBasic.tsx').default.toString(),
        },
      ]}
    ></DocComponent>
  )
}

export default AccordionMenuDoc
