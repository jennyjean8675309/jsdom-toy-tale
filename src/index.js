let addToy = false
const toyUrl = 'http://localhost:3000/toys'

document.addEventListener("DOMContentLoaded", ()=>{
  const addBtn = document.querySelector('#new-toy-btn')
  const toyForm = document.querySelector('.container')
  addBtn.addEventListener('click', () => {
    // hide & seek with the form
    addToy = !addToy
    if (addToy) {
      toyForm.style.display = 'block'
    } else {
      toyForm.style.display = 'none'
    }
  })

  fetchToys()
  getToyForm().addEventListener('submit', submitToy)
})

function fetchToys() {
  fetch(toyUrl)
    .then(resp => resp.json())
    .then(toyData => toyData.forEach( toy => displayToy(toy) ))
}

function displayToy(toy) {
  console.log('displaying toy...', toy.name)
  // building out the stuff for each toy
  const toyDiv = document.createElement('div')
  toyDiv.classList.add('card')
  const toyName = document.createElement('h2')
  toyName.innerText = toy.name
  const toyImage = document.createElement('img')
  toyImage.classList.add('toy-avatar')
  toyImage.src = toy.image
  const toyPTag = document.createElement('p')
  toyPTag.innerText = `${toy.likes} Likes`
  const likeButton = document.createElement('button')
  likeButton.classList.add('like-btn')
  likeButton.dataset.toyId = toy.id
  likeButton.innerText = 'Like <3'
  likeButton.addEventListener('click', increaseLikes)

  toyDiv.append(toyName, toyImage, toyPTag, likeButton)

  getToyCollectionDiv().append(toyDiv)
}

function submitToy(event) {
  event.preventDefault()
  // get the values from the user's input first
  const name = getToyNameInput().value
  const image = getToyImageInput().value
  // then make a POST fetch call to add the new toy to the database
  fetch(toyUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      name: name,
      image: image,
      likes: 0
    })
  })
    .then(resp => resp.json())
    .then(result => displayToy(result))
}

// to easily find my target (i.e., which toy I want to update), I'm going to add a dataset that holds that toy's id (a unique number) to the likeButton
function increaseLikes(event) {
  // here I use the dataset to grab the toy's id from my button
  const toyId = event.target.dataset.toyId
  currentLikes = parseInt(event.target.previousElementSibling.innerText.split(' ')[0])
  addOne = currentLikes + 1
  fetch(`${toyUrl}/${toyId}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      likes: addOne
    })
  })
    .then(resp => resp.json())
    .then(updatedToy => updateToyInDOM(updatedToy))
}

function updateToyInDOM(toy) {
  // here I use the dataset again to find that same button (using the passed-in toy's id)
  // then I use previousElementSibling to grab the p tag 
  const likeButton = document.querySelector(`[data-toy-id='${toy.id}']`)
  const pTag = likeButton.previousElementSibling
  pTag.innerText = `${toy.likes} Likes`
}

// functions to return DOM elements
function getToyCollectionDiv() {
  return document.getElementById('toy-collection')
}

function getToyForm() {
  return document.getElementById('toy-form')
}

function getToyNameInput() {
  return document.getElementById('toy-name-input')
}

function getToyImageInput() {
  return document.getElementById('toy-image-input')
}