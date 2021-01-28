const userRepository = require('../repository/user.repository')
const db = require('../models')
var Model = db.Movie
const _ = require('lodash')
const Op = require('sequelize').Op
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
let ExtractJWT = passportJWT.ExtractJwt
let jwtOptions = {}

jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = 'doublesabbathsoded1234'
function Auth(){}


Auth.prototype.signin = function (req, res, next) {

    const { mobile_phone, password } = req.body
    if (mobile_phone && password) {
        userRepository.getByMobile(mobile_phone).then(user=>{
            if (!user) {
                return res.status(401).json({ status:false, message:  'No such user found' })
            }
            if (user.password === password) {
                let payload = { id: user.id }
                let token = jwt.sign(payload, jwtOptions.secretOrKey)
                res.json({ status:true, token: token })
            } else {
                res.status(401).json({ status:false, message: 'Password is incorrect'})
            }
        })
    }
}
module.exports = Auth