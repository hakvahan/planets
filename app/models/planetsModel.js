const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Comment = new Schema({
    text: {type: String, default: ''},
    score: {type: Number, min: 1, max: 5, default: 1},
    createdAt: {type: Date, default: Date.now}
});


//planet schema definition
const Planet = new Schema({
    name: {type: String},
    swapi_id: {type: String},
    json_data: {type: {}, default: {}},
    comments: [Comment],
    createdAt: {type: Date, default: Date.now},

});

module.exports = mongoose.model('planet', Planet,'planet');