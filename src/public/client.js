const store = {
    user: { name: "Student" },
    apod: '',
    rovers: Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
    roverData: [],
    selectedRover: '',
    loadingRover: false,
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
    addEventListeners()
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}

const addEventListeners = () => {
    const buttons = document.querySelectorAll('.btnRover')

    buttons.forEach(button => {
        button.addEventListener('click',() => {
            getRoverInfo(button.dataset.rover.toLowerCase())
        })
    })
}

const selectRover = (selectedRover) => {
    updateStore(store, {selectedRover}, false)
}

// create content
const App = (state) => {
    const { rovers, roverData, loadingRover } = state
    const ButtonList = Buttons(List, "li-buttons")

    return `
        <header></header>
        <main>
            <section>${Greeting()}</section>
            <section>
                ${ButtonList(rovers)}
            </section>
            <section>
                ${Rover(roverData, loadingRover)}
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
    addEventListeners()
})

// ------------------------------------------------------  COMPONENTS

const List = (items, className) => {
    return `
        <ul class="${className}">
            ${items}
        </ul>
   `
}

const Buttons = (List, className) => (data) => {
    const items =  `
        ${data.map(rover =>
            `<li><button class="btnRover" data-rover="${rover}">${rover}</button></li>`
        ).join('')}
    `

    return List(items, className)
}

const Photos = (List, className) => (data) => {
    const items =  `
        ${data.map(record =>
            `<li><img src="${record.img_src}"></li>`
        ).join('')}
    `

    return List(items, className)
}

const Rover = (data, loadingRover) => {
    if (loadingRover) {
        return `<p>Loading data from NASA...</p>`
    }

    if (Object.keys(data).length === 0) {
        return ''
    }

    const PhotosList = Photos(List, "li-photos");

    return `
        <h2>${data.rover.name}</h2>
        <p>Launch Date: ${data.rover.launch_date}</p>
        <p>Landing Date: ${data.rover.landing_date}</p>
        <p>Status: ${data.rover.status}</p>
        <p>Date the most recent photos were taken: ${data.rover.max_date}</p>
        ${PhotosList(data.photos)}
    `
}

const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello! Please select the Mars rover to see the latest info</h1>
    `
}

const getPhotosForRover = (rover) => {
    fetch(`http://localhost:3000/rovers/${rover}`)
        .then(res => res.json())
        .then(data => updateStore(store, { roverData: data, loadingRover: false }))
}

const getRoverInfo = (rover) => {
    updateStore(store, { loadingRover: true })
    selectRover(rover)
    getPhotosForRover(rover)
}