var OAuthConfig = (function() {
  'use strict';

  var clientId = '9787428123224ad48de472bc70557422';
  var redirectUri;
  if (location.host === 'localhost:8000') {
    redirectUri = 'http://localhost:8000/callback.html';
  } else {
    redirectUri = 'https://spotify-artist-explorer.glitch.me/callback.html';
  }
  var host = /http[s]?:\/\/[^/]+/.exec(redirectUri)[0];
  return {
    clientId: clientId,
    redirectUri: redirectUri,
    host: host
  };
})();