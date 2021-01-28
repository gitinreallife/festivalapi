const db = require('../models')
var Model = db.Movie
const _ = require('lodash')
const Op = require('sequelize').Op
var env = process.env.NODE_ENV

function Movie(){}

function getFilePath(file){
    return env == 'development'? file.path : file.location
}

Movie.prototype.create = function (req, res, next) {
    obj = {}
    obj['video'] = ""
    if(req.file != undefined){            
        obj['video'] = getFilePath(req.file)
    }
    console.log(obj['video'])
    console.log('==================')
    //save to MySQL database
    for(key in req.body){
        obj[`${key}`] = req.body[`${key}`]
    }
    Model.create(obj).then(result=> {
        // send created result to client
        res.status(200).send({
            status: true,
            data: result
        })
    }).catch(err=>{
        message = ''
        if(Array.isArray(err.errors) ){
            message = err.errors[0].validatorKey == "not_unique" ? err.errors[0].message : err.message
        }else{
            console.log('Error--------------')
            console.log(err)
            message = err.message
        }
        
        res.status(500).send({
            status: false,
            message: message || "Some error occurred while creating Model."
        })
    })
}

//FETCH by ID
Movie.prototype.findById = (req, res, next) => {
    // if(_.isEmpty(req.session.passport)){
    //     res.status(500).send({
    //         message: "Please login first"})            
    // }
    
    Model.findOne({where: {id: req.params.id}}).then(object => {
        res.status(200).send({
            status: true,
            data: object
        })
    }).catch(err => {
        res.status(500).send({
            status: false,
            message: "Error retrieving object with id = " + req.params.id
        })
    })
}

// FETCH all objects or filter
Movie.prototype.findAll = (req, res, next) => {
    // conditions haven't been tested yet
    var conditions = {}
    for(var param in req.query){
        if (req.query.hasOwnProperty(param) && req.query[param] != '' ) {
            conditions[param] = {
                [Op.like]: `%${req.query[param]}%`
            }
        }
    }
    var filters = Object.keys(conditions).length > 0 ? {where: conditions} : {}
    
    Model.findAll(filters).then(objects => {
        res.status(200).send({
            status: true,
            data: objects
        })
    }).catch(err => {
        console.log('---errorsss---------------')
        console.log(err)
        res.status(500).send({
            status: false,
            message: err || "Some error occurred."
        })
    })
}


Movie.prototype.update = (req, res, next) => {
    var obj = req.body
    const id = req.params.id
    
    Model.update( obj, { where: {id: id} 
    }).then(() => {
        res.status(200).send({
            status: true,
            data: obj
        })
    }).catch(err => {
        res.status(500).send({
            status: false,
            message: err.message || `Some error occurred while updating ${modelName} with id = `+ id
        })
    })
}

Movie.prototype.deleteFunction = (req, res, next) => {
    const id = req.params.id
    
    Model.update({
        deleted_at: new Date()
    }, {
        where: {id: req.params.id} 
    }).then(() => {
        res.status(200).send({
            status: true,
            message: "Deleted successfully"
        })
    }).catch(err => {
        res.status(500).send({
            status: false,
            message: err.message || "Some error occurred."
        })
    })
}
module.exports = Movie