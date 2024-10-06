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
}> = ({
  dataSourceManager,
  dataSource,
  entity,
  onChange,
  onCancel,
  entityLayout,
  labelPosition = 'top',
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
        ></EntityForm>
      </div>
    </Modal>
  )
}

export default EntityFormModal
