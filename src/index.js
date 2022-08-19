  const express = require('express')
  const { v4: uuidV4 } = require('uuid')

  const verifyCpf = require('./middleware/verifyCpf')
  const getBalance = require('./utils/getBalance')

  
  const app = express()
  app.use(express.json())

  module.export = customers = []

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
      id, cpf, name, statement: []
    })

    return response.status(201).send()
  })

  app.get('/account', verifyCpf, (request, response) => {
    const { customer } = request

    return response.json(customer)
  })

  // app.use(verifyCpf)

  app.get('/statement', verifyCpf, (request,response) => {
    const { customer } = request

    return response.json(customer.statement)
  })


  app.post('/deposit', verifyCpf, (request,response) => {
    const { description, amount } = request.body
    const { customer } = request
    
    const statementOperation = {
      description, 
      amount, 
      created_at: new Date(), 
      type: 'credit'
    }

    customer.statement.push(statementOperation)

    return response.status(201).send()
  })

  app.post('/withdraw', verifyCpf, (request,response) => {
    const { amount } = request.body
    const { customer } = request

    const balance = getBalance(customer.statement)

    if (balance < amount) {
      return response.status(400).json({ error: 'Insufficient funds!' })
    }

    const statementOperation = {
      amount, 
      created_at: new Date(), 
      type: 'debit'
    }

    customer.statement.push(statementOperation)

    return response.status(201).send()
  })

  app.get('/statement/date', verifyCpf, (request,response) => {
    const { customer } = request
    const { date } = request.query

    const dateFormat = new Date(date + " 00:00")

    const statement = customer.statement.filter(
      statement => 
        statement.created_at.toDateString() === 
        dateFormat.toDateString()
    )
    
    return response.json(statement)
  })

  app.put('/account', verifyCpf, (request,response) => {
    const { customer } = request
    const { name } = request.body

    customer.name = name

    return response.status(201).send()
  })

  app.delete('/account/', verifyCpf, (request, response) => {
    const { customer } = request
 
    customers.splice(customers.indexOf(customer),1);

    return response.status(200).json(customers)
  })

  app.get('/account/list', (request, response) => {
    return response.json(customers)
  })

  app.get('/balance', verifyCpf, (request, response) => {
    const { customer } = request

    const balance = getBalance(customer.statement)

    return response.json(balance)
  })
 
  app.listen(3333)