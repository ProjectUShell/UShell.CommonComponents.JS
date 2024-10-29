import React from 'react'
import DocComponent from './DocComponent'
import AccordionBasic from './AccordionBasic'
import AccordionMultiple from './AccordionMultiple'
import ModalBasic from './ModalBasic'
import ModalWithEntityTable from './ModalWithEntityTable'
import DialogBasic from './DialogBasic'
import VerticalMenuBaisc from './VerticalMenuBaisc'

const MenuDoc = () => {
  return (
    <DocComponent
      title='Menu'
      subTitle='Menu...'
      explanation='...'
      demos={[
        {
          demoTitle: 'Basic',
          demoExplanation: '...',
          demoComponent: <VerticalMenuBaisc></VerticalMenuBaisc>,
          sourceCode: require('!!raw-loader!./VerticalMenuBaisc.tsx').default.toString(),
        },
      ]}
    ></DocComponent>
  )
}

export default MenuDoc
