// returns a function that accepts a function that is executed
  // catches any errors and passes them to next
module.exports = func => {
  return (req, res, next) => {
    func(req, res, next).catch(next)
  }
}