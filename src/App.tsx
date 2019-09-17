import * as React from 'react';
import './App.css';
import { loadProcesses, saveProcesses } from './saving';
import CursiveUI, { ICustomTool, IUserProcessData } from 'cursive-ui/lib';
import { IntegerWorkspace } from './IntegerWorkspace';

const workspace = new IntegerWorkspace();

const customTools: ICustomTool[] = [{
    prompt: 'Run Process',
    iconBackground: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-play'><polygon points='5 3 19 12 5 21 5 3'></polygon></svg>")`,
    unsavedConfirmation: 'You have unsaved changes. Run last saved version?',
    action: runProcess,
}];

export const App = () => (
    <CursiveUI
        className="fullScreen"
        loadWorkspace={async () => workspace.saveWorkspace()}
        loadProcesses={loadProcessData}
        saveProcesses={saveProcessData}
        customTools={customTools}
    />
);

async function loadProcessData() {
    const processData = await loadProcesses();
    if (processData !== null) {
        const errors = workspace.loadUserProcesses(processData, true)
    }
    return processData;
}

async function saveProcessData(data: IUserProcessData[]) {
    await saveProcesses(data);
    workspace.loadUserProcesses(data, true);
}

async function runProcess() {
    const input = window.prompt('Provide an input number', '1');

    if (input === null) {
        return;
    }

    const number = parseInt(input);
    
    const result = await workspace.modifyNumber(number);

    alert(`Process complete! Result: ${result}`);
}