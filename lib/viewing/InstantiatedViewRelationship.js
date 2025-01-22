import ViewRelationship from './ViewRelationship.js';

function InstantiatedViewRelationship(childView, parentView) {
  this.childView = childView;
  this.parentView = parentView;
}

InstantiatedViewRelationship.prototype = Object.create(ViewRelationship.prototype);

InstantiatedViewRelationship.prototype.withOptions = function() {
  throw new Error(
    `You attempted to call withOptions on a child view that has already been instantiated - ${
      this.childView}. The parentView was ${this.parentView}\n` +
        'You cannot use .withOptions when you .createChildView with ' +
        'an instantiated view. For example:' +
        '\n\n' +
        '    var childView = new Brisket.View();' +
        '\n\n' +
        '    parentView.createChildView(childView).withOptions({ some: \'option\' });' +
        '\n\n' +
        'is not allowed. Your childView should be already populated with the ' +
        'options that it needs before you pass it to .createChildView'
  );
};

export default InstantiatedViewRelationship;

