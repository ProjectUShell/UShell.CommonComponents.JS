import React from 'react'
import InstitutionIcon from '../_Icons/InstitutionIcon'
import DataBaseIcon from '../_Icons/DataBaseIcon'
import UniversityIcon from '../_Icons/UniversityIcon'
import HospitalIcon from '../_Icons/HospitalIcon'
import ReportSearchIcon from '../_Icons/ReportSearchIcon'
import WorkflowIcon from '../_Icons/WorkflowIcon'
import HumanQueueIcon from '../_Icons/HumanQueueIcon'
import ReportMedicalIcon from '../_Icons/ReportMedicalIcon'
import MoneyStackIcon from '../_Icons/MoneyStackIcon'
import ArrowUturnLeftIcon from '../_Icons/ArrowUturnLeftIcon'

export function getIcon(iconKey: string): React.JSX.Element {
  switch (iconKey.toLocaleLowerCase()) {
    case 'institution':
      return <InstitutionIcon></InstitutionIcon>
    case 'database':
      return <DataBaseIcon></DataBaseIcon>
    case 'university':
      return <UniversityIcon></UniversityIcon>
    case 'hospital':
      return <HospitalIcon strokeWidth={2}></HospitalIcon>
    case 'reportsearch':
      return <ReportSearchIcon size={1.5}></ReportSearchIcon>
    case 'workflow':
      return <WorkflowIcon></WorkflowIcon>
    case 'humanqueue':
      return <HumanQueueIcon></HumanQueueIcon>
    case 'reportmedical':
      return <ReportMedicalIcon></ReportMedicalIcon>
    case 'moneystack':
      return <MoneyStackIcon></MoneyStackIcon>
    case 'arrowuturnleft':
      return <ArrowUturnLeftIcon></ArrowUturnLeftIcon>
  }
  return <></>
}
