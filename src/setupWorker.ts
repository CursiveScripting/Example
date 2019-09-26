import { Workspace } from 'cursive-runtime';
import { StructuredCloneable } from './StructuredCloneable';

function postMsg(msg: string, payload?: any) {
    (postMessage as any)([msg, payload]);
}

let workspace: Workspace | undefined;
let runner: (workspace: Workspace, payload: any) => Promise<void | StructuredCloneable>;

onmessage = async e => {
    if (workspace === undefined) {
        throw new Error('setupWorker has not been called for this worker');
    }

    const data = e.data as [string, any];
    const message = data[0];
    const payload = data[1];

    if (message === 'init') {
        postMsg('inited', workspace.saveWorkspace());
    }
    else if (message === 'load') {
        workspace.loadUserProcesses(payload, true);
    }
    else if (message === 'run') {
        const result = await runner(workspace, payload);
        postMsg('success', result);
    }
}

export function setupWorker<TWorkspace extends Workspace>(actualWorkspace: TWorkspace, workspaceRunner: (workspace: TWorkspace, payload: any) => Promise<void | StructuredCloneable>) {
    workspace = actualWorkspace;
    runner = workspaceRunner as any;
}