import { restClient, authClient } from 'aor-feathers-client';
import feathers, { rest, authentication } from '@feathersjs/client'
// import rest from '@feathersjs/rest-client';
// import auth from '@feathersjs/authentication-client';
import $ from 'jquery'

const feathersClient = feathers();
const feathersRestClient = rest(process.env.REACT_APP_BACKEND_URI);
feathersClient.configure(feathersRestClient.jquery($))
feathersClient.configure(authentication({
  storage: window.localStorage
}))
// to rename id field for *all* resources use this syntax:
const options = { id: '_id' };

const authClientOptions = {
  storageKey: 'feathers-jwt',
  authenticate: { strategy: 'local' },
};

export const dataProvider = restClient(feathersClient, options);

export const authProvider = authClient(feathersClient, authClientOptions);