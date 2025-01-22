const ClientRenderer = {

  render(layout, view, requestId) {
    view.setUid(layout.generateChildUid(requestId));
    view.reattach();

    if (view.isAttached) {
      view.render();
      layout.setContentToAttachedView(view);
    }

    if (view.isNotAlreadyAttachedToDOM()) {
      layout.setContent(view);
    }

    return view;
  }

};

export default ClientRenderer;

