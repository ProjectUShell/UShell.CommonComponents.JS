import React from 'react'
import DocComponent from './DocComponent'
import AccordionBasic from './AccordionBasic'
import AccordionMultiple from './AccordionMultiple'
import ModalBasic from './ModalBasic'
import ModalWithEntityTable from './ModalWithEntityTable'

const ModalDoc = () => {
  return (
    <DocComponent
      title='Modal'
      subTitle='Modal...'
      explanation='...'
      demos={[
        {
          demoTitle: 'Basic',
          demoExplanation: '...',
          demoComponent: <ModalBasic></ModalBasic>,
          sourceCode: require('!!raw-loader!./ModalBasic.tsx').default.toString(),
        },
        {
          demoTitle: 'ModalWithEntityTable',
          demoExplanation: '...',
          demoComponent: <ModalWithEntityTable></ModalWithEntityTable>,
          sourceCode: require('!!raw-loader!./ModalWithEntityTable.tsx').default.toString(),
        },
      ]}
    ></DocComponent>
  )
}

export default ModalDoc
