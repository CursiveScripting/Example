import { IUserProcessData, IWorkspaceData } from 'cursive-ui';
import { StructuredCloneable } from './StructuredCloneable';

export class CursiveWorkerRuntime {
    private loadPromise: Promise<IWorkspaceData>;
    private loadResolve?: (value: IWorkspaceData | PromiseLike<IWorkspaceData> | undefined) => void;

    private runResolve?: (value: any | PromiseLike<any> | undefined) => void;

    constructor(
        private readonly worker: Worker,
        private readonly loadProcessData: () => Promise<IUserProcessData[] | null>,
        private readonly saveProcessData: (data: IUserProcessData[]) => Promise<void>
    ) {
        this.worker.onmessage = (m) => {
            const data = m.data as [string, any];
            const message = data[0];
            const payload = data[1];
    
            if (message === 'inited') {
                if (this.loadResolve !== undefined) {
                    this.loadResolve(payload);
                    this.loadResolve = undefined;
                }
            }
            else if (message === 'success') {
                if (this.runResolve !== undefined) {
                    this.runResolve(payload);
                    this.runResolve = undefined;
                }
            }
            else {
                alert(`Unexpected response message: ${message}`);
            }
        };

        this.worker.postMessage(['init']);

        this.loadPromise = new Promise<IWorkspaceData>(resolve => {
            this.loadResolve = resolve;
        });
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

    public run(operation: StructuredCloneable) {
        this.worker.postMessage(['run', operation]);

        return new Promise<StructuredCloneable>(resolve => {
            this.runResolve = resolve;
        });
    }

    private async postProcesses(processJson: IUserProcessData[]) {
        this.worker.postMessage(['load', processJson]);
    }
}