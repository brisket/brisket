/**
 * Determines whether the target points to a different window, and thus outside of
 * the current instance of the application.
 * @param {String} target The value of the link's target attribute.
 * @returns {Boolean} true when the target is:
 *   - "_blank",
 *   - "_parent", and the parent window isn't the current window,
 *   - "_top", and the top window isn't the current window.
 *   - a named window or frame (any other value besides "_self").
 */
function isExternalLinkTarget(target) {
  return target === '_blank' ||
        (target === '_parent' && window.parent !== window.self) ||
        (target === '_top' && window.top !== window.self) ||
        (typeof target === 'string' && target !== '_self');
}

export default isExternalLinkTarget;

