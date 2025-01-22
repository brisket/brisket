import DomainLocalStorage from '../../lib/server/DomainLocalStorage.js';
import { create as createDomain } from 'domain';

describe('DomainLocalStorage', function() {

  describe('middleware', function() {

    let request;
    let response;

    beforeEach(function() {
      request = {};
      response = {};
    });

    afterEach(function() {
      DomainLocalStorage.clear();
    });

    it('binds a domain to the next middleware', function(done) {
      function next() {
        expect(process.domain).toBeDefined();
        done();
      }

      DomainLocalStorage.middleware(request, response, next);
    });

    it('creates a field on the domain to store data', function(done) {
      function next() {
        expect(process.domain['brisket:domainLocalStorage']).toBeDefined();
        done();
      }

      DomainLocalStorage.middleware(request, response, next);
    });

    it('adds request as an event emitter to the domain in case it throws an error', function(done) {
      function next() {
        expect(process.domain.members).toContain(request);
        done();
      }

      DomainLocalStorage.middleware(request, response, next);
    });

    it('adds response as an event emitter to the domain in case it throws an error', function(done) {
      function next() {
        expect(process.domain.members).toContain(response);
        done();
      }

      DomainLocalStorage.middleware(request, response, next);
    });

    describe('when there is an active domain AND it had been created by middleware', function() {

      it('sets data onto and gets data from the active domain', function(done) {
        function next() {
          DomainLocalStorage.set('key1', 'value1');
          DomainLocalStorage.set('key2', 'value2');

          expect(DomainLocalStorage.get('key1')).toBe('value1');
          expect(DomainLocalStorage.get('key2')).toBe('value2');

          expect(DomainLocalStorage.getAll()).toEqual({
            'key1': 'value1',
            'key2': 'value2'
          });

          done();
        }

        DomainLocalStorage.middleware(request, response, next);
      });

    });

    describe('when there is an active domain AND it had NOT been created by middleware', function() {

      it('cannot set data onto nor get data from the active domain', function(done) {
        function next() {
          DomainLocalStorage.set('key3', 'value3');
          DomainLocalStorage.set('key4', 'value4');

          expect(DomainLocalStorage.get('key3')).toBeNull();
          expect(DomainLocalStorage.get('key4')).toBeNull();

          expect(DomainLocalStorage.getAll()).toBeNull();
          done();
        }

        const domain = createDomain();

        domain.run(function() {
          next();
        });
      });

    });

    describe('when there is NOT an active domain', function() {

      it('cannot set data onto nor get data from the active domain', function(done) {
        function next() {

          DomainLocalStorage.set('key5', 'value5');
          DomainLocalStorage.set('key6', 'value6');

          expect(DomainLocalStorage.get('key5')).toBeNull();
          expect(DomainLocalStorage.get('key6')).toBeNull();

          expect(DomainLocalStorage.getAll()).toBeNull();
          done();
        }

        next();
      });

    });

  });

});

