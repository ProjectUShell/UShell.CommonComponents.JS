import React from 'react'
import GuifadFuse from '../components/guifad/_Templates/GuifadFuse'

const GuifadNavigation = () => {
  return (
    <GuifadFuse
      rootEntityName='Person'
      routePattern='body'
      fuseUrl='https://localhost:7288/AccountManagement/'
      labelPosition='left'
      layoutDescription={{
        semanticVersion: '0',
        timestampUtc: '',
        entityLayouts: [
          {
            dislpayRemainingFields: true,
            entityName: 'Address',
            displayLabel: 'Address',
            displayLabelPlural: 'Addresses',
            fieldLayouts: [{ fieldName: 'IsMainAddress', displayLabel: 'Main' }],
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
          {
            dislpayRemainingFields: true,
            entityName: 'Person',
            displayLabel: 'People',
            displayLabelPlural: 'People',
            fieldLayouts: [
              { fieldName: 'NationalityId', displayLabel: 'The Nation' },
              { fieldName: 'FirstName', displayLabel: 'First Name' },
              { fieldName: 'InsuranceContract.PersonId', displayLabel: 'Insurance Contracts' },
            ],
            identityLabelPattern: '',
            isBlEntrypoint: false,
            partitions: [{ children: [], fields: [], name: '', type: 'group' }],
          },
        ],
      }}
    ></GuifadFuse>
  )
}

export default GuifadNavigation
