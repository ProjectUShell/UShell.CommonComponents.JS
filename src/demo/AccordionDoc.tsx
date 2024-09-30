import React from 'react'
import DocComponent from './DocComponent'
import AccordionBasic from './AccordionBasic'
import AccordionMultiple from './AccordionMultiple'

const AccordionDoc = () => {
  return (
    <DocComponent
      title='Accordion'
      subTitle='Accordion...'
      explanation='...'
      demos={[
        {
          demoTitle: 'Basic',
          demoExplanation: '...',
          demoComponent: <AccordionBasic></AccordionBasic>,
          sourceCode: require('!!raw-loader!./AccordionBasic.tsx').default.toString(),
        },
        {
          demoTitle: 'Mutliple',
          demoExplanation: '...',
          demoComponent: <AccordionMultiple></AccordionMultiple>,
          sourceCode: require('!!raw-loader!./AccordionMultiple.tsx').default.toString(),
        },
      ]}
    ></DocComponent>
  )
}

export default AccordionDoc
