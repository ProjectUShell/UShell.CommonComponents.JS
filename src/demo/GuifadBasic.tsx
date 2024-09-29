import React from 'react'
import GuifadFuse from '../components/guifad/_Templates/GuifadFuse'

const GuifadBasic = () => {
  return (
    <GuifadFuse
      rootEntityName='Nation'
      routePattern='body'
      fuseUrl='https://localhost:7288/AccountManagement/'
    ></GuifadFuse>
  )
}

export default GuifadBasic
