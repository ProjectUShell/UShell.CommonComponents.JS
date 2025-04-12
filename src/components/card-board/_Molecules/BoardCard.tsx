import React from 'react'

const BoardCard: React.FC<{ card: any; titleField: string }> = ({ card, titleField }) => {
  return (
    <div
      style={{
        padding: '10px',
        margin: '0 0 0px 0',
        borderRadius: '4px',
      }}
      className='flex flex-col gap-1 bg-menu dark:bg-menuDark 
        border border-menuBorder dark:border-menuBorderDark'
    >
      <div>{card[titleField]}</div>
      <div>{card['priority']}</div>
    </div>
  )
}

export default BoardCard
