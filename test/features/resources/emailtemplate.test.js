var assert = require('assert');
var request = require('supertest');
var helpers = require('we-test-tools').helpers;
var stubs = require('we-test-tools').stubs;
var _ = require('lodash');
var http;
var we;

describe('emailtemplateFeature', function () {
  var salvedPage, salvedUser, salvedUserPassword;
  var authenticatedRequest;

  before(function (done) {
    http = helpers.getHttp();
    we = helpers.getWe();

    var userStub = stubs.userStub();
    helpers.createUser(userStub, function(err, user) {
      if (err) throw err;

      salvedUser = user;
      salvedUserPassword = userStub.password;

      // login user and save the browser
      authenticatedRequest = request.agent(http);
      authenticatedRequest.post('/login')
      .set('Accept', 'application/json')
      .send({
        email: salvedUser.email,
        password: salvedUserPassword
      })
      .expect(200)
      .set('Accept', 'application/json')
      .end(function (err, res) {
        if (err) throw err;

        done();
      });

    });
  });

  describe('find', function () {
    it('get /emailtemplate route should find one emailtemplate', function(done){
      request(http)
      .get('/emailtemplate')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        assert.equal(200, res.status);
        assert(res.body.emailtemplate);
        assert( _.isArray(res.body.emailtemplate) , 'emailtemplate not is array');
        assert(res.body.meta);

        done();
      });
    });
  });
  describe('create', function () {
    it('post /emailtemplate create one emailtemplate record');
  });
  describe('findOne', function () {
    it('get /emailtemplate/:id should return one emailtemplate');
  });
  describe('update', function () {
    it('put /emailtemplate/:id should upate and return emailtemplate');
  });
  describe('destroy', function () {
    it('delete /emailtemplate/:id should delete one emailtemplate')
  });
});
