import React, { useState } from 'react'

import './tailwind.css'
import ShellLayout from './components/shell-layout/_Templates/ShellLayout'
import Guifad from './components/guifad/_Templates/Guifad'
import GuifadFuse from './components/guifad/_Templates/GuifadFuse'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import Table from './components/guifad/_Organisms/Table.tsx'
import { TableDemo, DropdownButtonDemo } from './demo'
import TrashIcon from './_Icons/TrashIcon'
import CogWheelIcon from './components/shell-layout/_Icons/CogWheelIcon'
import XMarkIcon from './_Icons/XMarkIcon'

const queryClient = new QueryClient()
const Demo = () => {
  const [currentComponent, setCurrentComponent] = useState<string>('TableDemo')

  const demoComponents: string[] = ['TableDemo', 'GuifadDemo', 'DropdownButtonDemo']

  return (
    <QueryClientProvider client={queryClient}>
      <ShellLayout
        title='Demo'
        shellMenu={{
          items: demoComponents.map((dc) => {
            return {
              label: dc,
              id: dc,
              type: 'Command',
              command: (e) => {
                setCurrentComponent(dc)
              },
            }
          }),
          topBarItems: [
            {
              icon: (
                <button className='align-middle'>
                  <TrashIcon></TrashIcon>
                </button>
              ),
              id: 'hi',
            },
            {
              icon: (
                <button className='align-middle'>
                  <XMarkIcon size={0}></XMarkIcon>
                </button>
              ),
              id: 'you',
            },
          ],
        }}
      >
        {currentComponent == 'GuifadDemo' && (
          <GuifadFuse rootEntityName='Employee' fuseUrl='https://localhost:7204/Api/'></GuifadFuse>
        )}
        {currentComponent == 'TableDemo' && <TableDemo></TableDemo>}
        {currentComponent == 'DropdownButtonDemo' && <DropdownButtonDemo></DropdownButtonDemo>}
      </ShellLayout>
    </QueryClientProvider>
  )
}

export default Demo
