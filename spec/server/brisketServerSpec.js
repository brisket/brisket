import nock from 'nock';
import supertest from 'supertest';
import Brisket from '../../lib/brisket.js';
import MockBrisketApp from '../mock/MockBrisketApp.js';

describe('Brisket server', function() {

  let brisketServer;

  beforeEach(function() {
    MockBrisketApp.initialize();

    nock('http://api.example.com')
      .persist()
      .get('/fetch200')
      .reply(200, { ok: true })
      .get('/fetchWithParams200')
      .query({ some: 'query-param' })
      .reply(200, { ok: true })
      .get('/fetch404')
      .reply(404, { ok: false })
      .get('/fetch500')
      .reply(500, { ok: false })
      .get('/fetch410')
      .reply(410, { ok: false })
      .post('/post200')
      .reply(200, { ok: true })
      .delete('/delete200')
      .reply(200, { ok: true })
      .patch('/patch200')
      .reply(200, { ok: true })
      .head('/head200')
      .reply(200)
      .get(/.+/)
      .reply(404);

    brisketServer = Brisket.createServer({
      apis: {
        'api': {
          host: 'http://api.example.com',
          proxy: null
        }
      }
    });
  });

  afterEach(function() {
    MockBrisketApp.cleanup();
    nock.cleanAll();
  });

  describe('route requests', function() {
    it('returns 200 when route is working', function(done) {
      supertest(brisketServer)
        .get('/working')
        .expect(200, handle(done));
    });

    it('returns 500 when route is failing', function(done) {
      supertest(brisketServer)
        .get('/failing')
        .expect(500, handle(done));
    });

    it('returns 302 when route is redirecting', function(done) {
      supertest(brisketServer)
        .get('/redirecting')
        .expect(302, handle(done));
    });

    it('returns status from route when route sets status', function(done) {
      supertest(brisketServer)
        .get('/setsStatus')
        .expect(206, handle(done));
    });

    it('returns 200 when data fetch is 200 AND route code doesn\'t error', function(done) {
      supertest(brisketServer)
        .get('/fetch200')
        .expect(200, handle(done));
    });

    it('returns 500 when data fetch is 200 BUT route code errors', function(done) {
      supertest(brisketServer)
        .get('/fetch200ButRouteFails')
        .expect(500, handle(done));
    });

    it('returns 302 when data fetch is 200 BUT route code redirects', function(done) {
      supertest(brisketServer)
        .get('/fetch200ButRouteRedirects')
        .expect(302, handle(done));
    });

    it('returns status from route when data fetch is 200 BUT route sets status', function(done) {
      supertest(brisketServer)
        .get('/fetch200ButRouteSetsStatus')
        .expect(206, handle(done));
    });

    it('returns 404 when route does NOT exist', function(done) {
      supertest(brisketServer)
        .get('/doesntexist')
        .expect(404, handle(done));
    });

    it('returns 404 when data fetch is 404', function(done) {
      supertest(brisketServer)
        .get('/fetch404')
        .expect(404, handle(done));
    });

    it('returns 500 when data fetch is 500', function(done) {
      supertest(brisketServer)
        .get('/fetch500')
        .expect(500, handle(done));
    });

    it('returns 500 when data fetch is unexpected error code', function(done) {
      supertest(brisketServer)
        .get('/fetch410')
        .expect(500, handle(done));
    });
  });

  describe('forwarding api requests to configured apis and returning response', function() {

    describe('GETs', function() {
      it('responds with 200 when underlying api request is 200', function(done) {
        supertest(brisketServer)
          .get('/api/fetch200')
          .expect(200, { ok: true }, handle(done));
      });

      it('forwards query params to underlying api', function(done) {
        supertest(brisketServer)
          .get('/api/fetchWithParams200?some=query-param')
          .expect(200, { ok: true }, handle(done));
      });

      it('responds with 404 when underlying api request is 404', function(done) {
        supertest(brisketServer)
          .get('/api/fetch404')
          .expect(404, { ok: false }, handle(done));
      });

      it('responds with 500 when underlying api request is 500', function(done) {
        supertest(brisketServer)
          .get('/api/fetch500')
          .expect(500, { ok: false }, handle(done));
      });

      it('responds with 410 when underlying api request is 410', function(done) {
        supertest(brisketServer)
          .get('/api/fetch410')
          .expect(410, { ok: false }, handle(done));
      });

      it('responds with 404 when underlying api request cant match route', function(done) {
        supertest(brisketServer)
          .get('/api/unknown/path')
          .expect(404, handle(done));
      });
    });

    describe('other HTTP VERBs', function() {
      xit('forwards POST requests with body', function(done) {
        supertest(brisketServer)
          .post('/api/post200')
          .send({ some: 'post-param' })
          .set('Accept', 'application/json')
          .expect(200, { ok: true }, handle(done));
      });

      it('forwards simple POST requests', function(done) {
        supertest(brisketServer)
          .post('/api/post200')
          .set('Accept', 'application/json')
          .expect(200, { ok: true }, handle(done));
      });

      it('forwards DELETE requests', function(done) {
        supertest(brisketServer)
          .delete('/api/delete200')
          .expect(200, { ok: true }, handle(done));
      });

      it('forwards PATCH requests', function(done) {
        supertest(brisketServer)
          .patch('/api/patch200')
          .expect(200, { ok: true }, handle(done));
      });

      it('forwards HEAD requests', function(done) {
        supertest(brisketServer)
          .head('/api/head200')
          .expect(200, handle(done));
      });
      // it('responds with 404 when underlying api request is 404', function(done) {
      //   supertest(brisketServer)
      //     .post('/api/fetch404')
      //     .expect(404, { ok: false }, mocha(done));
      // });

      // it('responds with 500 when underlying api request is 500', function(done) {
      //   supertest(brisketServer)
      //     .post('/api/fetch500')
      //     .expect(500, { ok: false }, mocha(done));
      // });

      // it('responds with 410 when underlying api request is 410', function(done) {
      //   supertest(brisketServer)
      //     .post('/api/fetch410')
      //     .expect(410, { ok: false }, mocha(done));
      // });

      // it('responds with 404 when underlying api request cant match route', function(done) {
      //   supertest(brisketServer)
      //     .post('/api/unknown/path')
      //     .expect(404, mocha(done));
      // });
    });
  });

  function handle(done) {
    return function(err) {
      if (err) {
        done.fail(err);
      } else {
        done();
      }
    };
  }
});
