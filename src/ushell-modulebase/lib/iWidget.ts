import { UsecaseState } from './usecaseState';
import { IWidgetHost } from './iWidgetHost';

export interface IWidget {

  /**
   * will be pushed by right after initialization...
   */
  state: UsecaseState;

  /**
   * will be pushed by right after initialization...
   */
  widgetHost: IWidgetHost;

  // getUsecaseRuntimeTags(): string[];

}
