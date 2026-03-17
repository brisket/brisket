import BaseView from '../base/BaseView.js';

const HomeView = BaseView.extend({

  className: 'homepage',

  template: `
    <style>
      .target-links a::after {
        content: " (" attr(target) ")";
      }

      .ajax-links,
      .target-links {
        margin-top: 1em;
    }
    </style>

    <h1>Welcome to your first Brisket site!</h1>

    <section class="routes">
      <h2>Check out the sides</h2>

      <strong>Standard route:</strong> <a href="sides/mac-and-cheese" data-testid="mac-and-cheese-link">Eat Mac and Cheese</a>

      <div class="ajax-links">
        <strong>Routes with ajax:</strong>
        <br>
        <a href="sides/greens" data-testid="greens-link">Greens</a>
        <br>
        <a href="sides/vegetables/green-bean-casserole" data-testid="green-bean-casserole-link">Green Bean Casserole</a>
        <br>
        <a href="sides/polenta" data-testid="polenta-link">Polenta</a>
        <br>
        <a href="sides/vegetables/sweet-potato" target="_blank" data-testid="_blank-link">Sweet Potato</a>
      </div>
      
      <div class="target-links">
        <strong>Links using "target":</strong>
        <br>
        <a href="sides/cornbread" target="_self" data-testid="cornbread-link">Corn Bread</a>
        <br>
        <a href="sides/baked-beans" target="_top" data-testid="_top-link">Baked Beans</a>
        <br>
        <a href="sides/bread" target="_parent" data-testid="_parent-link">Bread</a>
        <br>
        <a href="sides/fries" target="named-window" data-testid="named-window-1-link">Fries</a>
        <br>
        <a href="sides/vegetables/pickles" target="named-window" data-testid="named-window-2-link">Pickles</a>
      </div>
    </section>

    <section class="error-pages">
      <h2>Error pages</h2>
      <a href="404" data-testid="404-link">Not found</a>
      <br>
      <a href="500" data-testid="500-link">Default Error View</a>
    </section>
  `
});

export default HomeView;
