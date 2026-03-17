import noop from '../util/noop.js';

const LENGTH_OF_LEADING_SLASH = '/'.length;

const ServerRequest = {

  from(expressRequest, environmentConfig) {
    environmentConfig = environmentConfig || {};
    const rawQuery = getRawQuery(expressRequest.originalUrl);
    const appRoot = environmentConfig.appRoot || '';
    const applicationPath = expressRequest.path;

    return {
      host: expressRequest.headers.host,
      hostname: expressRequest.hostname,
      path: appRoot + applicationPath,
      applicationPath: applicationPath.substring(LENGTH_OF_LEADING_SLASH),
      protocol: expressRequest.protocol,
      query: expressRequest.query,
      rawQuery,
      referrer: expressRequest.headers['referer'],
      userAgent: expressRequest.headers['user-agent'],
      isFirstRequest: true,
      requestId: 1,
      isNotClick: false,
      environmentConfig,
      cookies: expressRequest.cookies || null,
      onComplete: noop,
      complete: noop
    };
  }
};

function getRawQuery(originalUrl) {

  if (typeof originalUrl !== 'string') {
    return null;
  }

  return originalUrl.split('?')[1] || null;
}

export default ServerRequest;

