const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const platnetsRoutes = require('./app/routes/platnetsRoutes');
const requestValidator = require('./app/modules/requestValidators/requestValidator');
const authorization = require('./app/policy/authorization');

const env = process.env.NODE_ENV || 'dev';
const config = require(`./config/${env}`);


const app = express();
const port = 8080;

//db options
const options = {
    keepAlive: 1,
    connectTimeoutMS: 30000
};

//db connection
mongoose.connect(config.DBHost, options);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("connected to mongo");
});

//parse application/json and look for raw text                                        
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type: 'application/json'}));

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).json({
        status: 'error',
        response: err
    }, err)
})

app.get("/", (req, res) => res.json({message: "API v1 panets"}));



app.route("/planets")
    .post(requestValidator.planetPost, platnetsRoutes.postPlanet)
    .get(platnetsRoutes.getAllPlanets)

app.route("/planets/:id")
    .get(platnetsRoutes.getPlanetsByLocalId)

app.post("/planets/:id/comment", requestValidator.planetComment,
    authorization.required,
    platnetsRoutes.postPlanetComment)

app.post("/login", authorization.login)

app.listen(port);
console.log("Listening on port " + port);

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.json({
        status: 'error',
        response: err.message
    })
})


module.exports = app; // for testing