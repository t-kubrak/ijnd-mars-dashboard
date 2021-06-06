const store = {
    user: { name: "Student" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    photos: [],
    selectedRover: ''
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState, isRender = true) => {
    store = Object.assign(store, newState)
    console.log(store)

    if (isRender === true) {
        render(root, store)
        addEventListeners()
    }
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
    const { rovers, apod } = state

    return `
        <header></header>
        <main>
            <section>
                <ul class="buttons">
                    ${rovers.map(rover =>
                        `<li>
                            <button class="btnRover" data-rover="${rover}">${rover}</button>
                        </li>`
                    ).join('')}
                </ul>
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

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }

    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `)
    }
}

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    const { apod } = state

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))

    return data
}

const getPhotosForRover = (rover) => {
    fetch(`http://localhost:3000/rovers/${rover}`)
        .then(res => res.json())
        .then(data => updateStore(store, { photos: data.photosData.photos }))
}

const getRoverInfo = (rover) => {
    selectRover(rover)
    getPhotosForRover(rover)
}