import React, { useState } from 'react'
import KanbanBoard from '../components/card-board/_Organisms/KanbanBoard'

const KanbanBoardBasic = () => {
  const [cards, setCards] = useState([
    {
      id: 1,
      title: 'Read the Book',
      description: 'I should read the whole book',
      status: 'in-progress',
      tasks: [],
      priority: 2,
    },
    {
      id: 2,
      title: 'Write some code',
      description: 'Code along with the samples in the book',
      status: 'todo',
      tasks: [],
      priority: 1,
    },
    {
      id: 3,
      title: 'Have a meeting',
      description: 'Meeting with the dev team',
      status: 'done',
      tasks: [],
      priority: 3,
    },
  ])
  return (
    <div style={{ height: '500px' }}>
      <KanbanBoard
        cards={cards}
        columnField='status'
        columnValues={['todo', 'in-progress', 'done']}
        titleField={'title'}
        priorityField='priority'
        updateCard={function (card: any): void {
          setCards(cards.map((c) => (c.id === card.id ? card : c)))
        }}
        // columnColors={{ todo: '#d64d4d', 'in-progress': '#4591ba', done: '#3ca366' }}
      ></KanbanBoard>
    </div>
  )
}

export default KanbanBoardBasic
