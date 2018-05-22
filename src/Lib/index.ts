import store from '../Store';

export function debug(message) {
    var flag = store.debug
    
    if (flag) {
      console.log('[nawa] ' + message);
    }
  }