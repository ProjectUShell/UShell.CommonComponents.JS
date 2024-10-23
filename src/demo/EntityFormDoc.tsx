import React from 'react'
import DocComponent from './DocComponent'
import EntityTableBasic from './EntityTableBasic'
import EntityTableOptions from './EntityTableOptions'
import EntityFormBasic from './EntityFormBasic'
import EntityFormInheritance from './EntityFormInheritance'
import EntityFormMultiSelect from './EntityFormMultiSelect'
import EntityFormLookUpCrud from './EntityFormLookUpCrud'
import EntityFormMultiLookUpSameEntity from './EntityFormMultiLookUpSameEntity'

const EntityFormDoc = () => {
  return (
    <DocComponent
      title='Entity Form'
      subTitle='Entity Form...'
      explanation='Entity Form....'
      demos={[
        {
          demoTitle: 'Basic Entity Table',
          demoExplanation: 'Basic Entity Table',
          demoComponent: <EntityFormBasic></EntityFormBasic>,
          sourceCode: require('!!raw-loader!./EntityFormBasic.tsx').default.toString(),
        },
        {
          demoTitle: 'Basic Entity with Inheritance',
          demoExplanation: 'Inheritance Entity Table',
          demoComponent: <EntityFormInheritance></EntityFormInheritance>,
          sourceCode: require('!!raw-loader!./EntityFormInheritance.tsx').default.toString(),
        },
        {
          demoTitle: 'Entity with MultiSelect Field',
          demoExplanation: 'Entity with MultiSelect Field',
          demoComponent: <EntityFormMultiSelect></EntityFormMultiSelect>,
          sourceCode: require('!!raw-loader!./EntityFormMultiSelect.tsx').default.toString(),
        },
        {
          demoTitle: 'Entity with Crud LookUp',
          demoExplanation: 'Entity with Crud LookUp',
          demoComponent: <EntityFormLookUpCrud></EntityFormLookUpCrud>,
          sourceCode: require('!!raw-loader!./EntityFormMultiSelect.tsx').default.toString(),
        },
        {
          demoTitle: 'EntityFormMultiLookUpSameEntity',
          demoExplanation: 'EntityFormMultiLookUpSameEntity',
          demoComponent: <EntityFormMultiLookUpSameEntity></EntityFormMultiLookUpSameEntity>,
          sourceCode:
            require('!!raw-loader!./EntityFormMultiLookUpSameEntity.tsx').default.toString(),
        },
      ]}
    ></DocComponent>
  )
}

export default EntityFormDoc
