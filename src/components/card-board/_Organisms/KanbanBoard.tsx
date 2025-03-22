import React, { useState } from 'react'
import { CardData } from '../CardData'
import BoardCard from '../_Molecules/BoardCard'

const KanbanBoard: React.FC<{
  cards: any[]
  columnField: string
  titleField: string
  priorityField: string
  columnValues: any[]
  columnColors?: any
  updateCard: (card: any) => void
}> = ({
  cards,
  columnField,
  titleField,
  priorityField,
  columnValues,
  columnColors = {},
  updateCard,
}) => {
  const [draggedCard, setDraggedCard] = useState<any>(null)
  const [draggedOverCard, setDraggedOverCard] = useState<any>(null)

  const onDragStart = (card: any) => {
    setDraggedCard(card)
  }

  const onDragOver = (card: any) => {
    setDraggedOverCard(card)
  }

  const onDrop = (columnValue: any) => {
    if (draggedCard) {
      const updatedCard = { ...draggedCard, [columnField]: columnValue }
      if (draggedOverCard) {
        const updatedCards = [...cards]
        const draggedIndex = updatedCards.findIndex((card) => card.id === draggedCard.id)
        const draggedOverIndex = updatedCards.findIndex((card) => card.id === draggedOverCard.id)
        updatedCards.splice(draggedIndex, 1)
        updatedCard[priorityField] = draggedOverCard[priorityField]
        updatedCards.splice(draggedOverIndex, 0, updatedCard)

        for (let i = draggedOverIndex + 1; i < updatedCards.length; i++) {
          if (updatedCards[i][columnField] === columnValue) {
            updatedCards[i][priorityField] += 1
          }
        }

        updateCard(updatedCard)
      } else {
        updateCard(updatedCard)
      }
      setDraggedCard(null)
      setDraggedOverCard(null)
    }
  }

  return (
    <div className='flex h-full'>
      {columnValues.map((columnValue) => (
        <div
          key={columnValue}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDrop(columnValue)}
          style={{
            margin: '0 10px',
            minWidth: '200px',
            backgroundColor: columnColors[columnValue],
          }}
          className='UShell_kanban-column bg-content dark:bg-contentDark rounded-md
            p-4 flex flex-col gap-2 items-stretch'
        >
          <h2 className='text-2xl mb-4 self-center'>{columnValue}</h2>
          {cards
            .filter((card) => card[columnField] === columnValue)
            .sort((a, b) => a[priorityField] - b[priorityField])
            .map((card) => (
              <div
                key={card.id}
                draggable
                onDragStart={() => onDragStart(card)}
                onDragOver={() => onDragOver(card)}
              >
                <BoardCard card={card} titleField={titleField}></BoardCard>
              </div>
            ))}
        </div>
      ))}
    </div>
  )
}

export default KanbanBoard
