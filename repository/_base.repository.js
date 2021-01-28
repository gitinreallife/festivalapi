// Repository is for query helpers, middleware that handles data collecting and transaction

const db = require("../models")

var Model, Schema
Base = (param) =>{
    modelName = param
    if(param != ''){
        Model = db[param]
        Schema = db[param].schema
    }
    return {
        Model: Model,
        getById: findById
        , getByMobile: findByMobile
        , getList: findAll
        , create: create
    }
}
module.exports = Base

create = (obj) => {
    return Model.create(obj).then(result=> {
        res.send(result)
    })
    .catch(err=>{
        res.status(500).send({
            message: err.message || "Some error occurred while creating Model."
        })
    })
}


findById = (id) => {
    return Model.findOne({
        where: {id: id}
    })
}

//FETCH by findByMobile
findByMobile = (mobile_phone) => {
    return Model.findOne({
        where: { mobile_phone: mobile_phone}
    })
}

// FETCH all objects or filter
findAll = (filters) => {
    Model.findAll(filters)
}