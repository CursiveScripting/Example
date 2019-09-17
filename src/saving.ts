import { IUserProcessData } from 'cursive-ui/lib';

export async function loadProcesses() {
  const saved = sessionStorage.getItem('saved');
  
  return saved === null
      ? null
      : JSON.parse(saved) as IUserProcessData[];
}

export async function saveProcesses(processData: IUserProcessData[]) {
  const processJson = JSON.stringify(processData);
  sessionStorage.setItem('saved', processJson);
}