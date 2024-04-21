import React, { useState } from 'react'

import './tailwind.css'
import ShellLayout from './components/shell-layout/_Templates/ShellLayout'
import Guifad from './components/guifad/_Templates/Guifad'
import GuifadFuse from './components/guifad/_Templates/GuifadFuse'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import Table from './components/guifad/_Organisms/Table'
import { TableDemo, DropdownButtonDemo } from './demo'
import TrashIcon from './_Icons/TrashIcon'
import CogWheelIcon from './components/shell-layout/_Icons/CogWheelIcon'
import XMarkIcon from './_Icons/XMarkIcon'
import { FuseDataStore } from './data/FuseDataStore'

const queryClient = new QueryClient()
const Demo = () => {
  FuseDataStore.getTokenMethod = () =>
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3MTM2OTg3NjYsImV4cCI6MTc0NTIzNDc2NiwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.C-c7FWta-4pyjSZL1tnOlLdI6fFHM6d11VpWVrtJwqA'
  const [currentComponent, setCurrentComponent] = useState<string>('TableDemo')

  const demoComponents: string[] = ['TableDemo', 'GuifadDemo', 'GuifadDemo2', 'DropdownButtonDemo']

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
        {(currentComponent == 'GuifadDemo' || currentComponent == 'GuifadDemo2') && (
          <GuifadFuse
            rootEntityName={currentComponent == 'GuifadDemo' ? 'Depot' : 'Fund'}
            routePattern='route'
            fuseUrl='https://localhost:7288/FundsManagement/'
          ></GuifadFuse>
        )}
        {currentComponent == 'TableDemo' && <TableDemo></TableDemo>}
        {currentComponent == 'DropdownButtonDemo' && <DropdownButtonDemo></DropdownButtonDemo>}
      </ShellLayout>
    </QueryClientProvider>
  )
}

export default Demo
