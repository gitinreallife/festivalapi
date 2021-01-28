function authRoute(app){
    const Auth = require('../controller/auth.controller')
    var auth = new Auth()
    app.post('/api/signin', auth.signin)
}
module.exports = authRoute