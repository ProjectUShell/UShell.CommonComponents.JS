import React, { useEffect, useState } from 'react'
import { addGlobalElement, removeGlobalElement } from '../GlobalElementsContainer'
import CheckIcon from '../_Icons/CheckIcon'
import ExclamationCircleIcon from '../_Icons/ExclamationCircleIcon'
import ExclamationTriangleIcon from '../_Icons/ExclamationTriangleIcon'
import InformationCircleIcon from '../_Icons/InformationCircleIcon'

export type NotificationLevel = 'Success' | 'Warn' | 'Error' | 'Info'

const Notification: React.FC<{ content: string; level: NotificationLevel }> = ({
  content,
  level,
}) => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setReady(true)
    }, 1)
  }, [])

  return (
    <div
      style={{ zIndex: 60, top: ready ? '5%' : '10%', right: '5%', borderRadius: '0.2rem' }}
      className={`fixed bg-red-400 p-6  border-l-4 flex flex-col gap-2 transition-all ${
        level == 'Success'
          ? 'bg-green-400 dark:bg-green-400 border-green-700'
          : level == 'Error'
          ? 'bg-red-400 dark:bg-red-400 border-red-700'
          : level == 'Warn'
          ? 'bg-yellow-400 dark:bg-yellow-400 border-yellow-700'
          : 'bg-blue-400 dark:bg-blue-400 border-blue-700'
      }`}
    >
      <div className='text-opacity-65 text-gray-600'>
        {level == 'Success' && <CheckIcon></CheckIcon>}
        {level == 'Error' && <ExclamationTriangleIcon></ExclamationTriangleIcon>}
        {level == 'Warn' && <ExclamationTriangleIcon></ExclamationTriangleIcon>}
        {level == 'Info' && <InformationCircleIcon></InformationCircleIcon>}
      </div>
      {content}
    </div>
  )
}

export function showNotification(
  content: string,
  level: 'Success' | 'Warn' | 'Error' | 'Info' = 'Info',
) {
  const id = crypto.randomUUID()
  addGlobalElement(id, <Notification content={content} level={level}></Notification>)
  setTimeout(() => {
    console.log('removing')
    removeGlobalElement(id)
  }, 1000)
}

export default Notification
