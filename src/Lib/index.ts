import store from '../Store';

interface WorkerLocation {
  hash : String; // "#test"
  host : String; // "localhost:8080"
  hostname : String; // localhost
  href : String; // "http://localhost:8080/swProperty/sw.js"
  origin : String; // "http://localhost:8080"
  pathname : String; // "/swProperty/sw.js"
  port : String; //"8080"
  protocol : String; //"http:"
  search : String;
}

export function debug(message) {
  var flag = store.debug

  if (flag) {
    console.log('[nawa] ' + message);
  }
}

export const urls:WorkerLocation = (():WorkerLocation=>{
  let location: WorkerLocation = self.location;

  let {
    hash,
    host,
    hostname,
    href,
    origin,
    pathname,
    port,
    protocol,
    search
  } = location;

  return {
    hash,
    host,
    hostname,
    href,
    origin,
    pathname,
    port,
    protocol,
    search
  }
})();
