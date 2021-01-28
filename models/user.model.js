const _ = require('lodash')
const bcrypt = require('bcrypt')
const Bluebird = require('bluebird')
const Sequelize = require('sequelize')

const userSchema = {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    mobile_phone:{
        type: Sequelize.STRING,
        
        unique:{
            args: true,
            msg: 'Mobile phone already in use, please use another one.',
            fields: ['mobile_phone']
        }

    }
}
const userOptions = {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    indexes: [
        {
          name: 'user_id_index',
          method: 'BTREE',
          fields: ['id'],
        },
        {
          name: 'users_mobile_phone',
          method: 'BTREE',
          unique: true,
          fields: ['mobile_phone'],
        }
      ],
    deletedAt: 'deleted_at'
}

module.exports = (ISequelize, DataTypes) => {
    const User = ISequelize.define('User', userSchema, userOptions)

    User.beforeSave(async (user, options) => {
        user.mobile_phone = _.trim(user.mobile_phone)

        return user
    })
    User.associate = function(models){
        models.User.hasMany(models.Movie)
    }
    User.sync()
    .then(() => console.log(`User table created `))
    .catch(err => console.log(`Wrong creds probably. Error: ${err}`));
    return User
}