export default class Route {

    constructor(public method:MethodDes,public handler:RequestHandler,public options={}) {}
    public makeHandler() {
      return function (request) {
        return this.handler(request, this.options);
      }.bind(this);
    }
  }

