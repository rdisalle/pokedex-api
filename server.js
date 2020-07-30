require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const pokedex = require('./pokedex.json')
const cors = require('cors')

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

//check for API token
app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    console.log('validate bearer token middleware')
    //if no authToken or authToken split does not equal apiToken
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
        }
    // move to the next middleware
    next()
})

//hardcode valid types
const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, 
`Poison`, `Psychic`, `Rock`, `Steel`, `Water`]

//types function, returning validTypes response as json
function handleGetTypes(req, res) {
    const { type = "" } = req.query

    let results = pokedex.pokemon
    .filter(pokemonResults => 
        pokemonResults
            .type.includes(type));

    res
    .json(results);
}

//types function request
app.get('/types', handleGetTypes)

//pokemon function
function handleGetPokemon(req, res) {
    const { name = "" } = req.query

    let results = pokedex.pokemon
    .filter(pokemonResults => 
        pokemonResults
            .name
            .toLowerCase()
            .includes(name.toLowerCase()));

    res
    .json(results);
}

//pokemon function request
app.get('/pokemon', handleGetPokemon)

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})