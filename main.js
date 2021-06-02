'use strict'
// owner = proprietario essa parte peguei do codigo de um colega por ter duvidas

import {
    readDB
} from './commom.js';

const readDBPrice = () => JSON.parse(window.localStorage.getItem('price')) ?? [];

const setDB = (db) => localStorage.setItem('db', JSON.stringify(db))

const insertDB = (owner) => {
    const db = readDB()
    db.push(owner)
    setDB(db)
}

const updateOwner = ({nome, placa}, index) => {
    const db = readDB()
    const newOwner = {
        nome, 
        placa,
        data: db[index].data,
        hora: db[index].hora
    }
    db[index] = newOwner
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
        <td id="teste">${owner.hora}</td>
        <td>
            <button class="button green" type="button" data-owerid="${owner.id}" data-action="comp-${index}" id="comp">Comp.</button>
            <button class="button blue" type="button" id="editar" data-action="editar-${index}">Editar</button>
            <button class="button red" type="button" id="saida" data-action="saida-${index}">Saída</button>
        </td>
    `
    recordOwner.appendChild(newTr)
}

const updateTable = () => {
    clearTable()
    const db = readDB()
    db.forEach(createRow)
}

const clearInput = () => {
    document.querySelector('#nome').value = ''
    document.querySelector('#placa').value = ''
    document.querySelector('#nome').dataset.index = ''
}

const date = () => {
    const data = new Date();

    let day = data.getDate() 
    let mouth = data.getMonth() + 1
    let year = data.getFullYear()

    let dateNow = day + '/' + mouth + '/' + year

    return dateNow
}

const hours = () => {
    const data = new Date();

    let hours = data.getHours()
    let minutes = data.getMinutes()

    let hoursNow = hours + ':' + minutes

    return hoursNow
}

const isValidForm = () => document.querySelector('#form-register').reportValidity()

const saveOwner = () => {
    const dbPrice = readDBPrice()

    if (isValidForm()) {

        if (dbPrice == '') {
            alert("Defina os preços antes de inserir um cliente")

        } else {
            const newOwner = {
                nome: document.querySelector('#nome').value,
                placa: document.querySelector('#placa').value,
                data:  date(),
                hora: hours()
            }
            newOwner.id = newOwner.nome + newOwner.placa + newOwner.data

            const index = document.querySelector('#nome').dataset.index

            if (index == "") {
                insertDB(newOwner)
                console.log("insert")
            } else {
                updateOwner(newOwner, index)
                console.log("update")
                // location.replace('index.html')
            }

            clearInput()

            updateTable()
            console.log("finalizado")
        }
    }
}

const licensePlateMask = (number) => {

    number = number.replace(/(^.{3}$)/,'$1-')
    number = number.replace(/(^.{9}$)/,'')
    return number
}

const applyMask = (event) => {
    event.target.value = licensePlateMask(event.target.value)
}

const debtPayable = (index) => {
    const dbPrice = readDBPrice()
    const db = readDB()

    let hoursOwner = db[index].hora
    let totalToPay = 0
    let firstHourPrice = dbPrice[0].primeiraHora.replace(",", ".")
    let anyHoursPrice = dbPrice[0].demaisHoras.replace(",", ".")

    const hoursArrivel = parseInt(hoursOwner.substr(0, 2)) * 3600
    const minutesArrivel = parseInt(hoursOwner.substr(3, 4)) * 60

    const departureHours = parseInt(hours().substr(0, 2)) * 3600
    const outgoingMinutes = parseInt(hours().substr(3, 4)) * 60

    const secondsExit = ((departureHours + outgoingMinutes) - (hoursArrivel + minutesArrivel))

    const numberOfHoursParked = secondsExit / 3600

    if (numberOfHoursParked <= 1) {
        totalToPay = firstHourPrice
        console.log(totalToPay)
    } else {
        totalToPay = parseInt(firstHourPrice) + (anyHoursPrice * Math.trunc(numberOfHoursParked))
        console.log(totalToPay)
    }

    return totalToPay
}

const deleteOwner = (index) => {
    const db = readDB()

    const totalToPay = debtPayable(index)

    const resp = confirm(`O valor total de ${db[index].nome}da placa ${db[index].placa} foi R$${totalToPay}?`)

    if (resp) {
        db.splice(index, 1)
        setDB(db)
        updateTable()
    }
}

const editOwner = (index) => {
    const db = readDB()
    const lastRecord = db[db.length - 1]

    document.querySelector('#nome').value = db[index].nome
    document.querySelector('#placa').value = db[index].placa

    document.querySelector('#nome').dataset.index = index
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
document.querySelector('#table').addEventListener('click', actionButtons)
document.querySelector('#placa').addEventListener('keyup', applyMask)
document.querySelector('#placa').addEventListener('keyup', (ev) => {
	const input = ev.target;
	input.value = input.value.toUpperCase();
});

updateTable()