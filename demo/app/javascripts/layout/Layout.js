import Brisket from '../../../../lib/brisket.js';
import BaseView from '../base/BaseView.js';

const Layout = Brisket.Layout.extend({

  content: '#content',

  initialize() {
    this.model.on({
      'change:pageType': updatePageType,
      'change:title': updateTitle
    }, this);
  },

  beforeRender() {
    this.createChildView('header', HeaderView);
  },

  template({ views, pageType = 'normal', title = 'Your first Brisket site', metatags }) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>

        ${buildMetatags(metatags)}
      </head>
      <body class="type-${pageType}">
        ${views.header}

        <div id="content"></div>

        <script type="text/javascript" src="/javascripts/application.js" type="module" async></script>
      </body>
      </html>
    `
  }

});

function updatePageType(model, pageType = 'normal') {
  document.body.className = document.body.className.replace(/type-[^\b]+/, `type-${pageType}`);
}

function updateTitle(model, title = 'Your first Brisket site') {
  document.title = title;
}

function buildMetatags(metatags = {}) {
  return Object.keys(metatags)
    .map(key => {
      const value = metatags[key];

      if (key.startsWith('og:')) {
        return `<meta property='${key}' content='${value}'>`;
      }

      return `<meta name='${key}' content='${value}'>`;
    })
    .join('');
}

const HeaderView = BaseView.extend({

  template: `
    <header>
      <h1>
        <a href="" class="logo" data-testid="logo-link">Brisket</a>
      </h1>
    </header>
  `,

  onDOM() {
    const $logo = this.$('.logo').addClass('animated');

    $logo.fadeOut(function() {
      $logo.fadeIn();
    });
  }

});

export default Layout;
