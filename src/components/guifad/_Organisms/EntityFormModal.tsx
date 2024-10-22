import React from 'react'
import { IDataSource } from 'ushell-modulebase'
import { EntityLayout } from '../../../[Move2LayoutDescription]/EntityLayout'
import { IDataSourceManagerWidget } from '../_Templates/IDataSourceManagerWidget'
import { EntityForm1 } from './EntityForm'
import Modal2 from '../../../_Atoms/Modal2'

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
    <Modal2 title={`${entityLayout?.displayLabel} Details`}>
      <div
        style={{ minWidth: '50vw' }}
        className='p-0 px-4 h-full1 w-full overflow-hidden flex flex-col border-0 border-yellow-400'
      >
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
    </Modal2>
  )
}

export default EntityFormModal
