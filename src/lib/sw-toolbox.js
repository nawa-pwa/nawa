/*
  Copyright 2014 Google Inc. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
'use strict';

// This is the entrypoint for the sw-toolbox bundle. All code with
// side effects (e.g. adding event listeners) should be in this file.



import router  from './router';
import helpers  from './helpers';
import strategies  from './strategies';
import listeners  from './listeners';

helpers.debug('Service Worker Toolbox is loading');

export default {
  networkOnly: strategies.networkOnly,
  networkFirst: strategies.networkFirst,
  cacheOnly: strategies.cacheOnly,
  cacheFirst: strategies.cacheFirst,
  fastest: strategies.fastest,
  cacheUpdate:strategies.cacheUpdate,
  router: router,
  cache: helpers.cache,
  uncache: helpers.uncache,
  precache: helpers.precache
};
