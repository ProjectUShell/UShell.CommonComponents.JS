import { ControlPreference } from './ControlPreference'

export class FieldLayout {
  public displayLabel: string = ''

  /** name of the related eneity-field to bind */
  public fieldName: string = ''

  /** for tool-tip */
  public summary?: string = ''

  /** only valid when a field.type == 'text' */
  public textContentType?: 'plain' | 'markdown' | 'html' = 'plain'
  /** only valid when a field.type == 'text' */
  public textIsMultiLine?: boolean = false
  /** only valid when a field.type == 'text' */
  public textMaxLength?: number = 1000
  /** only valid when a field.type == 'text' */
  public textValidationRegex?: string | null = null

  public dropdownMode?: 'none' | 'static' | 'staticAndCustom' | 'staticFromDataSource' = 'none'

  public multiSelectSeparator?: string | null = null

  public allowCrudForLookUp?: boolean = undefined

  /** only valid when a field.dropdownMode == 'static'|'staticAndCustom' (in the form of '{'key':'label'}') */
  public dropdownStaticEntries?: { [key: string]: string }

  /** only valid when a field.dropdownMode == 'staticFromDataSource' */
  public dropdownDataSource?: string

  /** only valid when a field.type == 'number' */
  public numberDecimals?: number = 0
  /** only valid when a field.type == 'number' */
  public numberMin?: number = Number.MIN_VALUE
  /** only valid when a field.type == 'number' */
  public numberMax?: number = Number.MAX_VALUE

  /** only valid when a field.type == 'datetime' */
  public showDatePortion?: boolean = true
  /** only valid when a field.type == 'datetime' */
  public showTimePortion?: boolean = false

  /** the class-name of a custom validator to use */
  public validatorName?: string

  public required?: boolean = true

  public defaultValue?: string | null = null

  /**
   * Never = 0 (this field should only be set by wellknown technical automatisms),
   * OnCreation = 1 (this field should be setable when a record is created newly (or on full-import/recovery)),
   * OnSingleUpdate = 2 (this field should be setable during the usecase of an individual edit),
   * OnBatchUpdate = 4 (this field should be setable during a batch-update for multiple records),
   * AfterCreation = 6 (represents the logical combination of 'OnSingleUpdate' + 'OnBatchUpdate'),
   * Always = 7 (represents the logical combination of 'OnCreation' + 'AfterCreation')
   */
  public setabilityFlags?: number = 7

  /**
   * Indicates, if a field belongs to a more specific business domain.
   * This can be used to control the detail-grade (displayed fields) in the UI
   * or when exporting data in an abstract way.
   */
  public contentConcern?: string | null = null

  /**
   * Defines whether a field contains content that is commonly used for filtering.
   * This can have the values 0=None, 1=ExactMatch, 2=Substring (tect whcih has NOT the semantic of an ID/KEY)
   * This is a non-technical information, which relates to the domain model (business-level)!
   */
  public filterable?: number = 0

  public hidden?: boolean = false

  public controlPreference?: ControlPreference
}
