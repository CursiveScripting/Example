/* eslint import/no-webpack-loader-syntax: off */
import RuntimeWorker from 'worker-loader!./runtimeWorker';
import { Workspace } from 'cursive-runtime';
import { IUserProcessData, IWorkspaceData } from 'cursive-ui';

export class RuntimeHandler<TWorkspace extends Workspace> {
    private readonly worker: Worker;

    private loadPromise: Promise<IWorkspaceData>;
    private loadResolve?: (value: IWorkspaceData | PromiseLike<IWorkspaceData> | undefined) => void;

    private runResolve?: (value: any | PromiseLike<any> | undefined) => void;

    constructor(
        createWorkspace: () => TWorkspace,
        private readonly loadProcessData: () => Promise<IUserProcessData[] | null>,
        private readonly saveProcessData: (data: IUserProcessData[]) => Promise<void>
    ) {
        console.log(createWorkspace.toString());

        /*
        TODO: if we can do without worker loader by creating the worker with an object url
        as its contents, then by all means let's do so. No need to eject create-react-app then!
        */
        this.worker = new RuntimeWorker();

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

        this.worker.postMessage(['init', createWorkspace.toString()]);

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

    public run<TResult>(action: (workspace: TWorkspace) => Promise<TResult>) {
        this.worker.postMessage(['run', action]);

        return new Promise<TResult>(resolve => {
            this.runResolve = resolve;
        });
    }

    private createUrl(forFunction: () => void) {
        return URL.createObjectURL(new Blob([forFunction.toString()]));
    }

    private async postProcesses(processJson: IUserProcessData[]) {
        this.worker.postMessage(['load', processJson]);
    }
}