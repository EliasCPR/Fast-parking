export function readDB() {
  return JSON.parse(window.localStorage.getItem('db')) ?? [];
}
