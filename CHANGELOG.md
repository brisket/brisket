Changelog
==========

### 0.39.0
- layout enters dom before view
- Respect target attribute for relative links.
- add a benchmark for creating many child views
- improve childViewCount performance
- add benchmark tests
- Update brisket.childviews.md

### 0.38.0
- Revert /api/* support (2e712aa4bb8da2f5026dc33134a1c89f5a62555b)

### 0.37.1
- Use Function.prototype as noop
- Fix memory leak in script injection mechanism

### 0.37.0
- Reroutes any requests with a prefix of /api to the apiHost. Without this, client-side model/collection requests would need to be routed via separate middleware.

### 0.36.2
- upgrade jquery-mockjax -> 2.0.1

### 0.36.1
- IE9 Console fix

### 0.36.0
- add in LinkTags and OpenGraphTags in addition to Metatags
- allow renderMetatags to accept Array

### 0.35.1
- add way to enable events for testing

### 0.35.0
- introduce Brisket.Events
- disable delegateEvents on server

### 0.34.1
- remove backToNormal on first page view

### 0.34.0
- Releases a breaking change to brisket that requires the application developer to pass a clientAppUrl in the environment config. Refer to [brisket.createserver](docs/brisket.createserver.md) for usage

### 0.33.1
- Encode bootstrapped data url to prevent XSS attack

### 0.33.0
- #14 Upgrade jquery.mockjax to 2.0.0-beta. Browserify shim no longer necessary.

### 0.32.0
- expose functionality to trigger route
- run brisket tests against io.js
- recipe: jump to top of page on new route

### 0.31.2

- Fix "test-on-server" grunt task. It should fail the task if any test failed.

### 0.31.1

- Strips illegal javascript string characters in bootstrap data. (\u2028 | \u2029)

### 0.31.0

- #114 expose Brisket Version on the client
- #113 support query params in bootstrapped data
- #111 set response headers

### 0.30.0

- request.cookies exposes user's cookies
- fire 'on-dom' event when View enters DOM
- Annotate server dependencies in the browser section of package.json

### 0.29.0

- optimize view reattachment
- environmentConfig available in layout on client
- add jquery-mockjax to browser dependencies
- test brisket against node 0.12
- upgrade bluebird -> ~2.9.7
- request.applicationPath
- simplify App start
- fix jquery ajax on server when using jquery 2.x
- support jquery 2.x
- update to request and response docs
- fix error while rendering errors


### 0.28.0

- Upgrade jsdom to ~3.1.0
