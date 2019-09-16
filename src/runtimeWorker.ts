import { Workspace } from 'cursive-runtime';

function postMsg(msg: string, payload?: any) {
    (self as any).postMessage([msg, payload]);
}

let workspace: Workspace;

self.onmessage = async (e: any) => {
    const data = e.data as [string, any];
    const message = data[0];
    const payload = data[1];

    if (message === 'init') {
        workspace = eval(payload)();
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
