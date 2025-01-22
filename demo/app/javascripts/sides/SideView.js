import BaseView from '../base/BaseView.js';

const SideView = BaseView.extend({

  template({ name }) {
    return `
      <section class="side">
        <h1>${name}</h1>
      </section>
    `;
  },

  onDOM() {
    const url = this.model.get('url');

    this.$('.side').append(`<img src="${url}" data-testid="side-image">`);
  }

});

export default SideView;
