import React from 'react'
import GuifadFuse from '../components/guifad/_Templates/GuifadFuse'

const GuifadNavigation = () => {
  return (
    <GuifadFuse
      rootEntityName='Person'
      routePattern='body'
      fuseUrl='https://localhost:7288/AccountManagement/'
      layoutDescription={{
        semanticVersion: '0',
        timestampUtc: '',
        entityLayouts: [
          {
            dislpayRemainingFields: false,
            entityName: 'Person',
            displayLabel: 'Person',
            displayLabelPlural: 'People',
            fieldLayouts: [],
            identityLabelPattern: '',
            isBlEntrypoint: false,
            partitions: [
              {
                type: 'group',
                name: 'Identity',
                fields: [],
                children: [
                  {
                    type: 'column',
                    name: 'c1',
                    fields: ['FirstName', 'LastName'],
                    children: [],
                  },
                  {
                    type: 'column',
                    name: 'c2',
                    fields: ['Nation', 'DateOfBirth'],
                    children: [],
                  },
                ],
              },
              {
                type: 'group',
                name: 'Contact',
                fields: ['PhoneNumber', 'Email'],
                children: [],
              },
            ],
          },
        ],
      }}
    ></GuifadFuse>
  )
}

export default GuifadNavigation
