
export class UsecaseState {

    public title: string = '';

    /**
     * a UUID/GUID for the current instance of a usecase 
     */
    public usecaseInstanceUid: string = '';

    /**
     * the 'Type' of the usecase
     */
    public usecaseKey: string = '';

    public parentWorkspaceKey: string = '';

    /**
     * a 'fixed' or 'static' usecase will never be terminated - it it always present in its parent workspace
     */
    public fixed: boolean = true;

    /**
     * a custom structure representin the persistable state of an usecase 
     */
    public unitOfWork: object = {};

}
