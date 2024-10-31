import React, { useEffect, useState } from 'react'
import { ColorMode, loadShellSettings } from './components/shell-layout/ShellSettings'

let addGlobalElementMethod: (id: string, element: React.JSX.Element) => void = () => {
  console.log('empty addGlobalElementMethod is called')
}
let removeGlobalElementMethod: (id: string) => void = () => {}

export function addGlobalElement(id: string, element: React.JSX.Element) {
  console.log('call addGlobalElementMethod')
  addGlobalElementMethod(id, element)
}
export function removeGlobalElement(id: string) {
  removeGlobalElementMethod(id)
}

const GlobalElementsContainer = () => {
  const [globalElements, setGlobalElements] = useState<{ [id: string]: React.JSX.Element }>({})

  useEffect(() => {
    console.log('register global elements methds')
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
