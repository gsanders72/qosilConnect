const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Connections = mongoose.model('collections', new Schema ({},{collection:'connections'}));

module.exports = Connections;
