import React from 'react'
import DocComponent from './DocComponent'
import AccordionBasic from './AccordionBasic'
import AccordionMultiple from './AccordionMultiple'
import MultiButtonBasic from './MultiButtonBasic'

const MultiButtonDoc = () => {
  return (
    <DocComponent
      title='MultiButton'
      subTitle='MultiButton...'
      explanation='...'
      demos={[
        {
          demoTitle: 'Basic',
          demoExplanation: '...',
          demoComponent: <MultiButtonBasic></MultiButtonBasic>,
          sourceCode: require('!!raw-loader!./MultiButtonBasic.tsx').default.toString(),
        },
      ]}
    ></DocComponent>
  )
}

export default MultiButtonDoc
