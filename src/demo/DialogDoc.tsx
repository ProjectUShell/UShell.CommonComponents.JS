import React from 'react'
import DocComponent from './DocComponent'
import AccordionBasic from './AccordionBasic'
import AccordionMultiple from './AccordionMultiple'
import ModalBasic from './ModalBasic'
import ModalWithEntityTable from './ModalWithEntityTable'
import DialogBasic from './DialogBasic'

const DialogDoc = () => {
  return (
    <DocComponent
      title='Dialog'
      subTitle='Dialog...'
      explanation='...'
      demos={[
        {
          demoTitle: 'Basic',
          demoExplanation: '...',
          demoComponent: <DialogBasic></DialogBasic>,
          sourceCode: require('!!raw-loader!./DialogBasic.tsx').default.toString(),
        },
      ]}
    ></DocComponent>
  )
}

export default DialogDoc
