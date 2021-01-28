const multer = require('multer')
const fs = require('fs')
const path = require('path')
var upload    = require('../config/bstorage.config')

function movieRoute(app, passport){
    const Movie =  require('../controller/movie.controller.js')
    var movie = new Movie()

    app.post('/api/movie', upload.single('video'), passport.authenticate('jwt', {session: false}),  movie.create)

    //retrieve all users
    app.get('/api/movies', movie.findAll)

    //retrieve a single user
    app.get('/api/movie/:id', movie.findById)

    //update user
    app.put('/api/movie/:id', movie.update)

    //delete user
    app.delete('/api/movie/:id', movie.deleteFunction)
}

module.exports = movieRoute