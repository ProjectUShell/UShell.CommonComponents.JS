import React, { useMemo, useState } from 'react'
import Dropdown from './Dropdown'
import ChevronDown from '../components/shell-layout/_Icons/ChevronDown'
import ChevrodnDownIcon from '../_Icons/ChevrodnDownIcon'

const MultiButton: React.FC<{
  buttons: { label: string; onClick: () => void }[]
  classNameButton?: string
  classNameBg?: string
  classNameHoverBorder?: string
  classNameDropdownBorder?: string
}> = ({ buttons, classNameButton, classNameBg, classNameHoverBorder, classNameDropdownBorder }) => {
  const [open, setOpen] = useState(false)

  const id = useMemo(() => crypto.randomUUID(), [])
  if (buttons.length == 0) return <></>
  return (
    <div
      className={`${classNameBg || 'bg-content dark:bg-contentDark'} border-transparent ${
        classNameHoverBorder || 'hover:border-contentBorder dark:hover:border-contentBorderDark'
      }`}
    >
      <div
        style={{ borderColor: 'inherit' }}
        className={`flex content-center items-center 
        border `}
      >
        <button
          style={{ borderColor: 'inherit' }}
          className={`${
            classNameButton || 'p-1 hover:bg-contentHover dark:hover:bg-contentHoverDark'
          }  border-transparent1 border-r1 `}
          onClick={() => buttons[0].onClick()}
        >
          {buttons[0].label}
        </button>
        {buttons.length > 1 && (
          <button
            id={id}
            style={{ borderColor: 'inherit' }}
            onClick={() => setOpen(true)}
            className={` ${
              classNameButton || 'p-1 hover:bg-contentHover dark:hover:bg-contentHoverDark'
            }  pt-1 border-transparent1 border-l `}
          >
            <ChevrodnDownIcon strokeWidth={2} size={1.2}></ChevrodnDownIcon>
          </button>
        )}
      </div>
      {open && (
        <Dropdown refId={id} setIsOpen={(o) => setOpen(o)} minWidth={false}>
          <div
            className={`flex flex-col w-full border mt-0 py-1 ${
              classNameDropdownBorder || 'border-transparent'
            } ${classNameBg || 'bg-content dark:bg-contentDark'}`}
          >
            {buttons.slice(1).map((b, i) => (
              <button
                className={` ${
                  classNameButton || 'p-1 hover:bg-contentHover dark:hover:bg-contentHoverDark'
                }`}
                key={i}
                onClick={() => {
                  b.onClick()
                  setOpen(false)
                }}
              >
                <div className='px-4'>{b.label}</div>
              </button>
            ))}
          </div>
        </Dropdown>
      )}
    </div>
  )
}

export default MultiButton
