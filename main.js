'use strict'
// owner = proprietario
import {readDB} from './commom.js';

const openModal = () => document.querySelector('.modal')
    .classList.add('active')

const closeModal = () => document.querySelector('.modal')
    .classList.remove('active')

const setDB = (db) => localStorage.setItem('db', JSON.stringify(db))

const insertDB = (owner) => {
    const db = readDB()
    db.push(owner)
    setDB(db)
}

const updateOwner = (owner, index) => {
    const db = readDB
    db[index] = owner
    setDB(db)
}

const clearTable = () => {
    const recordOwner = document.querySelector('#table tbody')
    while (recordOwner.firstChild) {
        recordOwner.removeChild(recordOwner.lastChild)
    }
}

const createRow = (owner, index) => {
    const recordOwner = document.querySelector('#table tbody')
    const newTr = document.createElement('tr')
    newTr.innerHTML = `
        <td>${owner.nome}</td>
        <td>${owner.placa}</td>
        <td>${owner.data}</td>
        <td>${owner.hora}</td>
        <td>
            <button class="button green" type="button" data-owerid="${owner.id}" data-action="comp-${index}" id="comp">Comp.</button>
            <button class="button blue" type="button" id="editar" data-action="editar-${index}">Editar</button>
            <button class="button red" type="button" id="saida" data-action="saida-${index}">Saída</button>
        </td>
    `
    recordOwner.appendChild(newTr)
}

const createComprovante = (owner, index) => {
    const recordOwner = document.querySelector('#form-receipt')
    const newInput = document.createElement('input')
    newInput.innerHTML = `
                    <label>Nome:</label>
                    <input class="input-readonly" value="${owner.nome}" readonly/>

                    <label>Placa:</label>
                    <input class="input-readonly" value="${db.placa}" readonly/>

                    <label>Data:</label>
                    <input class="input-readonly" value="${db.data}" readonly/>

                    <label>Hora:</label>
                    <input class="input-readonly" value="${db.hora}" readonly/>
    `
    recordOwner.appendChild(newInput)
}

const updateComp = () => {
    const db = readDB()
    db.forEach(createComprovante)
}

const updateTable = () => {
    clearTable()
    const db = readDB()
    db.forEach(createRow)
}

const clearInput = () => {
    document.querySelector('#nome').value = ''
    document.querySelector('#placa').value = ''
}

const isValidForm = () => document.querySelector('#form-register').reportValidity()

const saveOwner = () => {
    if (isValidForm()) {
        const data = new Date();

        const hours = data.getHours()
        const minutes = data.getMinutes()
        const day = data.getDate()
        const mouth = data.getMonth()
        const year = data.getFullYear()

        const dateNow = day + '/' + mouth + '/' + year
        const hoursMinutesNow = hours + ':' + minutes

        const newOwner = {
            nome: document.querySelector('#nome').value,
            placa: document.querySelector('#placa').value,
            data: dateNow,
            hora: hoursMinutesNow
        }
        newOwner.id = newOwner.nome + newOwner.placa + newOwner.data

        const index = document.querySelector('#nome').dataset.index

        if (index != '') {
            insertDB(newOwner)
        } else {
            updateOwner(newOwner, index)
        }

        clearInput()

        updateTable()
    }
}

const deleteOwner = (index) => {
    const db = readDB()
    const resp = confirm(`Deseja confirmar a saida de ${db[index].nome}?`)

    if (resp) {
        db.splice(index, 1)
        setDB(db)
        updateTable()
    }
}

const editOwner = (index) => {
    const db = readDB()
    document.querySelector('#nome').value = db[index].nome
    document.querySelector('#placa').value = db[index].placa
    document.querySelector('#nome').dataset.index = index
    console.log("editOwner")
    openModal()
}


function actionButtons(event) {
    const element = event.target
    if (element.type !== 'button') {
        return;
    }
    const action = element.dataset.action.split('-')
    const id = element.dataset.owerid;

    const actions = {
        'saida': () => deleteOwner(action[1]),
        'editar': () => editOwner(action[1]),
        'comp': () => window.location.replace('comprovante.html?id=' + id),
    }

    const actionCallback = actions[action[0]]
    actionCallback()
}



document.querySelector('#salvar').addEventListener('click', saveOwner)
// document.querySelector('#comp').addEventListener('click', updateComp)
// document.querySelector('#editar').addEventListener('click', console.log("editar"))
// document.querySelector('#saida').addEventListener('click', console.log("saida"))
document.querySelector('#table').addEventListener('click', actionButtons)

updateTable()
