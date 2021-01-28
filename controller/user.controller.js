const db = require('../models')
var Model = db.User
const _ = require('lodash')
const Op = require('sequelize').Op
var env = process.env.NODE_ENV

function getFilePath(file){
    return env == 'development'? file.path : file.location
}

function Base(){}

Base.prototype.register = (req, res, next)=> {
    obj = {}
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
        console.log(err)
        console.log('======================')
        message = err.errors[0].validatorKey == "not_unique" ? err.errors[0].message : err.message
        res.status(500).send({
            status: false,
            message: message || "Some error occurred while creating Model."
        })
    })
}


//FETCH by ID
Base.prototype.findById = (req, res, next) => {
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
Base.prototype.findAll = (req, res, next) => {
    // conditions haven't been tested yet
    var conditions = {}
    for(var param in req.query){
        if (req.query.hasOwnProperty(param) && req.query[param] != '' ) {
            conditions[param] = {
                [Op.like]: `%${req.query[param]}%`
            }
        }
    }
    console.log(conditions)
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


Base.prototype.update = (req, res, next) => {
    var obj = req.body
    if(req.file != undefined){
        obj['profile_picture'] = getFilePath(req.file)
    }
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

Base.prototype.deleteFunction = (req, res, next) => {
    const id = req.params.id
    
    Model.update({
        deleted_at: new Date()
    }, {
        where: {id: req.params.id} 
    }).then(() => {
        res.status(200).send({
            status: true,
            message: "Data deleted successfully!"
        })
    }).catch(err => {
        res.status(500).send({
            status: false,
            message: err.message || "Some error occurred."
        })
    })
}
module.exports = Base