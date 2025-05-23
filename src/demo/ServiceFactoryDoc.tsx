import React from 'react'
import DocComponent from './DocComponent'
import AccordionBasic from './AccordionBasic'
import AccordionMultiple from './AccordionMultiple'
import ModalBasic from './ModalBasic'
import ModalWithEntityTable from './ModalWithEntityTable'
import NotificationBasic from './NotificationBasic'
import ServiceFactoryBasic from './ServiceFactoryBasic'

const ServiceFactoryDoc = () => {
  return (
    <DocComponent
      title='ServiceFactory'
      subTitle='ServiceFactory...'
      explanation='...'
      demos={[
        {
          demoTitle: 'ServiceFactoryBasic',
          demoExplanation: '...',
          demoComponent: <ServiceFactoryBasic></ServiceFactoryBasic>,
          sourceCode: require('!!raw-loader!./ServiceFactoryBasic.tsx').default.toString(),
        },
      ]}
    ></DocComponent>
  )
}

export default ServiceFactoryDoc
