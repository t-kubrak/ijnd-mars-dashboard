require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls

// example API call
app.get('/apod', async (req, res) => {
    try {
        const image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ image })
    } catch (err) {
        console.log('error:', err);
    }
})

app.get('/rovers/:rover', async (req, res) => {
    const {rover} = req.params

    try {
        const roverResponse = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}?api_key=${process.env.API_KEY}`)
        const roverData = await roverResponse.json()
        const date = roverData.rover.max_date

        const photosResponse = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${date}&api_key=${process.env.API_KEY}`)
        const photosData = await photosResponse.json()
        roverData.photos = photosData.photos
        res.send(roverData)
    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))