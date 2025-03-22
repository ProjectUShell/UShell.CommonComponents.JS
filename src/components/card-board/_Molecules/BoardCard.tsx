import React from 'react'

const BoardCard: React.FC<{ card: any; titleField: string }> = ({ card, titleField }) => {
  return (
    <div
      style={{
        padding: '10px',
        margin: '0 0 0px 0',
        borderRadius: '4px',
      }}
      className='bg-menu dark:bg-menuDark 
        border border-menuBorder dark:border-menuBorderDark'
    >
      {card[titleField]}
    </div>
  )
}

export default BoardCard
