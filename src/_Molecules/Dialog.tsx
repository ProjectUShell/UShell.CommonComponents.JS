import React from 'react'
import Modal2 from '../_Atoms/Modal2Old'
import ReactDOM from 'react-dom'
import {
  addGlobalElement,
  addGlobalElement2,
  removeGlobalElement,
} from '../GlobalElementsContainer'
import Modal3 from '../_Atoms/Modal3'

export type DialogResult = 'Ok' | 'Cancel'

const Dialog: React.FC<{
  top?: string
  bottom?: string
  left?: string
  right?: string
  height?: string
  width?: string
  title: string
  buttons: DialogResult[]
  onResult: (result: DialogResult) => void
  children: any
}> = ({ top, bottom, left, right, height, width, title, buttons, onResult, children }) => {
  return (
    <Modal3
      title={title}
      top={top}
      bottom={bottom}
      left={left}
      right={right}
      height={height}
      width={width}
    >
      <div className='flex flex-col justify-between h-full w-full border-0 border-red-400 '>
        <div className='content-center items-center h-full border-0 p-3'>{children}</div>
        <div className='flex gap-1 justify-end border-t dark:border-menuBorderDark py-1 px-3'>
          {buttons.map((b, i) => (
            <div
              className='p-2 rounded-md hover:bg-contentHover dark:hover:bg-contentHoverDark cursor-pointer'
              key={i}
              onClick={() => onResult(b)}
            >
              {b}
            </div>
          ))}
        </div>
      </div>
    </Modal3>
  )
}

export function showDialog(
  title: string,
  buttons: DialogResult[],
  onClose: (result: DialogResult) => void,
  children: any,
  top?: string,
  bottom?: string,
  left?: string,
  right?: string,
  height?: string,
  width?: string,
): React.JSX.Element {
  return (
    <Dialog
      buttons={buttons}
      onResult={onClose}
      title={title}
      top={top || '25%'}
      bottom={bottom}
      left={left}
      right={right}
      height={height || '40%'}
      width={width}
    >
      {children}
    </Dialog>
  )
}

let f: boolean = false
function getF() {
  return f
}
export function showDialog2(
  title: string,
  buttons: DialogResult[],
  children: any,
  onResult: (dr: DialogResult) => void,
  top?: string,
  bottom?: string,
  left?: string,
  right?: string,
  height?: string,
  width?: string,
) {
  const id = crypto.randomUUID()
  let t: any = null
  console.log('attemt to add global element', id)
  addGlobalElement2(
    id,
    <Dialog
      buttons={buttons}
      onResult={(r) => {
        removeGlobalElement(id)
        onResult(r)
      }}
      title={title}
      top={top || '25%'}
      bottom={bottom}
      left={left || '10%'}
      right={right}
      height={height || '40%'}
      width={width || '80%'}
    >
      {children}
    </Dialog>,
  )
}

export default Dialog
