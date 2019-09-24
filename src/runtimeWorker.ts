import { Workspace } from 'cursive-runtime';

function postMsg(msg: string, payload?: any) {
    (postMessage as any)([msg, payload]);
}

const fakeImport = () => import('./emptyModule')

let workspace: Workspace;

onmessage = async e => {
    const data = e.data as [string, any];
    const message = data[0];
    const payload = data[1];

    if (message === 'init') {
        console.log('worker received init')

        const evaledPayload = eval(payload);
        
        workspace = await evaledPayload();
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