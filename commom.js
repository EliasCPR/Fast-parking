export function readDB() {
  return JSON.parse(window.localStorage.getItem('db')) ?? [];
}

export function readDBPrice() {
  return JSON.parse(window.localStorage.getItem('price')) ?? [];
}