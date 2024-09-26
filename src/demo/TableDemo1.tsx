import React from 'react'
import { TableColumn } from '../components/guifad/_Organisms/Table'
import DocComponent from './DocComponent'
import TableDemoBasic from './TableDemoBasic'
import TableDemoClientFilter from './TableDemoClientFilter'
import TableDemoClientFilterAndSorting from './TableDemoClientFilterAndSorting'

const TableDemo1 = () => {
  return (
    <DocComponent
      title='Table'
      subTitle='Tables...'
      explanation='Tables....'
      demos={[
        {
          demoTitle: 'Basic',
          demoExplanation: 'Basic Table without filter, sorting, paging',
          demoComponent: <TableDemoBasic></TableDemoBasic>,
          sourceCode: require('!!raw-loader!./TableDemoBasic.tsx').default.toString(),
        },
        {
          demoTitle: 'Client Filter',
          demoExplanation: 'Basic Table with clientside filtering',
          demoComponent: <TableDemoClientFilter></TableDemoClientFilter>,
          sourceCode: require('!!raw-loader!./TableDemoClientFilter.tsx').default.toString(),
        },
        {
          demoTitle: 'Client Filter and Sorting',
          demoExplanation: 'Basic Table with clientside filtering and sorting',
          demoComponent: <TableDemoClientFilterAndSorting></TableDemoClientFilterAndSorting>,
          sourceCode:
            require('!!raw-loader!./TableDemoClientFilterAndSorting.tsx').default.toString(),
        },
      ]}
    ></DocComponent>
  )
}

export default TableDemo1
