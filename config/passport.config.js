const userRepository = require('../repository/user.repository')

const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
let ExtractJWT = passportJWT.ExtractJwt
let JwtStrategy = passportJWT.Strategy
let jwtOptions = {}

jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = 'doublesabbathsoded1234'

module.exports = (passport) => {
    let strategy = new JwtStrategy(jwtOptions, async function(jwt_payload, next) {
        console.log('payload received', jwt_payload)
        userRepository.getById(jwt_payload.id).then(user=>{
            if (user) {
                next(null, user);
            } else {
                next(null, false);
            }
        }).catch(err=>{
            console.log(err)
        })
    })
    passport.use(strategy);
  
}