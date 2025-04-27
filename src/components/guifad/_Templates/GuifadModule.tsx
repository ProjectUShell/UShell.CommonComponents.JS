import React from 'react'
import Guifad from './Guifad'
import { IWidget } from 'ushell-modulebase'

const GuifadModule: React.FC<{ widget: IWidget }> = ({ widget }) => {
  return (
    <Guifad
      rootEntityName={widget.state.unitOfWork.entityName}
      dataSourceManager={widget.widgetHost}
      // enterRecord={(r, es) => {
      //   console.log('enter record', { r: r, es: es })
      // }}
      record={widget.state.unitOfWork?.record || undefined}
      layoutDescription={widget.state.unitOfWork?.layoutDescription}
      uow={widget.state.unitOfWork}
      persistUow={(uow) => {
        widget.state.unitOfWork = uow
        widget.widgetHost.populateChangedState(widget.state)
      }}
    ></Guifad>
  )
}

export default GuifadModule
