describe('Brisket in debug mode', function() {

  it('sets up instrumentation for Backbone when debug mode enabled', async function() {
    window.BrisketConfig = {
      debug: true
    };
    spyOnBackboneDebbuger();

    const { default: Backbone } = await import('../../../lib/application/Backbone');

    expect(window.__backboneAgent.handleBackbone).toHaveBeenCalledWith(Backbone);
  });

  function spyOnBackboneDebbuger() {
    if (window.__backboneAgent) {
      spyOn(window.__backboneAgent, 'handleBackbone');
      return;
    }

    window.__backboneAgent = {
      handleBackbone: jasmine.createSpy('handleBackbone')
    };
  }

});

