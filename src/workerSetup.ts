import { Workspace } from 'cursive-runtime';

function postMsg(msg: string, payload?: any) {
    (postMessage as any)([msg, payload]);
}

let workspace: Workspace | undefined;

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
        const runThis = eval(payload);
        const result = await runThis(workspace);
        postMsg('success', result);
    }
}

export function setupWorker(actualWorkspace: Workspace) {
    workspace = actualWorkspace;
}