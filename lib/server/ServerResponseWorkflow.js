const ServerResponseWorkflow = {

  sendResponseFor(whenContentIsReturned, expressResponse, next) {
    return Promise.resolve(whenContentIsReturned)
      .then(
        send(expressResponse)
      )['catch'](
        sendUnhandleableErrorToNextMiddleware(next)
      );
  }

};

function send(expressResponse) {
  return function(responseForRoute) {
    const serverResponse = responseForRoute.serverResponse;

    if (serverResponse.isSuccess()) {
      expressResponse.set(serverResponse.headers);
    }

    if (serverResponse.shouldRedirect()) {
      expressResponse.redirect(serverResponse.statusCode, serverResponse.redirectDestination);
      return;
    }

    expressResponse
      .status(serverResponse.statusCode)
      .send(responseForRoute.html);
  };
}

function sendUnhandleableErrorToNextMiddleware(next) {
  return function(error) {
    next(error);
  };
}

export default ServerResponseWorkflow;

