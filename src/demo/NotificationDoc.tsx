import React from 'react'
import DocComponent from './DocComponent'
import AccordionBasic from './AccordionBasic'
import AccordionMultiple from './AccordionMultiple'
import ModalBasic from './ModalBasic'
import ModalWithEntityTable from './ModalWithEntityTable'
import NotificationBasic from './NotificationBasic'

const NotificationDoc = () => {
  return (
    <DocComponent
      title='Modal'
      subTitle='Modal...'
      explanation='...'
      demos={[
        {
          demoTitle: 'NotificationBasic',
          demoExplanation: '...',
          demoComponent: <NotificationBasic></NotificationBasic>,
          sourceCode: require('!!raw-loader!./NotificationBasic.tsx').default.toString(),
        },
      ]}
    ></DocComponent>
  )
}

export default NotificationDoc
