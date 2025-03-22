import React from 'react'
import DocComponent from './DocComponent'
import KanbanBoardBasic from './KanbanBoardBasic'

const KanbanBoardDoc = () => {
  return (
    <DocComponent
      title='KanbanBoardBasic'
      subTitle='KanbanBoardBasic...'
      explanation='...'
      demos={[
        {
          demoTitle: 'Basic',
          demoExplanation: '...',
          demoComponent: <KanbanBoardBasic></KanbanBoardBasic>,
          sourceCode: require('!!raw-loader!./KanbanBoardBasic.tsx').default.toString(),
        },
      ]}
    ></DocComponent>
  )
}

export default KanbanBoardDoc
