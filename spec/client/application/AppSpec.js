import App from '../../../lib/application/App.js';

describe('App', function() {

  let initializer;
  let startConfig;

  beforeEach(function() {
    startConfig = {};
    initializer = jasmine.createSpy();
  });

  afterEach(function() {
    App.reset();
  });

  // xdescribe('when on the server', function() {

  //   beforeEach(function() {
  //     spyOn(Environment, 'isServer').and.returnValue(true);
  //   });

  //   it('runs initializers', function() {
  //     App.addInitializer(initializer);

  //     App.initialize(startConfig);

  //     expect(initializer).toHaveBeenCalledWith(startConfig);
  //   });

  //   it('runs server initializers', function() {
  //     App.addServerInitializer(initializer);

  //     App.initialize(startConfig);

  //     expect(initializer).toHaveBeenCalledWith(startConfig);
  //   });

  //   it('does NOT run client initializers', function() {
  //     App.addClientInitializer(initializer);

  //     App.initialize(startConfig);

  //     expect(initializer).not.toHaveBeenCalled();
  //   });

  //   it('runs initializers and server initializers in the order they were added', function() {
  //     const order = [];

  //     function identifyAs(number) {
  //       return function() {
  //         order.push(number);
  //       };
  //     }

  //     App.addInitializer(identifyAs(1));
  //     App.addServerInitializer(identifyAs(2));
  //     App.addServerInitializer(identifyAs(3));
  //     App.addInitializer(identifyAs(4));

  //     App.initialize(startConfig);

  //     expect(order).toEqual([1, 2, 3, 4]);
  //   });

  // });

  describe('when on the client', function() {

    it('runs initializers', function() {
      App.addInitializer(initializer);

      App.initialize(startConfig);

      expect(initializer).toHaveBeenCalledWith(startConfig);
    });

    it('does NOT run server initializers', function() {
      App.addServerInitializer(initializer);

      App.initialize(startConfig);

      expect(initializer).not.toHaveBeenCalled();
    });

    it('runs client initializers', function() {
      App.addClientInitializer(initializer);

      App.initialize(startConfig);

      expect(initializer).toHaveBeenCalledWith(startConfig);
    });

    it('runs initializers and client initializers in the order they were added', function() {
      const order = [];

      function identifyAs(number) {
        return function() {
          order.push(number);
        };
      }

      App.addInitializer(identifyAs(1));
      App.addClientInitializer(identifyAs(2));
      App.addClientInitializer(identifyAs(3));
      App.addInitializer(identifyAs(4));

      App.initialize(startConfig);

      expect(order).toEqual([1, 2, 3, 4]);
    });

  });

});

