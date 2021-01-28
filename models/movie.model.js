const _ = require('lodash')
const bcrypt = require('bcrypt')
const Bluebird = require('bluebird')
const Sequelize = require('sequelize')
// const db = require('./sequelize-singleton')
// const ISequelize = db.ISequelize

const schema = {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    //in seconds
    duration: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    artists: {
        type: Sequelize.STRING,
        allowNull: false
    },
    genres: {
        type: Sequelize.STRING,
        allowNull: false
    },
    UserId: {
        type:  Sequelize.UUID,
        allowNull: false
    },
    video:{
        type: Sequelize.STRING
    }
}
const config = {
    tableName: 'movies',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    indexes: [
        {
          name: 'movies_id_index',
          method: 'BTREE',
          fields: ['id'],
        }
      ],
    deletedAt: 'deleted_at'
}
module.exports = (ISequelize, DataTypes) => {
    const Movie = ISequelize.define('Movie', schema, config)

    Movie.beforeSave(async (Movie, options) => {
        // do something here
        return Movie
    })
    Movie.associate = function(models){
        models.Movie.belongsTo(models.User, {
            onDelete: "CASCADE",
            foreignKey: 'UserId',
            as: 'User'
        })
    }
    Movie.sync()
    .then(() => console.log(`Movie table created `))
    .catch(err => console.log(`Wrong creds probably. Error: ${err}`));

    return Movie
}