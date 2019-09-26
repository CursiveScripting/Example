import * as React from 'react';
import './App.css';
import { loadProcesses, saveProcesses } from './saving';
import CursiveUI, { ICustomTool, IUserProcessData } from 'cursive-ui';
import { RuntimeHandler } from './RuntimeHandler';
import { IntegerWorkspace } from './IntegerWorkspace';

const worker = new Worker('./workspaceWorker.ts', { name: 'runtime', type: 'module' });
const handler = new RuntimeHandler<IntegerWorkspace>(worker, loadProcesses, saveProcesses);

const customTools: ICustomTool[] = [{
    prompt: 'Run Process',
    iconBackground: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-play'><polygon points='5 3 19 12 5 21 5 3'></polygon></svg>")`,
    unsavedConfirmation: 'You have unsaved changes. Run last saved version?',
    action: runProcess,
}];

export const App = () => (
    <CursiveUI
        className="fullScreen"
        loadWorkspace={async () => handler.loadWorkspace()}
        loadProcesses={async () => await handler.loadProcesses()}
        saveProcesses={async (data: IUserProcessData[]) => await handler.saveProcesses(data)}
        customTools={customTools}
    />
);

async function runProcess() {
    const input = window.prompt('Provide an input number', '1');

    if (input === null) {
        return;
    }

    const number = parseInt(input);
    
    const result = await handler.run(['modify number', number]);

    alert(`Process complete! Result: ${result}`);
}