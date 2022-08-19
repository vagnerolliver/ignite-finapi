const express = require('express')
const { v4: uuidV4 } = require('uuid')

const app = express()
app.use(express.json())

const customers = []

/** 
 * cpf :string
 * name:  string
 * id: uuid
 * statement: array
*/

app.post('/account',(request, response) => {
  const { cpf, name } = request.body
  const id = uuidV4() 

  const customersAlreadyExists = customers.some(item => item.cpf === cpf)

  if (customersAlreadyExists) {
    return response.status(400).json({ error: 'Customers already exists' })
  }

  customers.push({ 
    id, cpf, name, statement: ['oi']
  })

  return response.status(201).send()
})

app.get('/account', (request, response) => {
  return response.json(customers)
})

app.get('/statement/:cpf', (request,response) => {
  const { cpf } = request.params

  const customer = customers.find(item => item.cpf === cpf)

  if (customer) {
    return response.json(customer.statement)
  } else {
    return response.status(400).json({ error: 'Customers does not exist' })
  }
})

app.listen(3333)