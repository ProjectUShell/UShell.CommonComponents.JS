import React, { useEffect, useState } from 'react'
import { IDataSource, IDataSourceManagerBase } from 'ushell-modulebase'
import FloppyDiskIcon from '../../../_Icons/FloppyDiskIcon'
import Group from '../_Atoms/Group'
import InputField from '../_Atoms/InputField'
import { getForeignKeyValue, getValue, setValue } from '../../../utils/StringUtils'
import { FieldSchema, RelationSchema } from 'fusefx-modeldescription'
import XMarkIcon from '../../../_Icons/XMarkIcon'
import { IndexSchema } from 'fusefx-modeldescription'
import { EntitySchemaService } from '../../../data/EntitySchemaService'
import LookUpSelect from '../_Molecules/LookUpSelect'
import BoltIcon from '../../../_Icons/BoltIcon'
import ErrorPage from '../../../_Molecules/ErrorScreen'
import { EntityLayout, LayoutPartition } from '../../../[Move2LayoutDescription]/EntityLayout'
import EntityFormGroup from '../_Molecules/EntityFormGroup'
import Modal from '../../../_Atoms/Modal'
import { IDataSourceManagerWidget } from '../_Templates/IDataSourceManagerWidget'
import EntityFormInner from './EntityFormInner'
import { LayoutDescriptionRoot } from '../../../[Move2LayoutDescription]/LayoutDescriptionRoot'

const EntityForm: React.FC<{
  dataSource: IDataSource
  dataSourceManager?: IDataSourceManagerWidget
  entity: any
  dirty: boolean
  setDirty?: (d: boolean) => void
  onSaved: (updatedEntity: any) => void
  onCanceled?: () => void
  entityLayout?: EntityLayout
  labelPosition?: 'top' | 'left'
  toolbar?: 'top' | 'bottom'
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
  dirty,
  setDirty,
  onSaved: onSaved,
  onCanceled,
  entityLayout,
  labelPosition = 'top',
  toolbar = 'top',
  readOnly = false,
  classNameBg,
  classNameInputBg,
  classNameInputHoverBg,
  classNameInputHoverBgDark,
  styleType = 0,
}) => {
  // states
  const [currentEntity, setCurrentEntity] = useState({ ...entity })
  const [error, setError] = useState<any>(null)
  const [dirtyLocal, setDirtyLocal] = useState<boolean>(dirty)

  if (error) {
    return (
      <Modal
        terminate={() => {
          setError(null)
        }}
      >
        <ErrorPage messages={[error.toString()]}></ErrorPage>
      </Modal>
    )
  }

  function save() {
    console.log('saving', currentEntity)
    dataSource
      .entityUpdateMethod(currentEntity)
      .then((newEntry: any) => {
        if (newEntry) {
          onSaved(newEntry)
        }
      })
      .catch((ex) => {
        setError(ex)
        console.error('error in entityUpdateMethod', ex)
      })
  }

  function cancel() {
    console.log('cancel')
    setCurrentEntity({ ...entity })
    setDirty ? setDirty(false) : setDirtyLocal(false)
    onCanceled && onCanceled()
  }

  return (
    <div className='UShell_EntityForm flex flex-col h-full overflow-hidden'>
      {toolbar == 'top' && (
        <div
          className={`UShell_EntityForm_Toolbar bg-toolbar dark:bg-toolbarDark flex justify-start p-1 rounded-sm 
        border border-toolbarBorder dark:border-toolbarBorderDark my-1`}
        >
          {setDirty && dirty && (
            <button
              disabled={!dirty}
              className={`rounded-md p-1
              ${
                dirty
                  ? 'text-red-400 dark:text-red-400 hover:bg-toolbarHover dark:hover:bg-toolbarHoverDark'
                  : ''
              }`}
              onClick={(e) => cancel()}
            >
              <XMarkIcon size={6}></XMarkIcon>
            </button>
          )}
          {setDirty && !dirty && (
            <button
              disabled={dirty}
              className={`rounded-md p-1
              ${
                !dirty
                  ? 'text-blue-400 dark:text-blue-400 hover:bg-toolbarHover dark:hover:bg-toolbarHoverDark'
                  : ''
              }`}
              onClick={(e) => setDirty(true)}
            >
              <BoltIcon size={6}></BoltIcon>
            </button>
          )}
          <button
            disabled={!(dirty || dirtyLocal)}
            className={`rounded-md p-1 
            ${
              dirty || dirtyLocal
                ? 'text-blue-400 dark:text-blue-400 hover:bg-toolbarHover dark:hover:bg-toolbarHoverDark'
                : ''
            }`}
            onClick={(e) => save()}
          >
            <FloppyDiskIcon size={6}></FloppyDiskIcon>
          </button>
        </div>
      )}
      <EntityFormInner
        dataSource={dataSource}
        dirty={dirty}
        entity={entity}
        onChange={(ce) => setCurrentEntity(ce)}
        dataSourceManager={dataSourceManager}
        entityLayout={entityLayout}
        labelPosition={labelPosition}
        setDirty={setDirty}
        readOnly={readOnly}
        classNameBg={classNameBg}
        classNameInputBg={classNameInputBg}
        classNameInputHoverBg={classNameInputHoverBg}
        classNameInputHoverBgDark={classNameInputHoverBgDark}
        styleType={styleType}
      ></EntityFormInner>
      {toolbar == 'bottom' && (
        <div
          className={`UShell_EntityForm_ToolbarBottom flex justify-end gap-2 p-1 px-4 rounded-sm 
             my-0 `}
        >
          <button
            className={`rounded-sm p-2 hover:bg-contentHover dark:hover:bg-contentHoverDark cursor-pointer`}
            onClick={(e) => cancel()}
          >
            Cancel
          </button>

          <button
            className={`rounded-sm p-2 hover:bg-contentHover dark:hover:bg-contentHoverDark cursor-pointer`}
            onClick={(e) => save()}
          >
            Ok
          </button>
        </div>
      )}
    </div>
  )
}

export default EntityForm
