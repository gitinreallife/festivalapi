const multer = require('multer')
const fs = require('fs')
const path = require('path')
var upload    = require('../config/bstorage.config')

function userRoute(app, passport){
    const User =  require('../controller/user.controller.js')
    var users = new User()

    // Register a new user
    app.post('/api/user', upload.single('file'), users.register)

    //retrieve all users
    app.get('/api/users', users.findAll) // passport.authenticate('jwt', {session: false}),

    //retrieve a single user
    app.get('/api/user/:id', users.findById)

    //update user
    app.put('/api/user/:id', upload.single('file'), users.update)

    //delete user
    app.delete('/api/user/:id', users.deleteFunction)
}

module.exports = userRoute