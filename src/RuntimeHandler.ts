import { Workspace, IUserProcessData } from 'cursive-runtime';

export class RuntimeHandler<TWorkspace extends Workspace> {
    constructor(
        private readonly workspace: TWorkspace,
        private readonly loadProcessData: () => Promise<IUserProcessData[] | null>,
        private readonly saveProcessData: (data: IUserProcessData[]) => Promise<void>
    ) { }

    public loadWorkspace() {
        return this.workspace.saveWorkspace();
    }
    
    public async loadProcesses() {
        const processData = await this.loadProcessData();
        if (processData !== null) {
            this.actuallyLoadProcesses(processData);
        }
        return processData;
    }

    public async saveProcesses(processData: IUserProcessData[]) {
        await this.saveProcessData(processData);
        this.actuallyLoadProcesses(processData);
    }

    public async run<TResult>(action: (workspace: TWorkspace) => Promise<TResult>) {
        return await action(this.workspace);
    }

    private actuallyLoadProcesses(processJson: IUserProcessData[]) {
        const errors = this.workspace.loadUserProcesses(processJson, true);
    }
}