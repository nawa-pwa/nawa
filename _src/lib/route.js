'use strict';

// TODO: Use self.registration.scope instead of self.location
var url = new URL('./', self.location);
var basePath = url.pathname;

export default class Route {
  constructor(method, path, handler, options) {
    // if the path is not regexp , convert it into regexp
    if (!(path instanceof RegExp)) {
      path = new RegExp(path, 'ig');
    }
    this.regexp = path;

    this.method = method;
    this.options = options;
    this.handler = handler;
  }
  makeHandler(url) {
    var values;

    return function (request) {
      return this.handler(request, values, this.options);
    }.bind(this);
    
  }
}
