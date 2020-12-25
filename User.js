const Sequelize = require('sequelize');
const sequelize = require("./sequelize")

const User = sequelize.define('user', {
    // attributes
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false,
    }
}, {
    tableName: 'users',
    timestamps: false

});
User.removeAttribute("id");

module.exports = User