import React, { useEffect, useState } from 'react'
import { IDataSource } from 'ushell-modulebase'
import FloppyDiskIcon from '../../../_Icons/FloppyDiskIcon'
import XMarkIcon from '../../../_Icons/XMarkIcon'
import BoltIcon from '../../../_Icons/BoltIcon'
import ErrorPage from '../../../_Molecules/ErrorScreen'
import { EntityLayout } from '../../../[Move2LayoutDescription]/EntityLayout'
import { IDataSourceManagerWidget } from '../_Templates/IDataSourceManagerWidget'
import EntityFormInner from './EntityFormInner'
import DropdownSelect from '../../../_Atoms/DropdownSelect'
import { fullfillsSchema } from '../../../utils/ObjectUtils'
import Modal2 from '../../../_Atoms/Modal2Old'
import Modal3 from '../../../_Atoms/Modal3'

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
  classNameDropdownBg?: string
  classNameDropdownHoverBg?: string
  styleType?: number
  uow?: any
  persistUow?: (uow: any) => void
  isCreation: boolean
  minWidthInput?: number
  toolbarItems?: any
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
  classNameDropdownBg,
  classNameDropdownHoverBg,
  styleType = 0,
  uow,
  persistUow,
  isCreation = false,
  minWidthInput,
  toolbarItems = <></>,
}) => {
  return (
    <EntityForm1
      dataSourceManager={dataSourceManager}
      dataSources={[dataSource]}
      entity={entity}
      dirty={dirty}
      setDirty={setDirty}
      onSaved={onSaved}
      onCanceled={onCanceled}
      entityLayouts={entityLayout ? [entityLayout] : []}
      labelPosition={labelPosition}
      toolbar={toolbar}
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
      minWidthInput={minWidthInput}
      toolbarItems={toolbarItems}
    ></EntityForm1>
  )
}

export const EntityForm1: React.FC<{
  dataSources: IDataSource[]
  dataSourceManager?: IDataSourceManagerWidget
  entity: any
  dirty: boolean
  setDirty?: (d: boolean) => void
  onSaved: (updatedEntity: any) => void
  onCanceled?: () => void
  entityLayouts?: EntityLayout[]
  labelPosition?: 'top' | 'left'
  toolbar?: 'top' | 'bottom'
  readOnly?: boolean
  classNameBg?: string
  classNameInputBg?: string
  classNameInputHoverBg?: string
  classNameInputHoverBgDark?: string
  classNameDropdownBg?: string
  classNameDropdownHoverBg?: string
  styleType?: number
  uow?: any
  persistUow?: (uow: any) => void
  isCreation: boolean
  minWidthInput?: number
  toolbarItems?: any
}> = ({
  dataSourceManager,
  dataSources,
  entity,
  dirty,
  setDirty,
  onSaved: onSaved,
  onCanceled,
  entityLayouts,
  labelPosition = 'top',
  toolbar = 'top',
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
  isCreation = false,
  minWidthInput,
  toolbarItems = <></>,
}) => {
  // states
  const [currentEntity, setCurrentEntity] = useState<any>({ ...entity })
  const [currentDataSource, setCurrentDataSource] = useState(guessDataSource())
  const [currentEntityLayout, setCurrentEntityLayout] = useState<EntityLayout | undefined>(
    undefined,
  )
  const [error, setError] = useState<any>(null)
  const [dirtyLocal, setDirtyLocal] = useState<boolean>(dirty)
  const [errors, setErrors] = useState<{ [fieldName: string]: string | null }>({})

  // useEffects
  console.log('EntityForm ce', currentEntity)

  useEffect(() => setCurrentEntity({ ...entity }), [entity])

  useEffect(() => setDirtyLocal(dirty), [dirty])
  useEffect(() => {
    if (!dirty) return
    if (!uow) return
    if (!uow.editingEntity) return
    setCurrentEntity(uow.editingEntity)
  }, [])

  useEffect(() => {
    setCurrentEntity({ ...entity })
    setCurrentDataSource(guessDataSource())
  }, [entity])

  useEffect(() => {
    if (!persistUow) return
    if (!uow) uow = {}
    uow.editingEntity = currentEntity
    persistUow(uow)
  }, [currentEntity])

  useEffect(() => {
    if (!currentDataSource) return
    const entityLayout: EntityLayout | undefined = entityLayouts?.find(
      (el) => el.entityName == currentDataSource.entitySchema?.name,
    )
    setCurrentEntityLayout(entityLayout)
    setErrors({})
  }, [currentDataSource])

  if (error) {
    return (
      <Modal3
        title='Error'
        terminate={() => {
          setError(null)
        }}
      >
        <ErrorPage messages={[error.toString()]}></ErrorPage>
      </Modal3>
    )
  }

  function guessDataSource(): IDataSource {
    for (let ds of dataSources) {
      if (fullfillsSchema(currentEntity, ds.entitySchema!)) return ds
    }
    return dataSources[0]
  }

  function save() {
    currentDataSource
      .entityUpdateMethod(currentEntity)
      .then((newEntry: any) => {
        if (newEntry) {
          onSaved(newEntry)
        }
        setDirty && setDirty(false)
        setDirtyLocal(false)
      })
      .catch((ex) => {
        setError(ex)
        console.error('error in entityUpdateMethod', ex)
      })
  }

  function cancel() {
    setCurrentEntity({ ...entity })
    setDirty && setDirty(false)
    setDirtyLocal(false)
    onCanceled && onCanceled()
  }

  function updateErrors(newErrors: { [fieldName: string]: string | null }): void {
    for (let fn in newErrors) {
      errors[fn] = newErrors[fn]
    }
    setErrors({ ...errors })
  }

  function isValid(): boolean {
    for (let fn in errors) {
      if (errors[fn] != null) return false
    }
    return true
  }

  return (
    <div className='UShell_EntityForm flex flex-col h-full w-full overflow-hidden border-0 border-green-400'>
      {toolbar == 'top' && (
        <div
          className={`UShell_EntityForm_Toolbar bg-toolbar dark:bg-toolbarDark flex justify-start p-1 py-1 rounded-sm 
            border-b border-toolbarBorder dark:border-toolbarBorderDark my-0`}
        >
          {toolbarItems}
          {setDirty && dirty && (
            <button
              disabled={!dirty}
              className={`rounded-md p-2
              ${
                dirty
                  ? 'text-red-400 dark:text-red-400 hover:bg-toolbarHover dark:hover:bg-toolbarHoverDark'
                  : ''
              }`}
              onClick={(e) => cancel()}
            >
              <XMarkIcon size={1.5}></XMarkIcon>
            </button>
          )}
          {setDirty && !dirty && (
            <button
              disabled={dirty}
              className={`rounded-md p-2
              ${
                !dirty
                  ? 'text-blue-400 dark:text-blue-400 hover:bg-toolbarHover dark:hover:bg-toolbarHoverDark'
                  : ''
              }`}
              onClick={(e) => setDirty(true)}
            >
              <BoltIcon size={1.5}></BoltIcon>
            </button>
          )}
          <button
            disabled={!isValid() || !(dirty || dirtyLocal)}
            className={`rounded-md p-2 
            ${
              !(!isValid() || !(dirty || dirtyLocal))
                ? 'text-blue-400 dark:text-blue-400 hover:bg-toolbarHover dark:hover:bg-toolbarHoverDark'
                : ''
            }`}
            onClick={(e) => save()}
          >
            <FloppyDiskIcon size={1.5}></FloppyDiskIcon>
          </button>
        </div>
      )}
      {dataSources.length > 1 && (
        <div className={`w-full py-4 ${false ? 'flex justify-between gap-2 items-baseline ' : ''}`}>
          <label className='block mb-2 text-xs font-medium whitespace-nowrap align-baseline'>
            Type
          </label>
          <DropdownSelect
            classNameDropdownBg={classNameDropdownBg}
            classNameDropdownHoverBg={classNameDropdownHoverBg}
            disabled={!isCreation}
            options={dataSources.map((ds) => {
              return { label: ds.entitySchema!.name, value: ds.entitySchema!.name }
            })}
            initialOption={{
              label: currentDataSource.entitySchema!.name,
              value: currentDataSource.entitySchema!.name,
            }}
            onOptionSet={(o) => {
              const newDataSource: IDataSource = dataSources.find(
                (ds) => ds.entitySchema!.name == o?.value,
              )!
              const newEntity: any = newDataSource.entityFactoryMethod()
              setCurrentEntity(newEntity)
              setCurrentDataSource(dataSources.find((ds) => ds.entitySchema!.name == o?.value)!)
            }}
            styleType={styleType}
            classNameBg={classNameInputBg}
            classNameHoverBg={classNameInputHoverBg}
            classNameHoverBgDark={classNameInputHoverBgDark}
          ></DropdownSelect>
        </div>
      )}
      <EntityFormInner
        dataSource={currentDataSource}
        dirty={dirty}
        entity={currentEntity}
        onChange={(ce) => setCurrentEntity({ ...ce })}
        dataSourceManager={dataSourceManager}
        entityLayout={currentEntityLayout}
        labelPosition={labelPosition}
        setDirty={(d) => {
          setDirty && setDirty(d)
          setDirtyLocal(d)
        }}
        readOnly={readOnly}
        classNameBg={classNameBg}
        classNameInputBg={classNameInputBg}
        classNameInputHoverBg={classNameInputHoverBg}
        classNameInputHoverBgDark={classNameInputHoverBgDark}
        classNameDropdownBg={classNameDropdownBg}
        classNameDropdownHoverBg={classNameDropdownHoverBg}
        styleType={styleType}
        uow={uow}
        persistUow={persistUow || (() => {})}
        isCreation={isCreation}
        onValidationChanged={(e) => {
          updateErrors(e)
        }}
        minWidthInput={minWidthInput}
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
