import React, { useEffect, useState } from 'react'
import { ColorMode, loadShellSettings } from './components/shell-layout/ShellSettings'
import ReactDOM from 'react-dom/client'

// const globalElements: React.JSX.Element[] = []

let globalElementRoot: ReactDOM.Root | null = null

let addGlobalElementMethod: (id: string, element: React.JSX.Element) => void = () => {
  console.log('empty addGlobalElementMethod is called')
}
let removeGlobalElementMethod: (id: string) => void = () => {}

export function addGlobalElement2(id: string, element: React.JSX.Element) {
  console.log('addGlobalElement2')

  if (!globalElementRoot) {
    globalElementRoot = ReactDOM.createRoot(document.getElementById('root2') as HTMLElement)
    globalElementRoot.render(
      <GlobalElementsContainer id={id} el={element}></GlobalElementsContainer>,
    )
  }

  addGlobalElement(id, element)
}

export function addGlobalElement3(id: string, element: React.JSX.Element) {
  console.log('addGlobalElement2')

  globalElementRoot = ReactDOM.createRoot(document.getElementById('root2') as HTMLElement)
  globalElementRoot.render(<GlobalElementsContainer id={id} el={element}></GlobalElementsContainer>)

  addGlobalElement(id, element)
}

export function addGlobalElement(id: string, element: React.JSX.Element) {
  console.log('call addGlobalElementMethod')

  addGlobalElementMethod(id, element)
}
export function removeGlobalElement(id: string) {
  removeGlobalElementMethod(id)
}

export function forceGlobalElement(el: React.JSX.Element) {
  const root2 = ReactDOM.createRoot(document.getElementById('root2') as HTMLElement)
  root2.render(el)
}

const GlobalElementsContainer: React.FC<{ id?: string; el?: React.JSX.Element }> = ({ id, el }) => {
  const [globalElements, setGlobalElements] = useState<{ [id: string]: React.JSX.Element }>(
    createFirstElement(),
  )

  function createFirstElement() {
    const result: any = {}
    if (id && el) {
      result[id] = el
    }
    return result
  }

  useEffect(() => {
    console.log('register global elements methods')
    addGlobalElementMethod = (id, el) => {
      console.log('adding global element check', id, globalElements)
      if (id in globalElements) return
      globalElements[id] = el
      console.log('adding global element', id, globalElements)
      setGlobalElements({ ...globalElements })
    }
    removeGlobalElementMethod = (id) => {
      if (!(id in globalElements)) return
      delete globalElements[id]
      setGlobalElements({ ...globalElements })
    }
  }, [])
  console.log('global elements', globalElements)
  return (
    <div className={`${loadShellSettings().colorMode == ColorMode.Dark && 'dark'}`}>
      {Object.keys(globalElements).map((gek) => (
        // <div className='fixed inset-0  bg-red-400 z-50' key={gek}>
        <div key={gek} className='bg-content dark:bg-contentDark dark:text-textonedark'>
          {globalElements[gek]}
        </div>
        // </div>
      ))}
    </div>
  )
}

export default GlobalElementsContainer
