const express = require('express')
const app = express()
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const bodyParser = require('body-parser')
const passport = require('passport')

const passportConfig = require('./config/passport.config')
const db = require('./models')

require('./models/session.model')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


passportConfig(passport)
app.use(session({
    secret: process.env.DEV_SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge: 30 * 24 * 60 * 60 * 1000
    },
    store: new SequelizeStore({
        db: db.ISequelize,
        table: 'Session'
    })
}))
app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions

app.get("/", (req, res) => {
    res.send('You hit home')
  });

//force: true will drop the table if it already exists
// db.ISequelize.sync({force:true}).then(()=>{
//     console.log('Drop and Resync with { force: true }')
// })

require('./routes/user.routes')(app, passport)
require('./routes/auth.routes')(app)
require('./routes/movie.routes')(app, passport)

var host, port
if(process.env.NODE_ENV == 'development'){
    host = process.env.DEV_HOST
    port = process.env.DEV_PORT
}else{

    host = process.env.PROD_HOST
    port = process.env.PROD_PORT

}
const cors = require('cors')
const corsOption = {
    origin: 'http://localhost:3000',
    optionSuccessStatus: 200
}
app.use(cors(corsOption))

// Create a server
var server = app.listen(port, function(){

    console.log(`App listening at http://${host}:${port}`)
})
//   "installation": "npm install bcrypt bluebird body-parser cors dotenv express express-session lodash mysql2 passport passport-local sequelize connect-session-sequelize"