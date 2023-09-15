import { IDataSource } from './iDataSource'
import { UsecaseState } from './usecaseState'

export interface IWidgetHost {
  populateChangedState(changedState: UsecaseState): void

  subscribeEvent(name: string, subscriber: (args: object) => void): void
  fireEvent(name: string, args: object): void

  /**
   * Tries to retieve an access token and returns it. If there is alredy a valid token for the gibe source,
   * then it will be retunred directly. Timedout tokens will automatically renewed before returnim them.
   * A return-value of null indicates, that the operation needs to be canceled, beacause of authentication failure
   * during token retrival...
   * @param tokenSourceUid a UUID/GUID addressing the source where the token should be retieved from
   */
  getAccessToken(tokenSourceUid: string): Promise<{ token: string; content: object } | null>

  getDataSource(dataSourceUid: string): Promise<IDataSource>
  getDataSourceForEntity(entityName: string, storeName?: string): Promise<IDataSource>

  /**
   * informs about the global (application-wide) preference,
   * on which side each wiget should render its own dedicated
   * navigation panel (if there is one)
   */
  get allignWidgetNavPanelLeft(): boolean
}
