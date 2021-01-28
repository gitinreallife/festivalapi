const _base = require('../repository/_base.repository')('User')

module.exports = exports = _base


//FETCH by ID
// findById = (id) => {
//     return User.findOne({where: {id: id}}).then(object => {
//         return object
//     }).catch(err => {
//         return {error: err}
//     })
// }

// //FETCH by email
// findByEmail = (email) => {
//     return User.findOne({
//         where: { email: email}
//     })
// }

// // FETCH all objects or filter
// findAll = (filters) => {
//     User.findAll(filters)
// }