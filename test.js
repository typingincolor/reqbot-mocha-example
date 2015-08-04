var assert = require("assert");
var expect = require('chai').expect;
var request = require('superagent');
var Q = require('q');

describe('Example reqbot test', function() {
  it('should POST a response and recieve it back', function(done) {
    var programmed_response = {
      headers: {
        header1: "value1"
      },
      body: "this is a body",
      tags: ["mocha_test"]
    };

    request.post('https://reqbot-api.herokuapp.com/responses')
      .send(programmed_response)
      .end(function(err, res) {
        if (!!err) {
          console.info("error", err);
        } else {
          request.get("https://reqbot-api.herokuapp.com/mocha_test")
            .set('X-REQBOT-RESPONSE', res.body.uuid)
            .end(function(err, res) {
              console.info("hello");
              if (!!err) {
                console.info("error", err);
              } else {
                expect(res).to.be.text;
                expect(res.status).to.equal(200);
                expect(res.text).to.equal("this is a body");
                expect(res.header.header1).to.equal("value1");
                done();
              }
            });
        }
      });
  });
});
