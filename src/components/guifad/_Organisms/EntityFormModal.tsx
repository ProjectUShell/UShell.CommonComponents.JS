import React from 'react'
import { IDataSource } from 'ushell-modulebase'
import { EntityLayout } from '../../../[Move2LayoutDescription]/EntityLayout'
import { IDataSourceManagerWidget } from '../_Templates/IDataSourceManagerWidget'
import Modal from '../../../_Atoms/Modal'
import EntityForm, { EntityForm1 } from './EntityForm'

const EntityFormModal: React.FC<{
  dataSources: IDataSource[]
  dataSourceManager?: IDataSourceManagerWidget
  entity: any
  dirty: boolean
  onChange: (updatedEntity: any) => void
  onCancel: () => void
  entityLayout?: EntityLayout
  labelPosition?: 'top' | 'left'
  readOnly?: boolean
  classNameBg?: string
  classNameInputBg?: string
  classNameInputHoverBg?: string
  classNameInputHoverBgDark?: string
  styleType?: number
  uow?: any
  persistUow?: (uow: any) => void
  isCreation: boolean
}> = ({
  dataSourceManager,
  dataSources,
  entity,
  onChange,
  onCancel,
  entityLayout,
  labelPosition = 'top',
  readOnly = false,
  classNameBg,
  classNameInputBg,
  classNameInputHoverBg,
  classNameInputHoverBgDark,
  styleType = 0,
  uow,
  persistUow,
  isCreation,
}) => {
  return (
    <Modal marginY={10} marginX={30}>
      <div className='p-2 px-4 h-full w-full min-w-80'>
        <EntityForm1
          dataSources={dataSources}
          dataSourceManager={dataSourceManager}
          dirty={false}
          entity={entity}
          onSaved={onChange}
          onCanceled={onCancel}
          entityLayout={entityLayout}
          labelPosition={labelPosition}
          toolbar='bottom'
          readOnly={readOnly}
          classNameBg={classNameBg}
          classNameInputBg={classNameInputBg}
          classNameInputHoverBg={classNameInputHoverBg}
          classNameInputHoverBgDark={classNameInputHoverBgDark}
          styleType={styleType}
          uow={uow}
          persistUow={persistUow}
          isCreation={isCreation}
        ></EntityForm1>
      </div>
    </Modal>
  )
}

export default EntityFormModal
