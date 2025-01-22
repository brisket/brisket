function addExtraParamsTo(routeArguments, setLayoutData, request, response) {
  // The last parameter in routeArguments is always null because
  //  of Backbone request parsing. So here we just replace that
  //  last parameter with the request. Developers don't usually
  //  notice that the last parameter passed to their route handler
  //  is null. WWARNER 08/21/2014
  return routeArguments
    .slice(0, -1)
    .concat(
      setLayoutData,
      request,
      response
    );
}

export default addExtraParamsTo;

