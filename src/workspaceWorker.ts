import { setupWorker } from './setupWorker';
import { IntegerWorkspace } from './IntegerWorkspace';

async function runWorkspace(workspace: IntegerWorkspace, runData: [string, number]) {
    switch (runData[0]) {
        case 'modify number':
            return await workspace.modifyNumber(runData[1]);

        default:
            throw new Error(`Unexpected command: ${runData[0]}`);
    }
}

setupWorker(new IntegerWorkspace(), runWorkspace);