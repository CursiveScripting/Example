import { Workspace, IUserProcessData, IWorkspaceData } from 'cursive-runtime';

export class RuntimeHandler<TWorkspace extends Workspace> {
    private loadPromise: Promise<IWorkspaceData>;
    private loadResolve?: (value: IWorkspaceData | PromiseLike<IWorkspaceData> | undefined) => void;

    constructor(
        private readonly workspace: TWorkspace,
        private readonly loadProcessData: () => Promise<IUserProcessData[] | null>,
        private readonly saveProcessData: (data: IUserProcessData[]) => Promise<void>
    ) {
        this.loadPromise = new Promise<IWorkspaceData>(resolve => {
            this.loadResolve = resolve;
        });
        
        this.serialiseWorkspace();
    }

    private async serialiseWorkspace() {
        const workspaceData = await this.workspace.saveWorkspace();

        if (this.loadResolve !== undefined) {
            this.loadResolve(workspaceData);
            this.loadResolve = undefined;
        }
    }

    public loadWorkspace() {
        return this.loadPromise;
    }
    
    public async loadProcesses() {
        const processData = await this.loadProcessData();
        if (processData !== null) {
            this.postProcesses(processData);
        }
        return processData;
    }

    public async saveProcesses(processData: IUserProcessData[]) {
        await this.saveProcessData(processData);
        this.postProcesses(processData);
    }

    public async run<TResult>(action: (workspace: TWorkspace) => Promise<TResult>) {
        return await action(this.workspace);
    }

    private postProcesses(processJson: IUserProcessData[]) {
        const errors = this.workspace.loadUserProcesses(processJson, true);
    }
}