export async function loadProcesses() {
  const saved = sessionStorage.getItem('saved');
  
  return saved === null
      ? null
      : JSON.parse(saved);
}

export async function saveProcesses(processJson: string) {
  sessionStorage.setItem('saved', processJson);
}