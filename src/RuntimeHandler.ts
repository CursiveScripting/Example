/* eslint import/no-webpack-loader-syntax: off */
import RuntimeWorker from 'worker-loader!./runtimeWorker';
import { IUserProcessData, IWorkspaceData } from 'cursive-web-ui/lib';

export class RuntimeHandler {
    private readonly worker: Worker;

    private loadPromise: Promise<IWorkspaceData>;
    private loadResolve?: (value: IWorkspaceData | PromiseLike<IWorkspaceData> | undefined) => void;

    private runResolve?: (value: number | PromiseLike<number> | undefined) => void;

    constructor(
        private loadProcessData: () => Promise<IUserProcessData[] | null>,
        private saveProcessData: (data: IUserProcessData[]) => Promise<void>
    ) {
        this.worker = new RuntimeWorker();

        this.worker.onmessage = (m) => {
            const data = m.data as [string, any];
            const message = data[0];
            const payload = data[1];
    
            if (message === 'init') {
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
            else if (message === 'error') {
                alert(`Process error! ${payload}`);
            }
            else {
                alert(`Unexpected response message: ${message}`);
            }
        };

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

    public run(input: number) {
        this.worker.postMessage(['run', input]);

        return new Promise<number>(resolve => {
            this.runResolve = resolve;
        });
    }

    private async postProcesses(processJson: IUserProcessData[]) {
        this.worker.postMessage(['load', processJson]);
    }
}