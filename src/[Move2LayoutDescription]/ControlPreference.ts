export class ControlPreference {
  /** only valid when a field.type == 'bool' */
  public displayBooleansAsDropdown: boolean = false

  /** only valid when a field.type == 'number' & Max/Min in set*/
  public displayNumbersAsSlider: boolean = false
}
