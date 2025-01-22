function pathJoin(root, path) {
  return withTrailingSlash(root) + withoutLeadingSlash(path);
}

function withTrailingSlash(string) {
  return `${(string || '').replace(/\/$/, '')}/`;
}

function withoutLeadingSlash(string) {
  return (string || '').replace(/^\//, '');
}

export default pathJoin;
