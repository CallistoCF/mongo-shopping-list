global.DATABASE_URL = 'mongodb://localhost/shopping-list-test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require('mongoose');
var server = require('../server.js');
var Item = require('../models/item');

var should = chai.should();
var app = server.app;
var d = '';

chai.use(chaiHttp);

describe('test: Mongo Express Shopping List', function() {
    before(function(done) {
      server.runServer(function() {
          Item.create({name: 'Broad beans'},
                      {name: 'Tomatoes'},
                      {name: 'Peppers'}, function() {
              console.log("test: Finished creating items");
              done();
          });
        });
    });

    after(function(done) {
      console.log("test done!");
        Item.remove(function() {
          console.log("removing items: ");
            done();
        });
    });


    it('should list items on GET', function(done) {
        chai.request(app)
            .get('/items')
            .set('content-type','application/json; charset=utf-8')
            .end(function(err, res) {
              should.equal(err, null);
              res.should.have.status(201);
              res.should.be.json;
              res.body.should.be.a('array');
              res.body.should.have.length(3);
              res.body[0].should.be.a('object');
              res.body[0].should.have.property('_id');
              res.body[0].should.have.property('name');
              res.body[0]._id.should.be.a('string');
              res.body[0].name.should.be.a('string');
              res.body[0].name.should.equal('Broad beans');
              res.body[1].name.should.equal('Tomatoes');
              res.body[2].name.should.equal('Peppers');
              done();
            });
    });



    it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/items')
            .send({'name':'Tomatoes'})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('_id');
                res.body.name.should.be.a('string');
                res.body._id.should.be.a('string');
                res.body.name.should.equal('Tomatoes');
                done();
            });
    });

});
