var assert = require("assert");
var expect = require('chai').expect;
var request = require('superagent');
var Q = require('q');

var create_response = function() {
  var programmed_response = {
    headers: {
      header1: "value1"
    },
    body: "this is a body",
    tags: ["mocha_test"]
  };

  var deferred = Q.defer();

  request.post('https://reqbot-api.herokuapp.com/responses')
    .send(programmed_response)
    .end(function(err, res) {
      if (!!err) {
        console.info("error", err);
        deferred.reject(err);
      } else {
        deferred.resolve(res.body.uuid);
      }
    });

  return deferred.promise;
};

var get_response = function(uuid) {
  var deferred = Q.defer();
  request.get("https://reqbot-api.herokuapp.com/mocha_test")
    .set('X-REQBOT-RESPONSE', uuid)
    .end(function(err, res) {
      console.info("hello");
      if (!!err) {
        console.info("error", err);
        deferred.reject(err);
      } else {
        deferred.resolve(res);
      }
    });
  return deferred.promise;
};

describe('Example reqbot test', function() {
  it('should POST a response and recieve it back', function(done) {
    create_response().then(function(uuid) {
      return get_response(uuid);
    }).then(function(result) {
      expect(result).to.be.text;
      expect(result.status).to.equal(200);
      expect(result.text).to.equal("this is a body");
      expect(result.header.header1).to.equal("value1");
      done();
    }).fail(function(err) {
      done(err);
    });
  });
});