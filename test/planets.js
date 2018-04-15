//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const Planet = require('../app/models/planetsModel');

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();


chai.use(chaiHttp);

//Our parent block
describe('Planet', () => {
    before((done) => { //Before  test we empty the database
        Planet.remove({}, (err) => {
            done();
        });
    });
    /*
     * Test the /GET route
     */
    describe('/GET All Planets', () => {
        it('it should GET all the Planet', (done) => {
            chai.request(server)
                .get('/planets')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.response.should.be.a('array');
                    res.body.response.length.should.be.eql(0);
                    done();
                });
        });
    });
    /*
     * Test the /POST route
     */
    describe('/POST Planets', () => {
        it('it should not POST a Planets without name field as string', (done) => {
            const planet = {
                name: 1234,
            }
            chai.request(server)
                .post('/planets')
                .send(planet)
                .end((err, res) => {
                    // shall result in error
                    res.body.should.have.property('status').eql('error');
                    done();
                });
        });

        it('it should POST a planet ', (done) => {
            const planet = {
                name: "Tatooine",
            }
            chai.request(server)
                .post('/planets')
                .send(planet)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('ok');
                    res.body.response.should.have.property('name');
                    res.body.response.should.have.property('_id');
                    res.body.response.should.have.property('json_data');
                    done();
                });
        });
    });

    /*
   * Test the /GET by id  route
   */
    describe('/GET Planets by id', () => {
        let id = 0;
        it('it should POST a planet ', (done) => {
            const planet = {
                name: "Tatooine",
            }
            chai.request(server)
                .post('/planets')
                .send(planet)
                .end((err, res) => {
                    res.should.have.status(201);
                    id = res.body.response._id;
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('ok');
                    res.body.response.should.have.property('name');
                    res.body.response.should.have.property('_id');
                    res.body.response.should.have.property('json_data');
                    done();
                });
        });
        it('it should GET a planet ', (done) => {
            console.log(id);
            chai.request(server)
                .get('/planets/' + id)
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('ok');
                    res.body.response.should.have.property('name');
                    res.body.response.should.have.property('_id');
                    res.body.response.should.have.property('json_data');
                    console.log(res.body);
                    done();
                });
        });
    });

    /*
* Test the /POST login test
* */
    describe('/POST login test', () => {
        let id = 0;
        it('it NOT should login ', (done) => {
            const cred = {
                username: "admin",
                password: "123"
            }
            chai.request(server)
                .post('/login')
                .send(cred)
                .end((err, res) => {
                    // shall result in error
                    res.body.should.have.property('status').eql('error');
                    res.body.should.have.property('response').eql('Invalid credentials');
                    done();
                });
        });
        it('it should login ', (done) => {
            console.log(id);
            const cred = {
                username: "admin",
                password: "1234"
            }
            chai.request(server)
                .post('/login')
                .send(cred)
                .end((err, res) => {
                    res.should.have.status(200);
                    console.log(res.body);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('ok');
                    res.body.should.have.property('response');
                    res.body.response.should.have.property('key').eql('verySecretKey');

                    done();
                });
        });
    });

    /*
* Test the /POST comment test
* */
    describe('/Post comment ', () => {
        let id = 0;
        it('it should POST a planet ', (done) => {
            const planet = {
                name: "Hoth",
            }
            chai.request(server)
                .post('/planets')
                .send(planet)
                .end((err, res) => {
                    res.should.have.status(201);
                    id = res.body.response._id;
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('ok');
                    res.body.response.should.have.property('name').eql('Hoth');
                    res.body.response.should.have.property('_id');
                    res.body.response.should.have.property('json_data');
                    done();
                });
        });
        it('it should GET all the Planet', (done) => {
            console.log(id)
            const comment ={
                text:"I am a comment",
                score:5
            }
            chai.request(server)
                .post('/planets/'+id+'/comment/?key=verySecretKey')
                .send(comment)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('ok');
                    res.body.should.have.property('response');
                    res.body.response.should.have.property('comments');
                    res.body.response.comments.length.should.be.eql(1);
                    console.log( res.body.response.comments)
                    res.body.response.comments[0].score.should.be.eql(5);
                    res.body.response.comments[0].text.should.be.eql('I am a comment');
                    done();
                });
        });
    });

});
  