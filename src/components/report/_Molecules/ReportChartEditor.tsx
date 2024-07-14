import React from 'react'
import { ReportChartDefinition } from '../ReportDefinition'
import InputField from '../../guifad/_Atoms/InputField'
import DropdownSelect from '../../../_Atoms/DropdownSelect'
import { EntitySchema, FieldSchema } from 'fusefx-modeldescription'

const aggregateFunctions: string[] = ['Count', 'Sum', 'Avg', 'Min', 'Max']
function applyAggregate(aggregateFunction: string, fieldName: string) {
  return `${aggregateFunction}(${fieldName})`
}

const ReportChartEditor: React.FC<{
  entitySchema: EntitySchema
  reportChartDefinition: ReportChartDefinition
  onUpdateDefinition: (updatedDefinition: ReportChartDefinition) => void
}> = ({ entitySchema, reportChartDefinition, onUpdateDefinition }) => {
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

  return (
    <div className='text-sm p-1 flex gap-2 w-full overflow-auto h-full'>
      <div className='h-full border-0 '>
        <div className='flex flex-col justify-between w-full'>
          <InputField
            initialValue={reportChartDefinition.name}
            inputType='string'
            label='Name'
            onValueChange={() => {}}
          ></InputField>
        </div>
        <div className='flex flex-col justify-between w-full'>
          <label className='p-0'>Type</label>
          <DropdownSelect
            options={[
              { label: 'Table', value: 'table' },
              { label: 'Bar', value: 'bar' },
              { label: 'Pie', value: 'pie' },
            ]}
            initialOption={{ label: reportChartDefinition.type, value: reportChartDefinition.type }}
          ></DropdownSelect>
        </div>
      </div>
      <div className=''>
        <div className='groupby'>
          <label>Group By</label>
          <div className='border p-1 dark:border-bg8dark'>
            {entitySchema.fields.map((f) => (
              <div key={f.name} className='flex justify-between w-full'>
                <label>{f.name}</label>
                <div>
                  <input
                    className='h-full text-sm rounded-md bg-bg1 dark:bg-bg2dark block w-full p-1
                 border border-contentBorder dark:border-contentBorderDark'
                    type='checkbox'
                    value={
                      reportChartDefinition.groupBy
                        ? reportChartDefinition.groupBy.includes(f.name)
                          ? 1
                          : 0
                        : 0
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
      </div>
      <div className=''>
        <div className='stackby'>
          <label>Stack By</label>
          <div className='border p-1 dark:border-bg8dark'>
            {entitySchema.fields.map((f) => (
              <div key={f.name} className='flex justify-between w-full'>
                <label>{f.name}</label>
                <div>
                  <input
                    className='h-full text-sm rounded-md bg-bg1 dark:bg-bg2dark block w-full p-1
                 border border-contentBorder dark:border-contentBorderDark'
                    type='checkbox'
                    value={
                      reportChartDefinition.stackBy
                        ? reportChartDefinition.stackBy.includes(f.name)
                          ? 1
                          : 0
                        : 0
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
      </div>
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
                  <div key={f.name} className='flex justify-between w-full'>
                    <label>{f.name}</label>
                    <div>
                      <input
                        className='h-full text-sm rounded-md bg-bg1 dark:bg-bg2dark block w-full p-1
                    border border-contentBorder dark:border-contentBorderDark'
                        type='checkbox'
                        value={
                          reportChartDefinition.groupBy
                            ? reportChartDefinition.groupBy.includes(f.name)
                              ? 1
                              : 0
                            : 0
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
  )
}

export default ReportChartEditor
