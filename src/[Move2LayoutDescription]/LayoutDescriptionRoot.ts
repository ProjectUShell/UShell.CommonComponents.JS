import { ControlPreference } from './ControlPreference'
import { EntityLayout } from './EntityLayout'

export class LayoutDescriptionRoot {
  public timestampUtc?: string = ''
  public semanticVersion?: string = ''

  public entityLayouts: EntityLayout[] = []

  public controlPreference?: ControlPreference
}
