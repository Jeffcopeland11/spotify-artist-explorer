var OAuthConfig = (function() {
  'use strict';

  var clientId = '8b5a14d8cbc64d0995afc80ee2722fe3';
  var redirectUri;
  if (location.host === 'localhost:8000') {
    redirectUri = 'http://localhost:8000/callback.html';
  } else {
    redirectUri = 'https://artist-explorer.glitch.me/callback.html';
  }
  var host = /http[s]?:\/\/[^/]+/.exec(redirectUri)[0];
  return {
    clientId: clientId,
    redirectUri: redirectUri,
    host: host
  };
})();