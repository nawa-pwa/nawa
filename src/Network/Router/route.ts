export default class Route {

    constructor(public method,public path,public handler,public options) {
      // if the path is not regexp , convert it into regexp
      if (!(path instanceof RegExp)) {
        path = new RegExp(path, 'ig');
      }
  
    }
    makeHandler(url) {
  
      return function (request) {
        return this.handler(request, this.options);
      }.bind(this);
    }
  }