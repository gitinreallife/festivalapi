const db = require('../models')
const Bluebird = require('bluebird')
const Op = require('sequelize').Op
const _ = require('lodash')
var util = require('util')


function Base(modelName){
    this.db = db
    this._ = _
    this.modelName = modelName
    this.Model = db[modelName]
}
Base.prototype.create = function (req, res, next) {
    obj = {}
    //save to MySQL database
    for(key in req.body){
        obj[`${key}`] = req.body[`${key}`]
    }
    this.Model = db[modelName]
    this.Model.create(obj).then(result=> {
        // send created result to client
        res.status(200).send(result)
    }).catch(err=>{
        message = ''
        if(Array.isArray(err.errors) ){
            message = err.errors[0].validatorKey == "not_unique" ? err.errors[0].message : err.message
        }else{
            console.log('Error Post--------------')
            console.log(err)
            message = err.message
        }
        
        res.status(500).send({
            error: "Validation Error",
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
    this.Model = db[modelName]
    this.Model.findOne({where: {id: req.params.id}}).then(object => {
        res.status(200).send(object)
    }).catch(err => {
        res.status(500).send({
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
    var filters = Object.keys(conditions).length > 0 ? {where: conditions} : {}
    this.Model = db[modelName]
    this.Model.findAll(filters).then(objects => {
        res.status(200).send(objects)
    }).catch(err => {
        console.log('---errorsss---------------')
        console.log(err)
        res.status(500).send({
            success: "param_error",
            message: err.message || "Some error occurred."
        })
    })
}


Base.prototype.update = (req, res, next) => {
    var obj = req.body
    const id = req.params.id
    this.Model = db[modelName]
    this.Model.update( obj, { where: {id: id} 
    }).then(() => {
        res.status(200).send(obj)
    }).catch(err => {
        res.status(500).send({
            message: err.message || `Some error occurred while updating ${modelName} with id = `+ id
        })
    })
}

Base.prototype.deleteFunction = (req, res, next) => {
    const id = req.params.id
    this.Model = db[modelName]
    this.Model.update({
        status: 'DELETED',
        updated_at: new Date()
    }, {
        where: {id: req.params.id} 
    }).then(() => {
        res.status(200).send("Deleted successfully")
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred."
        })
    })
}

module.exports = Base