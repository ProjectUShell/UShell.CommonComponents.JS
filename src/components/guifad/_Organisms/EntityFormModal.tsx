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
  entityLayouts?: EntityLayout[]
  labelPosition?: 'top' | 'left'
  readOnly?: boolean
  classNameBg?: string
  classNameInputBg?: string
  classNameInputHoverBg?: string
  classNameInputHoverBgDark?: string
  classNameDropdownBg: string
  classNameDropdownHoverBg: string
  styleType?: number
  uow?: any
  persistUow?: (uow: any) => void
  isCreation: boolean
  title?: string
}> = ({
  dataSourceManager,
  dataSources,
  entity,
  onChange,
  onCancel,
  entityLayouts,
  labelPosition = 'top',
  readOnly = false,
  classNameBg,
  classNameInputBg,
  classNameInputHoverBg,
  classNameInputHoverBgDark,
  classNameDropdownBg,
  classNameDropdownHoverBg,
  styleType = 0,
  uow,
  persistUow,
  isCreation,
  title,
}) => {
  return (
    <Modal2
      title={
        title && title != ''
          ? title
          : `${
              entityLayouts && entityLayouts.length > 0 ? entityLayouts[0].displayLabel : ''
            } Details`
      }
    >
      <div
        style={{ minWidth: '20rem' }}
        className='p-0 px-4 h-full1 w-full overflow-hidden flex flex-col border-0 border-yellow-400'
      >
        <EntityForm1
          dataSources={dataSources}
          dataSourceManager={dataSourceManager}
          dirty={false}
          entity={entity}
          onSaved={onChange}
          onCanceled={onCancel}
          entityLayouts={entityLayouts}
          labelPosition={labelPosition}
          toolbar='bottom'
          readOnly={readOnly}
          classNameBg={classNameBg}
          classNameInputBg={classNameInputBg}
          classNameInputHoverBg={classNameInputHoverBg}
          classNameInputHoverBgDark={classNameInputHoverBgDark}
          classNameDropdownBg={classNameDropdownBg}
          classNameDropdownHoverBg={classNameDropdownHoverBg}
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
