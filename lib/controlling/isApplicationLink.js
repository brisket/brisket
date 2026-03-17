const NOT_APPLICATION_LINK = /^[#]|^http|^\/|^mailto|^javascript:/;

function isApplicationLink(link) {
  return !NOT_APPLICATION_LINK.test(link);
}

export default isApplicationLink;

