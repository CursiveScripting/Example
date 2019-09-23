import { Workspace } from 'cursive-runtime';
import { IUserProcessData, IWorkspaceData } from 'cursive-ui';

export class RuntimeHandler<TWorkspace extends Workspace> {
    private readonly worker: Worker;

    private loadPromise: Promise<IWorkspaceData>;
    private loadResolve?: (value: IWorkspaceData | PromiseLike<IWorkspaceData> | undefined) => void;

    private runResolve?: (value: any | PromiseLike<any> | undefined) => void;

    constructor(
        createWorkspace: () => Promise<TWorkspace>,
        private readonly loadProcessData: () => Promise<IUserProcessData[] | null>,
        private readonly saveProcessData: (data: IUserProcessData[]) => Promise<void>
    ) {
        this.worker = new Worker(this.createUrl(workerContent));

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
        let strFunction = forFunction.toString();
        const startIndex = strFunction.indexOf('{') + 1;
        const endIndex = strFunction.lastIndexOf('}');
        strFunction = strFunction.substring(startIndex, endIndex);

        return URL.createObjectURL(new Blob([strFunction]));
    }

    private async postProcesses(processJson: IUserProcessData[]) {
        this.worker.postMessage(['load', processJson]);
    }
}

const self = window;
function workerContent() {
    function postMsg(msg: string, payload?: any) {
        (self as any).postMessage([msg, payload]);
    }

    const __webpack_require__ = require;
    
    const makeRequireAvailable = () => import('./emptyModule');
    
    let workspace: Workspace;
    
    self.onmessage = async (e: any) => {
        const data = e.data as [string, any];
        const message = data[0];
        const payload = data[1];
    
        if (message === 'init') {
            workspace = await eval(payload)();
            postMsg('inited', workspace.saveWorkspace());
        }
        else if (message === 'load') {
            workspace.loadUserProcesses(payload, true);
        }
        else if (message === 'run') {
            const result = await payload(workspace);
            postMsg('success', result);
        }
    }
}