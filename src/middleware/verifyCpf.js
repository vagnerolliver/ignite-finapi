
module.exports  = function verifyCpf(request, response, next) {
  const { cpf } = request.headers

  const customer = customers.find(customer => customer.cpf === cpf)

  if (!customer) {
    return response.status(400).json({ error: 'Customers does not exist' })
  } 

  request.customer = customer

  next()
}
