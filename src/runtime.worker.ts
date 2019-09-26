import { Workspace } from 'cursive-runtime';

function postMsg(msg: string, payload?: any) {
    (self as any).postMessage([msg, payload]);
}

const fakeImport = () => import('./emptyModule');

/*
const createWorkspaceDontUse = () => {
    return import('./IntegerWorkspace')
        .then(module => new module.IntegerWorkspace());
}
*/
let workspace: Workspace;

self.onmessage = async (e: any) => {
    const data = e.data as [string, any];
    const message = data[0];
    const payload = data[1];

    if (message === 'init') {
        const evaledPayload = eval(payload);

        //console.log('in worker', createWorkspaceDontUse.toString());

        console.log('evalled payload', evaledPayload.toString());
        
        workspace = await /*createWorkspaceDontUse(); */evaledPayload();
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
