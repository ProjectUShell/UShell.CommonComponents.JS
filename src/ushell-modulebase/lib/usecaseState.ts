export class UsecaseState {
  public title = ''

  /**
   * a UUID/GUID for the current instance of a usecase
   */
  public usecaseInstanceUid = ''

  /**
   * the 'Type' of the usecase
   */
  public usecaseKey = ''

  public parentWorkspaceKey = ''

  /**
   * a 'fixed' or 'static' usecase will never be terminated - it it always present in its parent workspace
   */
  public fixed = true

  /**
   * a custom structure representin the persistable state of an usecase
   */
  public unitOfWork = {}
}
