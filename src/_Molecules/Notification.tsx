import React, { useEffect, useState } from 'react'
import {
  addGlobalElement,
  addGlobalElement2,
  removeGlobalElement,
} from '../GlobalElementsContainer'
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
  console.debug('render Notification', level)

  return (
    <div
      style={{ zIndex: 60, top: ready ? '5%' : '10%', right: '5%', borderRadius: '0.2rem' }}
      className={`fixed bg-red-400 p-6  border-l-4 flex flex-col gap-2 transition-all ${
        level == 'Success'
          ? 'bg-green-400 dark:bg-green-700 border-green-700 dark:border-green-900'
          : level == 'Error'
          ? 'bg-red-400 dark:bg-red-700 border-red-700 dark:border-red-900'
          : level == 'Warn'
          ? 'bg-yellow-400 dark:bg-yellow-700 border-yellow-700 dark:border-yellow-900'
          : 'bg-blue-400 dark:bg-blue-700 border-blue-700 dark:border-blue-900'
      }`}
    >
      <div className='text-opacity-65 text-gray-600 dark:text-gray-200 px-4'>
        {level == 'Success' && <CheckIcon></CheckIcon>}
        {level == 'Error' && <ExclamationTriangleIcon></ExclamationTriangleIcon>}
        {level == 'Warn' && <ExclamationTriangleIcon></ExclamationTriangleIcon>}
        {level == 'Info' && <InformationCircleIcon></InformationCircleIcon>}
      </div>
      <div className='px-4'>{content}</div>
    </div>
  )
}

export function showNotification(content: string, level: NotificationLevel = 'Info') {
  const id = crypto.randomUUID()
  addGlobalElement2(id, <Notification content={content} level={level}></Notification>)
  setTimeout(() => {
    removeGlobalElement(id)
  }, 3000)
}

export function showNotification1(content: React.JSX.Element) {
  const id = crypto.randomUUID()
  addGlobalElement2(id, content)
  setTimeout(() => {
    removeGlobalElement(id)
  }, 3000)
}

export default Notification
