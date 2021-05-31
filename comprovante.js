import { readDB } from './commom.js';

function getIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('id')
}

function buildComprovante(owner) {
  const inputs = [
    document.getElementById('nome'),
    document.getElementById('placa'),
    document.getElementById('data'),
    document.getElementById('hora'),
  ]

  inputs.forEach((input) => {
    input.value = owner[input.id]
  })
}

const db = readDB();
const owner = db.find((owner) => owner.id === getIdFromUrl())
buildComprovante(owner)



