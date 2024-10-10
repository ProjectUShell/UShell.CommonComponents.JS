import React from 'react'
import { IDataSource } from 'ushell-modulebase'
import { EntityLayout } from '../../../[Move2LayoutDescription]/EntityLayout'
import { IDataSourceManagerWidget } from '../_Templates/IDataSourceManagerWidget'
import Modal from '../../../_Atoms/Modal'
import EntityForm from './EntityForm'
import EntityFormInner from './EntityFormInner'
import { LayoutDescriptionRoot } from '../../../[Move2LayoutDescription]/LayoutDescriptionRoot'

const EntityFormModal: React.FC<{
  dataSource: IDataSource
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
}> = ({
  dataSourceManager,
  dataSource,
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
}) => {
  return (
    <Modal marginY={10} marginX={30}>
      <div className='p-2 h-full w-full'>
        <EntityForm
          dataSource={dataSource}
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
        ></EntityForm>
      </div>
    </Modal>
  )
}

export default EntityFormModal
