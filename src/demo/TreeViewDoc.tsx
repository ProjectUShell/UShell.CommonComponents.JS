import React from 'react'
import { TableColumn } from '../components/guifad/_Organisms/Table'
import DocComponent from './DocComponent'
import TableDemoBasic from './TableDemoBasic'
import TableDemoClientFilter from './TableDemoClientFilter'
import TableDemoClientFilterAndSorting from './TableDemoClientFilterAndSorting'
import TreeViewBasic from './TreeViewBasic'

const TreeViewDoc = () => {
  return (
    <DocComponent
      title='TreeView'
      subTitle='TreeView...'
      explanation='TreeView....'
      demos={[
        {
          demoTitle: 'Basic',
          demoExplanation: 'Basic Table without filter, sorting, paging',
          demoComponent: <TreeViewBasic></TreeViewBasic>,
          sourceCode: require('!!raw-loader!./TreeViewBasic.tsx').default.toString(),
        },
      ]}
    ></DocComponent>
  )
}

export default TreeViewDoc
