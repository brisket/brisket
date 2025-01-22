const EMPTY_PATH = '';

function constructQualifiedUrl(params) {
  if (!params.protocol || !params.host) {
    return null;
  }

  return `${params.protocol}://${params.host}${delimitPath(params.path)}`;
}

function delimitPath(path) {
  if (!path) {
    return EMPTY_PATH;
  }

  return path;
}

export default constructQualifiedUrl;

