import React, { useState } from 'react'
import { ReportChartDefinition } from '../ReportDefinition'
import InputField from '../../guifad/_Atoms/InputField'
import DropdownSelect from '../../../_Atoms/DropdownSelect'
import { EntitySchema, FieldSchema } from 'fusefx-modeldescription'
import TrashIcon from '../../../_Icons/TrashIcon'
import PlusCircleIcon from '../../../_Icons/PlusCircleIcon'

const aggregateFunctions: string[] = ['Count', 'Sum', 'Avg', 'Min', 'Max']
function applyAggregate(aggregateFunction: string, fieldName: string) {
  return `${aggregateFunction}(${fieldName})`
}

const ReportChartEditor: React.FC<{
  entitySchema: EntitySchema
  reportChartDefinition: ReportChartDefinition
  onUpdateDefinition: (updatedDefinition: ReportChartDefinition) => void
}> = ({ entitySchema, reportChartDefinition, onUpdateDefinition }) => {
  const [currentCustomValue, setCurrentCustomValue] = useState('')

  function setGroupBy(fieldName: string, v: boolean) {
    if (!reportChartDefinition.groupBy) {
      reportChartDefinition.groupBy = []
    }
    if (!v) {
      reportChartDefinition.groupBy = reportChartDefinition.groupBy.filter((x) => x != fieldName)
    }
    if (!reportChartDefinition.groupBy?.includes(fieldName) && v) {
      reportChartDefinition.groupBy?.push(fieldName)
    }
    onUpdateDefinition(reportChartDefinition)
  }

  function setStackBy(fieldName: string, v: boolean) {
    if (!reportChartDefinition.stackBy) {
      reportChartDefinition.stackBy = []
    }
    if (!v) {
      reportChartDefinition.stackBy = reportChartDefinition.stackBy.filter((x) => x != fieldName)
    }
    if (!reportChartDefinition.stackBy?.includes(fieldName) && v) {
      reportChartDefinition.stackBy?.push(fieldName)
    }
    onUpdateDefinition(reportChartDefinition)
  }

  function setValue(valueName: string, v: boolean) {
    if (!valueName || valueName == '') return
    if (!reportChartDefinition.reportValues) {
      reportChartDefinition.reportValues = []
    }
    if (!v) {
      reportChartDefinition.reportValues = reportChartDefinition.reportValues.filter(
        (x) => x != valueName,
      )
    }
    if (!reportChartDefinition.reportValues?.includes(valueName) && v) {
      reportChartDefinition.reportValues?.push(valueName)
    }
    onUpdateDefinition(reportChartDefinition)
  }

  function isCustomValue(valueName: string) {
    for (let af of aggregateFunctions) {
      if (valueName.includes(af)) {
        return false
      }
    }
    return true
  }

  return (
    <div className='text-sm p-1 flex gap-2 w-full overflow-auto h-full'>
      <div className='h-full border-0 '>
        <div className='flex flex-col justify-between w-full'>
          <InputField
            initialValue={reportChartDefinition.name}
            inputType='string'
            label='Name'
            onValueChange={(n) => {
              reportChartDefinition.name = n
              onUpdateDefinition(reportChartDefinition)
            }}
          ></InputField>
        </div>
        <div className='flex flex-col justify-between w-full'>
          <InputField
            initialValue={reportChartDefinition.folder}
            inputType='string'
            label='Folder'
            onValueChange={(n) => {
              reportChartDefinition.folder = n
              onUpdateDefinition(reportChartDefinition)
            }}
          ></InputField>
        </div>
        <div className='flex flex-col justify-between w-full'>
          <label className='p-0'>Type</label>
          <DropdownSelect
            options={[
              { label: 'Table', value: 'Table' },
              { label: 'Bar', value: 'Bar' },
              { label: 'Pie', value: 'Pie' },
              { label: 'Line', value: 'Line' },
              { label: 'Area', value: 'Area' },
              { label: 'Donut', value: 'Donut' },
            ]}
            initialOption={{ label: reportChartDefinition.type, value: reportChartDefinition.type }}
            onOptionSet={(o) => {
              reportChartDefinition.type = o?.value
              onUpdateDefinition(reportChartDefinition)
            }}
          ></DropdownSelect>
        </div>
        {reportChartDefinition.type == 'Bar' && (
          <div className='flex justify-between w-full  gap-1'>
            <label>Horizontal</label>
            <div>
              <input
                className='h-full text-sm rounded-md bg-bg1 dark:bg-bg2dark block w-full p-1
                 border border-contentBorder dark:border-contentBorderDark'
                type='checkbox'
                checked={reportChartDefinition.horizontal}
                onChange={(e) => {
                  reportChartDefinition.horizontal = e.target.checked
                  console.log('horizontal', reportChartDefinition.horizontal)
                  onUpdateDefinition(reportChartDefinition)
                }}
              ></input>
            </div>
          </div>
        )}
        {reportChartDefinition.type == 'Line' && (
          <div className='flex justify-between w-full  gap-1'>
            <label>MultiAxis</label>
            <div>
              <input
                className='h-full text-sm rounded-md bg-bg1 dark:bg-bg2dark block w-full p-1
                 border border-contentBorder dark:border-contentBorderDark'
                type='checkbox'
                checked={reportChartDefinition.multiAxis}
                onChange={(e) => {
                  reportChartDefinition.multiAxis = e.target.checked
                  onUpdateDefinition(reportChartDefinition)
                }}
              ></input>
            </div>
          </div>
        )}
        {reportChartDefinition.type == 'Area' && (
          <div className='flex justify-between w-full  gap-1'>
            <label>Stacked</label>
            <div>
              <input
                className='h-full text-sm rounded-md bg-bg1 dark:bg-bg2dark block w-full p-1
                 border border-contentBorder dark:border-contentBorderDark'
                type='checkbox'
                checked={reportChartDefinition.stacked}
                onChange={(e) => {
                  reportChartDefinition.stacked = e.target.checked
                  onUpdateDefinition(reportChartDefinition)
                }}
              ></input>
            </div>
          </div>
        )}
      </div>
      <div className='groupby'>
        <label>Group By</label>
        <div className='border p-1 dark:border-bg8dark'>
          {entitySchema.fields.map((f) => (
            <div key={f.name} className='flex justify-between w-full  gap-1'>
              <label>{f.name}</label>
              <div>
                <input
                  className='h-full text-sm rounded-md bg-bg1 dark:bg-bg2dark block w-full p-1
                 border border-contentBorder dark:border-contentBorderDark'
                  type='checkbox'
                  checked={
                    reportChartDefinition.groupBy
                      ? reportChartDefinition.groupBy.includes(f.name)
                        ? true
                        : false
                      : false
                  }
                  onChange={(e) => {
                    setGroupBy(f.name, e.target.checked)
                  }}
                ></input>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='stackby'>
        <label>Stack By</label>
        <div className='border p-1 dark:border-bg8dark'>
          {entitySchema.fields.map((f) => (
            <div key={f.name} className='flex justify-between w-full  gap-1'>
              <label>{f.name}</label>
              <div>
                <input
                  className='h-full text-sm rounded-md bg-bg1 dark:bg-bg2dark block w-full p-1
                 border border-contentBorder dark:border-contentBorderDark'
                  type='checkbox'
                  checked={
                    reportChartDefinition.stackBy
                      ? reportChartDefinition.stackBy.includes(f.name)
                        ? true
                        : false
                      : false
                  }
                  onChange={(e) => {
                    setStackBy(f.name, e.target.checked)
                  }}
                ></input>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='aggregates flex flex-col'>
        <h1>Values</h1>
        <div className='flex gap-1 overflow-auto'>
          {aggregateFunctions.map((af) => (
            <div className='' key={af}>
              <div className=''>
                <label>{af}</label>
                <div className='border p-1 dark:border-bg8dark'>
                  {entitySchema.fields
                    .filter(
                      (f: FieldSchema) =>
                        ['int', 'integer', 'int16', 'int32', 'decimal', 'float', 'single'].includes(
                          f.type.toLowerCase(),
                        ) && f.name.toLowerCase() != 'id',
                    )
                    .map((f) => (
                      <div key={f.name} className='flex justify-between w-full gap-1'>
                        <label>{f.name}</label>
                        <div>
                          <input
                            className='h-full text-sm rounded-md bg-bg1 dark:bg-bg2dark block w-full p-1
                              border border-contentBorder dark:border-contentBorderDark'
                            type='checkbox'
                            checked={
                              reportChartDefinition.reportValues
                                ? reportChartDefinition.reportValues.includes(
                                    applyAggregate(af, f.name),
                                  )
                                  ? true
                                  : false
                                : false
                            }
                            onChange={(e) => {
                              setValue(applyAggregate(af, f.name), e.target.checked)
                            }}
                          ></input>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='aggregates flex flex-col  w-full'>
        <h1>Custom Values</h1>
        <div className='flex flex-col gap-1 overflow-auto w-full'>
          {reportChartDefinition.reportValues
            ?.filter((rv) => isCustomValue(rv))
            .map((rv) => (
              <div className='flex gap-1 w-full'>
                <input
                  className='border-bg6 dark:border-bg6dark border dark:bg-bg1dark px-1 outline-none w-full'
                  defaultValue={rv}
                  disabled
                ></input>
                <button
                  className='hover:bg-bg6 dark:hover:bg-bg6dark p-1 rounded-sm  text-red-500 dark:text-red-400'
                  onClick={() => setValue(rv, false)}
                >
                  <TrashIcon></TrashIcon>
                </button>
              </div>
            ))}
          <div className='flex gap-1'>
            <input
              className='border-bg6 dark:border-bg6dark border dark:bg-bg1dark px-1 outline-none  w-full'
              value={currentCustomValue}
              onChange={(e) => setCurrentCustomValue(e.target.value)}
            ></input>
            <button
              className='hover:bg-bg6 dark:hover:bg-bg6dark p-1 rounded-sm'
              onClick={(e: any) => {
                setValue(currentCustomValue, true)
                setCurrentCustomValue('')
              }}
            >
              <PlusCircleIcon></PlusCircleIcon>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportChartEditor
