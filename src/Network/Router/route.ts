/// <reference path="../index.d.ts" />

export default class Route {
    private method:MethodDes;
    private handler:RequestHandler;
    private options
    constructor( method:MethodDes, handler:RequestHandler,options={}) {
      this.method = method;
      this.handler = handler;
      this.options = options;
    }
    public makeHandler() {
      return  (request)=>{
        return this.handler(request, this.options);
      };
    }
  }

