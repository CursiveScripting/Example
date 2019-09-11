import { IntegerWorkspace } from './IntegerWorkspace';
import { saveWorkspace } from 'cursive-runtime/lib/services/saveWorkspace';

function postMsg(msg: string, payload?: any) {
    (self as any).postMessage([msg, payload]);
}

var workspace = new IntegerWorkspace();

postMsg('init', saveWorkspace(workspace));

self.onmessage = async (e: any) => {
    const data = e.data as [string, any];
    const message = data[0];
    const payload = data[1];

    if (message === 'load') {
        workspace.loadUserProcesses(payload, true);
    }
    else if (message === 'run') {
        const result = await workspace.modifyNumber(payload);
        postMsg('success', result);
    }
}
