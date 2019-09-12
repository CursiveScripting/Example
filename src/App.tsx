import * as React from 'react';
import './App.css';
import { loadProcesses, saveProcesses } from './saving';
import { IntegerWorkspace } from './IntegerWorkspace';
import CursiveUI from 'cursive-web-ui/lib';
import { ICustomTool } from 'cursive-web-ui/lib/ICustomTool';
import { saveWorkspace } from 'cursive-runtime/lib/services/saveWorkspace';

/* eslint import/no-webpack-loader-syntax: off */
import RuntimeWorker from 'worker-loader!./runtimeWorker';

function loadWorkspace() {
    // TODO: this should ideally come from the worker
    // rather than deserializing in the UI thread with a separate workspace instance
    return Promise.resolve(saveWorkspace(new IntegerWorkspace()));
}

const customTools: ICustomTool[] = [{
    prompt: 'Run Process',
    iconBackground: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-x'><line x1='18' y1='6' x2='6' y2='18'></line><line x1='6' y1='6' x2='18' y2='18'></line></svg>")`,
    unsavedConfirmation: 'You have unsaved changes. Run last saved version?',
    action: runProcess,
}];

export const App = () => (
    <CursiveUI
        className="fullScreen"
        loadWorkspace={loadWorkspace}
        loadProcesses={loadProcesses}
        saveProcesses={saveProcesses}
        customTools={customTools}
    />
);

let worker: Worker;

function createWorker() {
    worker = new RuntimeWorker();

    worker.onmessage = (m) => {
        const data = m.data as [string, any];
        const message = data[0];
        const payload = data[1];

        if (message === 'init') {
            alert('inited'); // TODO: yeah this doesn't currently serve any purpose
            alert(payload);
        }
        else if (message === 'success') {
            alert(`Process complete! Result: ${payload}`);
        }
        else if (message === 'error') {
            alert(`Process error! ${payload}`);
        }
        else {
            alert(`Unexpected response message: ${message}`);
        }
    };
}

createWorker();

async function runProcess() {
    const input = window.prompt('Provide an input number', '1');
    if (input === null) {
        return;
    }

    const number = parseInt(input);
    

    worker.postMessage(['load', await loadProcesses()]);
    worker.postMessage(['run', number]);
}