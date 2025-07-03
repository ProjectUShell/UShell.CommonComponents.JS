import React from 'react'
import { IWidget } from 'ushell-modulebase'
import EntityTableModule from './components/guifad/_Templates/EntityTableModule'
import GuifadModule from './components/guifad/_Templates/GuifadModule'

export function createCommonComponent(name: string, input: IWidget): JSX.Element | null {
  switch (name.toLocaleLowerCase()) {
    case 'entitytable':
      return <EntityTableModule widget={input} />
    case 'guifad':
      return <GuifadModule widget={input} />
    default:
      console.warn(`Component ${name} not found.`)
      return null
  }
}
