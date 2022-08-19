
module.exports = function getBalance(statement) {
 return statement.reduce((accumulator, operation) => {
    if (operation.type === 'credit') {
      return accumulator = accumulator + operation.amount;
    } else {
      return accumulator = accumulator - operation.amount;
    }
  }, 0)
}
