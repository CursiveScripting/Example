import * as React from 'react';
import './App.css';
import CursiveUI, { ICustomTool, IUserProcessData } from 'cursive-ui';
import { IntegerWorkspace } from './IntegerWorkspace';
import initialProcess from './initialProcess.json';

const processSessionKey = 'saved';

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
        loadProcesses={loadProcesses}
        saveProcesses={saveProcesses}
        customTools={customTools}
    />
);

async function loadProcesses() {
    let processJson = sessionStorage.getItem(processSessionKey);
    
    const processData = processJson === null
        ? initialProcess as IUserProcessData[]
        : JSON.parse(processJson) as IUserProcessData[];
      
    const errors = workspace.loadUserProcesses(processData, true)
    
    return processData;
}

async function saveProcesses(processData: IUserProcessData[]) {
    const processJson = JSON.stringify(processData);

    sessionStorage.setItem(processSessionKey, processJson);

    workspace.loadUserProcesses(processData, true);
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