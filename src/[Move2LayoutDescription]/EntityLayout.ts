import { ControlPreference } from './ControlPreference'
import { FieldLayout } from './FieldLayout'

export class LayoutPartition {
  public name: string = ''
  public type: 'group' | 'column' = 'group'
  public children: LayoutPartition[] = []
  public fields: string[] = []
}

export class EntityLayout {
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

  public dislpayRemainingFields: boolean = true
}
