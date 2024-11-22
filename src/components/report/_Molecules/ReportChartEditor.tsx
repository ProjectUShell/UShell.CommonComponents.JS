import React, { useEffect, useState } from 'react'
import { ChartType, ReportChartDefinition } from '../ReportDefinition'
import InputField from '../../guifad/_Atoms/InputField'
import DropdownSelect from '../../../_Atoms/DropdownSelect'
import { EntitySchema, FieldSchema } from 'fusefx-modeldescription'
import TrashIcon from '../../../_Icons/TrashIcon'
import PlusCircleIcon from '../../../_Icons/PlusCircleIcon'
import ChartPieIcon from '../../../_Icons/ChartPieIcon'
import ChartBarIcon from '../../../_Icons/ChartBarIcon'
import PresentationChartBarIcon from '../../../_Icons/PresentationChartBarIcon'
import PresentationChartILinecon from '../../../_Icons/PresentationChartILinecon'
import TableCellsIcon from '../../../_Icons/TableCellsIcon'
import MultiSelect from '../../../_Atoms/MultiSelect'
import DropdownMultiSelect from '../../../_Atoms/DropdownMultiSelect'
import MultiInputField from '../../../_Atoms/MultiInputField'

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
  const [sortDescending, setSortDescending] = useState(
    reportChartDefinition.sortedBy.startsWith('^'),
  )
  const [currentAggregatFunction, setCurrentAggregatFunction] = useState<string>('avg')
  const [currentAggregateField, setCurrentAggregateField] = useState<string | null>(null)

  useEffect(() => {
    if (!currentAggregatFunction || !currentAggregateField) return
    commitReportValue()
  }, [currentAggregatFunction, currentAggregateField])

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

  const chartTypeEnum: { label: ChartType; icon: JSX.Element }[] = [
    { label: 'Table', icon: <TableCellsIcon></TableCellsIcon> },
    { label: 'Bar', icon: <ChartBarIcon></ChartBarIcon> },
    { label: 'Pie', icon: <ChartPieIcon></ChartPieIcon> },
    { label: 'Line', icon: <PresentationChartILinecon></PresentationChartILinecon> },
    { label: 'Area', icon: <PresentationChartBarIcon></PresentationChartBarIcon> },
    { label: 'Donut', icon: <ChartPieIcon></ChartPieIcon> },
  ]

  function getFieldsAsDict(): any {
    const result: any = {}
    entitySchema.fields.forEach((f) => {
      result[f.name] = f.name
    })
    return result
  }

  function getNumberFieldsAsDict(): any {
    const result: any = {}
    entitySchema.fields
      .filter(
        (f: FieldSchema) =>
          ['int', 'integer', 'int16', 'int32', 'decimal', 'float', 'single'].includes(
            f.type.toLowerCase(),
          ) && f.name.toLowerCase() != 'id',
      )
      .forEach((f) => {
        result[f.name] = f.name
      })
    return result
  }

  function addReportValueField(aggregateField: string): void {
    setCurrentAggregateField(aggregateField)
  }

  function addReportValueFunction(aggregateFunction: string): void {
    setCurrentAggregatFunction(aggregateFunction)
  }

  function commitReportValue() {
    if (!reportChartDefinition.reportValues) reportChartDefinition.reportValues = []
    reportChartDefinition.reportValues.push(`${currentAggregatFunction}(${currentAggregateField})`)
    setCurrentAggregatFunction('avg')
    setCurrentAggregateField(null)
    onUpdateDefinition(reportChartDefinition)
  }

  function removeReportValue(reportValue: string) {
    if (!reportChartDefinition.reportValues) return
    const idx: number = reportChartDefinition.reportValues.findIndex((rv) => rv == reportValue)
    if (idx < 0) return
    reportChartDefinition.reportValues.splice(idx, 1)
    onUpdateDefinition(reportChartDefinition)
  }

  function getAggregateFunction(rv: string) {
    return 'avg'
  }

  function getAggregateField(rv: string): string | null {
    const indexOfOpen: number = rv.indexOf('(')
    const indexOfClose: number = rv.indexOf(')')
    if (indexOfOpen < 0 || indexOfClose < 0) return null
    return rv.substring(indexOfOpen + 1, indexOfClose)
  }
  return (
    <div className='UShell_ReportEditorChart flex h-full w-full overflow-hidden border-0 p-2'>
      <div
        className='UShell_ReportEditorChart_Sidebar flex flex-col h-full 
        overflow-y-auto overflow-x-hidden whitespace-nowrap mx-2 border-0'
      >
        <p className='p-1'> Chart type</p>
        {chartTypeEnum.map((e) => (
          <div
            key={e.label}
            className={`flex align-middle gap-1 p-2 pr-6 select-none border-l-4 
           ${
             reportChartDefinition.type == e.label
               ? 'bg-prim3 dark:bg-prim4Dark border-prim6 dark:border-prim7Dark'
               : 'hover:bg-contentHover dark:hover:bg-contentHoverDark border-transparent'
           }`}
            onClick={() => {
              reportChartDefinition.type = e.label
              onUpdateDefinition(reportChartDefinition)
            }}
          >
            {e.icon}
            <p>{e.label}</p>
          </div>
        ))}
      </div>
      <div
        className='UShell_ReportEditorChart_MainEditor flex flex-col gap-4 
          h-full w-full p-2 px-4
          border-0 overflow-auto'
      >
        <div className='flex w-full gap-2'>
          <InputField
            initialValue={reportChartDefinition.name}
            inputType='string'
            label='Name'
            onValueChange={(n) => {
              reportChartDefinition.name = n
              onUpdateDefinition(reportChartDefinition)
            }}
            classNameBg='bg-content dark:bg-contentDark'
            classNameHoverBg='bg-bg2'
            classNameHoverBgDark='bg-bg2dark'
          ></InputField>
          <InputField
            initialValue={reportChartDefinition.folder}
            inputType='string'
            label='Folder'
            onValueChange={(n) => {
              reportChartDefinition.folder = n
              onUpdateDefinition(reportChartDefinition)
            }}
            classNameBg='bg-content dark:bg-contentDark'
            classNameHoverBg='bg-bg2'
            classNameHoverBgDark='bg-bg2dark'
          ></InputField>
        </div>
        <div className='flex w-full gap-2'>
          <InputField
            initialValue={
              reportChartDefinition.sortedBy.startsWith('^')
                ? reportChartDefinition.sortedBy.substring(1)
                : reportChartDefinition.sortedBy
            }
            inputType='string'
            label='Sorted By'
            allowedValues={getFieldsAsDict()}
            onValueChange={(n: string) => {
              if (
                !entitySchema.fields.find(
                  (f) => f.name == n || (n.startsWith('^') && n.substring(1) == f.name),
                )
              )
                return
              reportChartDefinition.sortedBy = sortDescending ? '^' + n : n
              onUpdateDefinition(reportChartDefinition)
            }}
            classNameBg='bg-content dark:bg-contentDark'
            classNameHoverBg='bg-bg2'
            classNameHoverBgDark='bg-bg2dark'
          ></InputField>
          <InputField
            initialValue={sortDescending}
            inputType='bool'
            label='Descending'
            onValueChange={(n: boolean) => {
              setSortDescending(n)
              if (reportChartDefinition.sortedBy.startsWith('^') && !n) {
                reportChartDefinition.sortedBy = reportChartDefinition.sortedBy.substring(1)
              }
              if (!reportChartDefinition.sortedBy.startsWith('^') && n) {
                reportChartDefinition.sortedBy = '^' + reportChartDefinition.sortedBy
              }

              onUpdateDefinition(reportChartDefinition)
            }}
            classNameBg='bg-content dark:bg-contentDark'
            classNameHoverBg='bg-bg2'
            classNameHoverBgDark='bg-bg2dark'
          ></InputField>
        </div>
        <div className='flex w-full gap-2'>
          <InputField
            initialValue={reportChartDefinition.limit}
            inputType='number'
            label='Limit'
            onValueChange={(n) => {
              reportChartDefinition.limit = n
              onUpdateDefinition(reportChartDefinition)
            }}
            classNameBg='bg-content dark:bg-contentDark'
            classNameHoverBg='bg-bg2'
            classNameHoverBgDark='bg-bg2dark'
          ></InputField>
          <InputField
            initialValue={reportChartDefinition.prefixToRemove || ''}
            inputType='string'
            label='Prefix to Remove'
            onValueChange={(n) => {
              reportChartDefinition.prefixToRemove = n
              onUpdateDefinition(reportChartDefinition)
            }}
            classNameBg='bg-content dark:bg-contentDark'
            classNameHoverBg='bg-bg2'
            classNameHoverBgDark='bg-bg2dark'
          ></InputField>
        </div>
        <div className='flex w-full gap-2'>
          {reportChartDefinition.type == 'Bar' && (
            <InputField
              initialValue={reportChartDefinition.horizontal}
              inputType='bool'
              label='Horizontal'
              onValueChange={(n: boolean) => {
                reportChartDefinition.horizontal = n
                onUpdateDefinition(reportChartDefinition)
              }}
              classNameBg='bg-content dark:bg-contentDark'
              classNameHoverBg='bg-bg2'
              classNameHoverBgDark='bg-bg2dark'
            ></InputField>
          )}
          {reportChartDefinition.type == 'Bar' && (
            <InputField
              initialValue={reportChartDefinition.stacked}
              inputType='bool'
              label='Stacked'
              onValueChange={(n: boolean) => {
                reportChartDefinition.stacked = n
                onUpdateDefinition(reportChartDefinition)
              }}
              classNameBg='bg-content dark:bg-contentDark'
              classNameHoverBg='bg-bg2'
              classNameHoverBgDark='bg-bg2dark'
            ></InputField>
          )}
        </div>
        <MultiInputField
          label='Group by'
          initialOptions={
            reportChartDefinition.groupBy
              ? reportChartDefinition.groupBy?.map((gp) => {
                  return { label: gp, value: gp }
                })
              : []
          }
          onOptionsSet={(os) => {
            reportChartDefinition.groupBy = os.map((o) => o.value)
            onUpdateDefinition(reportChartDefinition)
          }}
          options={entitySchema.fields.map((f) => {
            return { label: f.name, value: f.name }
          })}
          classNameBg='bg-content dark:bg-contentDark'
          classNameHoverBg='bg-bg2'
          classNameHoverBgDark='bg-bg2dark'
        ></MultiInputField>
        <MultiInputField
          label='Stack by'
          initialOptions={
            reportChartDefinition.stackBy
              ? reportChartDefinition.stackBy?.map((gp) => {
                  return { label: gp, value: gp }
                })
              : []
          }
          onOptionsSet={(os) => {
            reportChartDefinition.stackBy = os.map((o) => o.value)
            onUpdateDefinition(reportChartDefinition)
          }}
          options={entitySchema.fields.map((f) => {
            return { label: f.name, value: f.name }
          })}
          classNameBg='bg-content dark:bg-contentDark'
          classNameHoverBg='bg-bg2'
          classNameHoverBgDark='bg-bg2dark'
        ></MultiInputField>
        {reportChartDefinition.reportValues?.map((rv) => (
          <div key={rv} className='flex w-full gap-2'>
            <InputField
              initialValue={getAggregateFunction(rv)}
              inputType='string'
              label='Aggregate Function'
              allowedValues={{ avg: 'Average', sum: 'Sum', min: 'Max', max: 'Max', count: 'Count' }}
              onValueChange={(n: string) => {}}
              classNameBg='bg-content dark:bg-contentDark'
              classNameHoverBg='bg-bg2'
              classNameHoverBgDark='bg-bg2dark'
            ></InputField>
            <InputField
              label='Aggregate Field'
              initialValue={getAggregateField(rv)}
              onValueChange={(os) => {}}
              allowedValues={getFieldsAsDict()}
              inputType='string'
              classNameBg='bg-content dark:bg-contentDark'
              classNameHoverBg='bg-bg2'
              classNameHoverBgDark='bg-bg2dark'
            ></InputField>
            <button
              className='pt-5 text-red-500 dark:text-red-300'
              onClick={() => removeReportValue(rv)}
            >
              <TrashIcon></TrashIcon>
            </button>
          </div>
        ))}
        <div className='flex w-full gap-2'>
          <InputField
            initialValue={currentAggregatFunction}
            inputType='string'
            label='Add Aggregate Function'
            allowedValues={{ avg: 'Average', sum: 'Sum', min: 'Max', max: 'Max', count: 'Count' }}
            onValueChange={(n: string) => {
              addReportValueFunction(n)
            }}
            classNameBg='bg-content dark:bg-contentDark'
            classNameHoverBg='bg-bg2'
            classNameHoverBgDark='bg-bg2dark'
          ></InputField>
          <InputField
            label='Add Aggregate Field'
            initialValue={currentAggregateField}
            onValueChange={(f) => {
              addReportValueField(f)
            }}
            allowedValues={getNumberFieldsAsDict()}
            inputType='string'
            classNameBg='bg-content dark:bg-contentDark'
            classNameHoverBg='bg-bg2'
            classNameHoverBgDark='bg-bg2dark'
          ></InputField>
        </div>
      </div>
    </div>
  )

  // return (
  //   <div className='text-sm p-1 flex gap-2 w-full overflow-auto h-full'>
  //     <div className='h-full border-0 '>
  //       <div className='flex flex-col justify-between w-full'>
  //         <InputField
  //           initialValue={reportChartDefinition.name}
  //           inputType='string'
  //           label='Name'
  //           onValueChange={(n) => {
  //             reportChartDefinition.name = n
  //             onUpdateDefinition(reportChartDefinition)
  //           }}
  //         ></InputField>
  //       </div>
  //       <div className='flex flex-col justify-between w-full'>
  //         <InputField
  //           initialValue={reportChartDefinition.folder}
  //           inputType='string'
  //           label='Folder'
  //           onValueChange={(n) => {
  //             reportChartDefinition.folder = n
  //             onUpdateDefinition(reportChartDefinition)
  //           }}
  //         ></InputField>
  //       </div>
  //       <div className='flex flex-col justify-between w-full'>
  //         <InputField
  //           initialValue={reportChartDefinition.limit}
  //           inputType='number'
  //           label='Limit'
  //           onValueChange={(n) => {
  //             reportChartDefinition.limit = n
  //             onUpdateDefinition(reportChartDefinition)
  //           }}
  //         ></InputField>
  //       </div>
  //       <div className='flex flex-col justify-between w-full'>
  //         <InputField
  //           initialValue={reportChartDefinition.sortedBy}
  //           inputType='text'
  //           label='Sorted By'
  //           onValueChange={(n: string) => {
  //             console.log('n', n.substring(1))
  //             if (
  //               !entitySchema.fields.find(
  //                 (f) => f.name == n || (n.startsWith('^') && n.substring(1) == f.name),
  //               )
  //             )
  //               return
  //             console.log('yes')
  //             reportChartDefinition.sortedBy = n
  //             onUpdateDefinition(reportChartDefinition)
  //           }}
  //         ></InputField>
  //       </div>
  //       <div className='flex flex-col justify-between w-full'>
  //         <label className='p-0'>Type</label>
  //         <DropdownSelect
  //           options={[
  //             { label: 'Table', value: 'Table' },
  //             { label: 'Bar', value: 'Bar' },
  //             { label: 'Pie', value: 'Pie' },
  //             { label: 'Line', value: 'Line' },
  //             { label: 'Area', value: 'Area' },
  //             { label: 'Donut', value: 'Donut' },
  //           ]}
  //           initialOption={{ label: reportChartDefinition.type, value: reportChartDefinition.type }}
  //           onOptionSet={(o) => {
  //             reportChartDefinition.type = o?.value
  //             onUpdateDefinition(reportChartDefinition)
  //           }}
  //         ></DropdownSelect>
  //       </div>
  //       {reportChartDefinition.type == 'Bar' && (
  //         <div className='flex justify-between w-full  gap-1'>
  //           <label>Horizontal</label>
  //           <div>
  //             <input
  //               className='h-full text-sm rounded-md bg-bg1 dark:bg-bg2dark block w-full p-1
  //                border border-contentBorder dark:border-contentBorderDark'
  //               type='checkbox'
  //               checked={reportChartDefinition.horizontal}
  //               onChange={(e) => {
  //                 reportChartDefinition.horizontal = e.target.checked
  //                 console.log('horizontal', reportChartDefinition.horizontal)
  //                 onUpdateDefinition(reportChartDefinition)
  //               }}
  //             ></input>
  //           </div>
  //         </div>
  //       )}
  //       {reportChartDefinition.type == 'Line' && (
  //         <div className='flex justify-between w-full  gap-1'>
  //           <label>MultiAxis</label>
  //           <div>
  //             <input
  //               className='h-full text-sm rounded-md bg-bg1 dark:bg-bg2dark block w-full p-1
  //                border border-contentBorder dark:border-contentBorderDark'
  //               type='checkbox'
  //               checked={reportChartDefinition.multiAxis}
  //               onChange={(e) => {
  //                 reportChartDefinition.multiAxis = e.target.checked
  //                 onUpdateDefinition(reportChartDefinition)
  //               }}
  //             ></input>
  //           </div>
  //         </div>
  //       )}
  //       {reportChartDefinition.type == 'Area' && (
  //         <div className='flex justify-between w-full  gap-1'>
  //           <label>Stacked</label>
  //           <div>
  //             <input
  //               className='h-full text-sm rounded-md bg-bg1 dark:bg-bg2dark block w-full p-1
  //                border border-contentBorder dark:border-contentBorderDark'
  //               type='checkbox'
  //               checked={reportChartDefinition.stacked}
  //               onChange={(e) => {
  //                 reportChartDefinition.stacked = e.target.checked
  //                 onUpdateDefinition(reportChartDefinition)
  //               }}
  //             ></input>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //     <div className='groupby'>
  //       <label>Group By</label>
  //       <div className='border p-1 dark:border-bg8dark'>
  //         {entitySchema.fields.map((f) => (
  //           <div key={f.name} className='flex justify-between w-full  gap-1'>
  //             <label>{f.name}</label>
  //             <div>
  //               <input
  //                 className='h-full text-sm rounded-md bg-bg1 dark:bg-bg2dark block w-full p-1
  //                border border-contentBorder dark:border-contentBorderDark'
  //                 type='checkbox'
  //                 checked={
  //                   reportChartDefinition.groupBy
  //                     ? reportChartDefinition.groupBy.includes(f.name)
  //                       ? true
  //                       : false
  //                     : false
  //                 }
  //                 onChange={(e) => {
  //                   setGroupBy(f.name, e.target.checked)
  //                 }}
  //               ></input>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //     <div className='stackby'>
  //       <label>Stack By</label>
  //       <div className='border p-1 dark:border-bg8dark'>
  //         {entitySchema.fields.map((f) => (
  //           <div key={f.name} className='flex justify-between w-full  gap-1'>
  //             <label>{f.name}</label>
  //             <div>
  //               <input
  //                 className='h-full text-sm rounded-md bg-bg1 dark:bg-bg2dark block w-full p-1
  //                border border-contentBorder dark:border-contentBorderDark'
  //                 type='checkbox'
  //                 checked={
  //                   reportChartDefinition.stackBy
  //                     ? reportChartDefinition.stackBy.includes(f.name)
  //                       ? true
  //                       : false
  //                     : false
  //                 }
  //                 onChange={(e) => {
  //                   setStackBy(f.name, e.target.checked)
  //                 }}
  //               ></input>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //     <div className='aggregates flex flex-col'>
  //       <h1>Values</h1>
  //       <div className='flex gap-1 overflow-auto'>
  //         {aggregateFunctions.map((af) => (
  //           <div className='' key={af}>
  //             <div className=''>
  //               <label>{af}</label>
  //               <div className='border p-1 dark:border-bg8dark'>
  //                 {entitySchema.fields
  //                   .filter(
  //                     (f: FieldSchema) =>
  //                       ['int', 'integer', 'int16', 'int32', 'decimal', 'float', 'single'].includes(
  //                         f.type.toLowerCase(),
  //                       ) && f.name.toLowerCase() != 'id',
  //                   )
  //                   .map((f) => (
  //                     <div key={f.name} className='flex justify-between w-full gap-1'>
  //                       <label>{f.name}</label>
  //                       <div>
  //                         <input
  //                           className='h-full text-sm rounded-md bg-bg1 dark:bg-bg2dark block w-full p-1
  //                             border border-contentBorder dark:border-contentBorderDark'
  //                           type='checkbox'
  //                           checked={
  //                             reportChartDefinition.reportValues
  //                               ? reportChartDefinition.reportValues.includes(
  //                                   applyAggregate(af, f.name),
  //                                 )
  //                                 ? true
  //                                 : false
  //                               : false
  //                           }
  //                           onChange={(e) => {
  //                             setValue(applyAggregate(af, f.name), e.target.checked)
  //                           }}
  //                         ></input>
  //                       </div>
  //                     </div>
  //                   ))}
  //               </div>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //     <div className='aggregates flex flex-col  w-full'>
  //       <h1>Custom Values</h1>
  //       <div className='flex flex-col gap-1 overflow-auto w-full'>
  //         {reportChartDefinition.reportValues
  //           ?.filter((rv) => isCustomValue(rv))
  //           .map((rv) => (
  //             <div className='flex gap-1 w-full'>
  //               <input
  //                 className='border-bg6 dark:border-bg6dark border dark:bg-bg1dark px-1 outline-none w-full'
  //                 defaultValue={rv}
  //                 disabled
  //               ></input>
  //               <button
  //                 className='hover:bg-bg6 dark:hover:bg-bg6dark p-1 rounded-sm  text-red-500 dark:text-red-400'
  //                 onClick={() => setValue(rv, false)}
  //               >
  //                 <TrashIcon></TrashIcon>
  //               </button>
  //             </div>
  //           ))}
  //         <div className='flex gap-1'>
  //           <input
  //             className='border-bg6 dark:border-bg6dark border dark:bg-bg1dark px-1 outline-none  w-full'
  //             value={currentCustomValue}
  //             onChange={(e) => setCurrentCustomValue(e.target.value)}
  //           ></input>
  //           <button
  //             className='hover:bg-bg6 dark:hover:bg-bg6dark p-1 rounded-sm'
  //             onClick={(e: any) => {
  //               setValue(currentCustomValue, true)
  //               setCurrentCustomValue('')
  //             }}
  //           >
  //             <PlusCircleIcon></PlusCircleIcon>
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // )
}

export default ReportChartEditor
