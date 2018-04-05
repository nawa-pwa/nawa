import { stringToRegexp } from './helpers';


class Options {
  constructor() {
    this.origin = null
    this.debug = false
    this.timeout = 7
    this.whiteList = []
    this.preCacheItems = [] // precache resource
    // indicate when new sw.js is meeting, immediately update A regular expression
    // to apply to HTTP response codes. Codes that match will be considered
    // successes, while others will not, and will not be cached.
    this.forceUpdate = true
    this.successResponses = /^0|([123]\d\d)|(40[14567])|410$/
    this.captureSW = false
    this.cache = {
      name: "satarify",
      maxAgeSeconds: 60 *2,
      maxEntries: 150,
      queryOptions: null
    }
  }

  set setCache(obj) {
    this.cache = Object.assign({}, this.cache, obj);
  }
  /**
   * @param [Array || String]
   */
  set setWhiteList(list){
    if(list instanceof Array){
      list = stringToRegexp(list);
    }else if(typeof list === "string"){
      list = [new RegExp(list,'i')];
    }else{
      throw new Error('whiteList should be Array or String');
    }

    this.whiteList = list;

    
  }

}

const test = new Options();

export default test;