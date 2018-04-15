const Planet = require('../models/planetsModel');
const PlanetDao = require('../dal/planetsDao');
const planetDao = new PlanetDao(Planet);
const SwapiService = require('../modules/externalServices/swapiService');
const swapiService = new SwapiService();


/*
 * POST /planet route to retrieve the planet ( from local db or swapi api if not found).
 */
function postPlanet(req, res, next) {
    const name = req.body.name;

    planetDao.findByName(name)
        .then(result => {
            if (!result) {
                swapiService.findPlanetsByName(name)
                    .then(({results}) => {
                        if (results.length == 0) {
                            return res.status(201).json({
                                status: 'ok',
                                response: {}
                            });
                        }
                        let planet = results[0];

                        const newPlanet = new Planet({
                            name: planet.name,
                            swapi_id: getPlanetId(planet.url),
                            json_data: planet
                        })

                        delete planet.name;

                        planetDao.inserOne(newPlanet).then(result => {
                            res.status(201).json({status: 'ok', response:result})
                        })

                    }).catch(err => {
                    console.log(err)
                    next(err);
                })
            } else {
                res.status(201).json({status: 'ok', response:result})
            }
        })
        .catch(err => {
            console.log(err)
            next(err);
        })
}

/*
 * POST /planets returns all planets
 */
function getAllPlanets(req, res, next) {

    planetDao.getAll()
        .then(result =>
            res.json({
                status: 'ok',
                response: result
            }))
        .catch(err => {
            console.log(err)
            next(err);
        })
}

/*
 * GET /planets/:id route to retrieve a planet given its id.
 */
function getPlanetsByLocalId(req, res, next) {
    return planetDao.findById(req.params.id)
        .then(result =>
            res.json({
                status: 'ok',
                response: result
            }))
        .catch(err => {
            console.log(err)
            next(err);
        })
}

/*
 * POST /planets/:id/comment route to retrieve a book given its id.
 */
function postPlanetComment(req, res, next) {
    return planetDao.inserOneComment(req.params.id,
        {
            text: req.body.text,
            score: req.body.score
        }).then(result =>
        res.json({
            status: 'ok',
            response: result
        }))
        .catch(err => {
            console.log(err)
            next(err);
        })


}


/*
 * As swapi does not return the id of the planet
 * we extract it form the url it provides
 *
 */
function getPlanetId(url) {
    const tokens = url.split('/');
    return tokens[tokens.length - 2];

}

//export all the functions
module.exports = {postPlanetComment, getAllPlanets, getPlanetsByLocalId, postPlanet};