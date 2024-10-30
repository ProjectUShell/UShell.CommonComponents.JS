import React, { useEffect, useState } from 'react'

let addGlobalElementMethod: (id: string, element: React.JSX.Element) => void = () => {}
let removeGlobalElementMethod: (id: string) => void = () => {}

export function addGlobalElement(id: string, element: React.JSX.Element) {
  addGlobalElementMethod(id, element)
}
export function removeGlobalElement(id: string) {
  removeGlobalElementMethod(id)
}

const GlobalElementsContainer = () => {
  const [globalElements, setGlobalElements] = useState<{ [id: string]: React.JSX.Element }>({})

  useEffect(() => {
    addGlobalElementMethod = (id, el) => {
      if (id in globalElements) return
      globalElements[id] = el
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
    <>
      {Object.keys(globalElements).map((gek) => (
        // <div className='fixed inset-0  bg-red-400 z-50' key={gek}>
        <>{globalElements[gek]}</>
        // </div>
      ))}
    </>
  )
}

export default GlobalElementsContainer
