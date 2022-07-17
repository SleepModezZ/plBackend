const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())

// Tehtävän 3.7 ratkaisu:
// app.use(morgan('tiny'))
// En onnistunut yhdistämään tokeneita esimääritellyn muotoilun kanssa, joten ratkaisin
// tehtävän 3.8 korvaamalla tinyn sen määrittävillä valmiilla tokeneilla ja
// listäämällä niiden perään itse määrittelemäni tokenin tulostamaan pyynnön sisällön:

morgan.token('req-body', function (req, res) {
  const result = JSON.stringify(req.body)
  // Tyhjät aaltosulkeet muiden kuin POST-pyyntöjen kohdalla näyttää huonolta, joten
  // lähetän niiden sijaan tyhjän merkkijonon (null tai undefined kävisivät yhtälailla).
  // Valitettavasti morgan kuitenkin näyttää kaikkien thyjien tietojen kohdalla väliviivan.
  if (result === '{}') {
    return ""
  }
  return result
  })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

let persons = [
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
      
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"  
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"    
    }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  let date = new Date()
  const text = `<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`
  res.send(text)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }
  
  if (persons.find(person => person.name == body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
