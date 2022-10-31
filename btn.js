/** 1)
  Create an input field and a button when the button is clicked 
  call  function that receives 'number' as a parameter (from input field) 
  and returns a new promise after 2 sec
  If the number is above 17 display on the screen 'You can drive' 
  and if it's smaller throw error and display on the screen 'You're too young to drive'
 */
//! Check yourself once with .then .catch and once with async await
//! DRY
// //! Small functions

// const input= document.querySelector('input')
// const button= document.querySelector('button')

// button.addEventListener('click',btnHandler)

// function btnHandler(e){
//     setTimeout(async ()=>{
//     let num= getInputValue()
//     try {
//             const res = await new Promise((resolve, reject) => {

//                 if (num > 17) { resolve('You can Drive')} 
//                 reject('Youre too young')
//             })
//             return console.log(res)
//         } catch (res_1) {
//             return console.log(res_1)
//         }
//     },2000)
// }

// function getInputValue(){
//    return Number(input.value)
// }
// function btnHandler(e){
//     setTimeout(()=>{
//     let num= getInputValue()
//     return new Promise((resolve,reject)=>{

//             if(num>17){resolve('You can Drive')}
//             reject('Youre too young')
//         }).then((res)=>console.log(res)).catch((res)=>console.log(res))
//     },2000)
// }

// function getInputValue(){
//    return Number(input.value)
// }


/** 2)
   create a car Market Object 
   fetch all data from the API and assign it to the carMarketObj
   add spinner to see that everything works
   and show message when done
   */
//? Do i need? https://capsules7.herokuapp.com/api/carMarket/agencies
//? Do i need? https://capsules7.herokuapp.com/api/carMarket/agencies/:id
//? Do i need? https://capsules7.herokuapp.com/api/carMarket/customers
//? Do i need? https://capsules7.herokuapp.com/api/carMarket/customers/:id: 


let set = {
    dataAll: null,
}
const spinner = document.querySelector('.spinner')

async function fetchData(url){
const data =  await fetch(url)
    const response = data.json()
//    console.dir(data)
   return response

}


async function fetchAll() { 
    // isLoading(true)
try{
    const myArr = [fetchData('https://capsules7.herokuapp.com/api/carMarket/agencies'),fetchData('https://capsules7.herokuapp.com/api/carMarket/customers'),fetchData('https://capsules7.herokuapp.com/api/carMarket/tax')]
//    const agencies= fetchData('https://capsules7.herokuapp.com/api/carMarket/agencies')
//    const costumers= fetchData('https://capsules7.herokuapp.com/api/carMarket/costumers')
    const dataAll = await Promise.all(myArr)
    set.dataAll = {
        agencies:dataAll[0],
        customers:dataAll[1],
        taxAuthoreties: dataAll[2]
    }
    // isLoading(false)
    // console.log(set.dataAll)
    return set.dataAll
}catch(e){console.log(e)}
}

async function startApp() {
    isLoading(true)
    const some = await fetchAll()
    isLoading(false)
    return some

}


function isLoading (bol){
if(!bol){
    spinner.style.display = 'none'
}
else{spinner.style.display='block'}
}
// fetchAll()

const agenciesBtn = document.querySelector('.agenciesBtn')
const customersBtn = document.querySelector('.customersBtn')
const agenciesList = document.querySelector('.agenciesList')
const customersList = document.querySelector('.customersList')
const agenciesHeading = document.getElementById('agenciesHeding')
const customersHeding = document.getElementById('customersHeding')
const overlay = document.querySelector('.overlay')
const card = document.querySelector('.card')
const closeBtn =document.querySelector('.closeBtn')

//? Create two button on the screen "Customers" "Agencies"
//? When the user clicks the button display a list of Customers / Agencies names
//? Only one list can be presented at a time

async function agenciesHandler(event) {
    agenciesList.style.display='block'
    customersList.style.display='none'
    const objFromAPI = await startApp()
    const {agencies,customers,taxAtreties}= objFromAPI
    agenciesList.replaceChildren('')
    createAndAppend(getName(agencies),agenciesList,getId(agencies))

}
async function customersHandler(event) {
    agenciesList.style.display='none'
    // agenciesHeading.style.display='none'
    customersList.style.display='block'
    // customersHeding.style.display='block'
    const objFromAPI = await startApp()
    const {agencies,customers,taxAtreties}= objFromAPI
    // console.dir(agencies)
    //----retunrs array
    // createAndAppend(getName(agencies),agenciesList)
    customersList.replaceChildren('')
    createAndAppend(getName(customers),customersList,getId(customers))
    // getName(customers)
    // console.dir(objFromAPI)
}

function createAndAppend (arr,list,dataId) {
        arr.forEach((keyVarElement,index) => {
            let listItem = document.createElement('li')
            listItem.innerText= keyVarElement
            listItem.setAttribute('data-name',keyVarElement)
            listItem.setAttribute('data-id',dataId[index])
            list.appendChild(listItem)
        });
}

function getName(keyVar) {
    const myArr= []
    for(let obj of keyVar){
        const nameAndId = Object.keys(obj)
        const[name,id]= nameAndId
        myArr.push(obj[name])
    //    console.log(obj[name])
    }
    return myArr
}
function getId(keyVar) {
    const myArr= []
    for(let obj of keyVar){
        const nameAndId = Object.keys(obj)
        const[name,id]= nameAndId
        myArr.push(obj[id])
    //    console.log(obj[name])
    }
    return myArr
}

function setEvents (){
    agenciesBtn.addEventListener('click',agenciesHandler)
    customersBtn.addEventListener('click',customersHandler)
    agenciesList.addEventListener('click',ListHandler)
    customersList.addEventListener('click',ListHandler)
}

setEvents()

function ListHandler(event) {
    // event.target.getAttribute('data-id')
    // console.log(event.target.getAttribute('data-id'))
    let targetId = event.target.getAttribute('data-id')
    const idsArr = [getId(set.dataAll.agencies) ,getId(set.dataAll.customers)].flat()
    for (const Id of idsArr) {
        if(Id == targetId){
            // console.log(Id)
            overlay.classList.toggle('hidden')
            let parentCustomers = event.target.parentElement.classList.contains('customersList')
            let parentAgencies = event.target.parentElement.classList.contains('agenciesList')
            if(parentCustomers){
                createAndAppendCustomerCard(fetchAgencyORcustomer(Id))
                    return
                } else if(parentAgencies){
                    createAndAppendAgencyCard(fetchAgencyORcustomer(Id))}
        // return Id
    }
    }
}

async function fetchAgencyORcustomer(str) {
 try{   const myArr = [fetchAgencyById(str),fetchCustomerById(str)]
    const response = await Promise.any(myArr)
    // console.dir(response);
    return response}catch(e){console.error(e)}
}

async function fetchAgencyById(str){
    const agency = 
    await fetchData(`https://capsules7.herokuapp.com/api/carMarket/agencies/${str}`)
    return agency
}
async function fetchCustomerById(str){
    const customer=
    await fetchData(`https://capsules7.herokuapp.com/api/carMarket/customers/${str}`)
    return customer
}

async function createAndAppendAgencyCard(obj) { 
    const myobj = await obj
    // console.log(myobj.agencyName)
    let name1 = document.createElement('div')
    name1.innerText=myobj.agencyName
    let cash = document.createElement('div')
    cash.innerText=`${myobj.cash} $`
    let cars = document.createElement('div')
    const brandsArr = Object.keys(myobj.cars)
    
    for(let brand of brandsArr) {
        // console.log(getName(myobj.cars[brand]))
        cars.innerText+= `${brand}  : ${getName(myobj.cars[brand])}, 
        `
    }
    card.appendChild(name1)
    card.appendChild(cash)
    card.appendChild(cars)
}

async function createAndAppendCustomerCard(obj) { 
    const myobj = await obj
    // console.log(myobj.name)
    let name1 = document.createElement('div')
    name1.innerText=myobj.name
    let cash = document.createElement('div')
    cash.innerText=`${myobj.cash} $`
    // cars.innerText = myobj.cars.name
    // const brandsArr = Object.keys(myobj.cars)
    let cars;
    let carTitle;
    let price ;
    let year ;
    
    card.appendChild(name1)
    card.appendChild(cash)
    for(let car of myobj.cars) {
        cars = document.createElement('div')
        carTitle = document.createElement('h4')
        price =document.createElement('span')
        year =document.createElement('span')
        cars.setAttribute('data-num',`${car.carNumber}`)
        cars.setAttribute('data-model',`${car.name}`)
        year.setAttribute('data-model',`${car.name}`)
        price.setAttribute('data-model',`${car.name}`)
        carTitle.innerText = `Model : ${car.name} `
        price.innerText = `Price :${car.price}$, `
        year.innerText = `Year :${car.year}`
        cars.appendChild(carTitle)
        cars.appendChild(price)
        cars.appendChild(year)
        card.appendChild(cars)
        setClasses([cars,carTitle,price,year],['cars','carTitle','price','year'])
    }
    cars.addEventListener('click',displayCarsImage)
}

async function displayCarsImage(event){
    console.log(event.target)
    const myobj =await fetchAgencyById('3J2r3Kglvs')
    // console.log(myobj)
    const brandsArr = Object.keys(myobj.cars)
    let model =event.target.getAttribute('data-model').toLowerCase()
    // console.log(model)
    let imagePromisesArr =[]
    
    for(let brand of brandsArr) {
        brand = brand.toLowerCase()
        model = model.toLowerCase()
        const imageRes = fetchData(`https://capsules7.herokuapp.com/api/carMarket/img/${brand}/${model}`)
        imagePromisesArr.push(imageRes)
    }
    // console.log(imagePromisesArr)

    const imageResposnes = (await Promise.all(imagePromisesArr))
    // console.dir(imageResposnes)
    for(let promise of imageResposnes){
        // console.dir(promise)
        if(promise.image){
        card.style.background=`url(${promise.image}) center center/cover no-repeat`
        return

    }}
}

closeBtn.addEventListener('click',()=>{
    overlay.classList.toggle('hidden')
    card.replaceChildren(closeBtn)
    card.style.background ='#f4f4f4'
})

function setClasses(arr,arr2) {  
    arr.forEach((htmlElement,index)=>{
        htmlElement.classList.add(arr2[index])
    })
    
}
//in common{
//name
//cash
//cars }


//? 4)
//? When the user clicks on single name of a Customer / Agency
//? Show over the screen a card with all the data of that particular Customer / Agency
//! Questions we should ask ourselves:
//! Where functions can be combined into one function?
//! Am I holding unnecessary information in the client's browser?
//! Why did I choose to call the API the way I did?
//* You can divide the work inside the capsule and share the responsibility
//* Separate the functions of logic and The functions related to HTML
//* Don't mess with the design (CSS)

//? 5)
//? When the user clicks on get image of the car fetch the car image and display another card with the image.
//! but what if i did no get the image ?????

//? ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
// https://capsules7.herokuapp.com/api/carMarket/img/:brand/:model

//! Questions we should ask ourselves:
//! Where functions can be combined into one function?
//! Am I holding unnecessary information in the client's browser?
//! Why did I choose to call the API the way I did?

//* You can divide the work inside the capsule and share the responsibility
//* Separate the functions of logic and The functions related to HTML
//* Don't mess with the design (CSS)
