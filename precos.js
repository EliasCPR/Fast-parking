'use strict'

function readDBPrice() {
    return JSON.parse(window.localStorage.getItem('price')) ?? [];
  }

const setDBPrice = (price) => localStorage.setItem('price', JSON.stringify(price))

const insertDBPrice = (registerPrice) => {
    const dbPrice = readDBPrice()
    dbPrice.push(registerPrice)
    setDBPrice(dbPrice)
}

const clearInputPrice = () => {
    document.querySelector('#primeira-hora').value = ''
    document.querySelector('#demais-horas').value = ''
}

const isValidFormPrice = () => document.querySelector('#form-price').reportValidity()

const savePrice = () => {
    if (isValidFormPrice) {
        const dbPrice = readDBPrice()

        const price = {
            primeiraHora: document.querySelector('#primeira-hora').value,
            demaisHoras: document.querySelector('#demais-horas').value
        }

        if (dbPrice == '') {
            insertDBPrice(price)
            console.log("insertPrice")
        } else {
            dbPrice[0] = price
            setDBPrice(dbPrice)
            console.log("else")

        }

        clearInputPrice()
    }
}

const priceMask = (number) => {
    number = number.replace(/\D/g, "")
    number = number.replace(/(\d{1})(\d{5})$/, "$1.$2")
    number = number.replace(/(\d{1})(\d{1,2})$/, "$1,$2")
    return number
}

const applyMask = (event) => {
    event.target.value = priceMask(event.target.value)
}

document.querySelector('#salvarPreco').addEventListener('click', savePrice)
document.querySelector('#primeira-hora').addEventListener('keyup', applyMask)
document.querySelector('#demais-horas').addEventListener('keyup', applyMask)