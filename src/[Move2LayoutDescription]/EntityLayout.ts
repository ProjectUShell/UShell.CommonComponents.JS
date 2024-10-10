import { ControlPreference } from './ControlPreference'
import { FieldLayout } from './FieldLayout'

export class LayoutPartition {
  public name: string = ''
  public type: 'group' | 'column' = 'group'
  public children: LayoutPartition[] = []
  public fields: string[] = []
}

export class EntityLayout {
  constructor(
    entityName: string,
    fieldLayouts?: FieldLayout[],
    displayLabel?: string,
    displayLabelPlural?: string,
    identityLabelPattern?: string,
    isBlEntrypoint?: boolean,
    controlPreference?: ControlPreference,
    partitions?: LayoutPartition[],
    dislpayRemainingFields?: boolean,
  ) {
    this.entityName = entityName || ''
    this.displayLabel = displayLabel || ''
    this.displayLabelPlural = displayLabelPlural || ''
    this.identityLabelPattern = identityLabelPattern || ''
    this.isBlEntrypoint = isBlEntrypoint || false
    this.fieldLayouts = fieldLayouts || []
    this.controlPreference = controlPreference
    this.partitions = partitions || []
    this.dislpayRemainingFields = dislpayRemainingFields || true
  }
  public entityName: string = ''

  /** a non-technical NAME which only represents the entity class (no identity): for expample 'Person' */
  public displayLabel: string = ''
  public displayLabelPlural: string = ''

  /** a placeholder-pattern, representing the identity of one concrete record: for expample '{firstname} {lastname}' */
  public identityLabelPattern: string = ''
  public isBlEntrypoint: boolean = false
  public fieldLayouts: FieldLayout[] = []
  public controlPreference?: ControlPreference
  public partitions: LayoutPartition[] = []
  public tableFields?: string[] = []
  public dislpayRemainingFields: boolean = true
}
