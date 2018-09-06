var express = require('express');
var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi({
  clientId : process.env.SPOTIFY_CLIENT_ID,
  clientSecret : process.env.SPOTIFY_CLIENT_SECRET
});
 
// Retrieve an access token.
function refreshSpotifyClientCredsAccessToken() {
  return spotifyApi.clientCredentialsGrant()
    .then(function(data) {
      console.log('The access token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);

      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token']);
    }, function(err) {
          console.log('Something went wrong when retrieving an access token', err);
    });
};

refreshSpotifyClientCredsAccessToken();

function retryForUnauthorized(promise) {
  return new Promise((resolve, reject) => {
    promise().then(res => {
      resolve(res);
    }).catch(err => {
      if (err.status === 403) {
        refreshSpotifyClientCredsAccessToken().then(() => {
          return promise().then(resolve).catch(reject);
        });
      } else {
        reject(err);
      }
    });
  });
};

var app = express();

const genres = {
    "genres": [ "acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", "black-metal", "bluegrass", "blues", "bossanova", "brazil", "breakbeat", "british", "cantopop", "chicago-house", "children", "chill", "classical", "club", "comedy", "country", "dance", "dancehall", "death-metal", "deep-house", "detroit-techno", "disco", "disney", "drum-and-bass", "dub", "dubstep", "edm", "electro", "electronic", "emo", "folk", "forro", "french", "funk", "garage", "german", "gospel", "goth", "grindcore", "groove", "grunge", "guitar", "happy", "hard-rock", "hardcore", "hardstyle", "heavy-metal", "hip-hop", "holidays", "honky-tonk", "house", "idm", "indian", "indie", "indie-pop", "industrial", "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "kids", "latin", "latino", "malay", "mandopop", "metal", "metal-misc", "metalcore", "minimal-techno", "movies", "mpb", "new-age", "new-release", "opera", "pagode", "party", "philippines-opm", "piano", "pop", "pop-film", "post-dubstep", "power-pop", "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b", "rainy-day", "reggae", "reggaeton", "road-trip", "rock", "rock-n-roll", "rockabilly", "romance", "sad", "salsa", "samba", "sertanejo", "show-tunes", "singer-songwriter", "ska", "sleep", "songwriter", "soul", "soundtracks", "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno", "trance", "trip-hop", "turkish", "work-out", "world-music" ]
}

app.get('/api/genres', (req, res) => {
  res.send(genres);
});

app.get('/api/genres/:genreName/artists', (req, res) => {
  retryForUnauthorized(() =>
    spotifyApi.getRecommendations({
      seed_genres: req.params.genreName
    })
  ).then((recommendations) => {
    res.send(recommendations.body);
  }).catch(console.log);
});

app.get('/spotify/artists/:artistId', (req, res) => {
  retryForUnauthorized(() =>
    spotifyApi.getArtist(req.params.artistId)
  ).then(artist => {
    res.send(artist.body);
  }).catch(console.log);
});

app.get('/spotify/artists', (req, res) => {
  retryForUnauthorized(() =>
    spotifyApi.getArtists(req.query.ids.split(','))
  ).then(artists => {
    res.send(artists.body);
  });
});

app.get('/spotify/artists/:artistId/related-artists', (req, res) => {
  retryForUnauthorized(() =>
    spotifyApi.getArtistRelatedArtists(req.params.artistId)
  ).then(artists => {
    res.send(artists.body);
  });;
});

app.get('/spotify/artists/:artistId/top-tracks', (req, res) => {
  retryForUnauthorized(() =>
    spotifyApi.getArtistTopTracks(req.params.artistId, req.query.country)
  ).then(topTracks => {
    res.send(topTracks.body);
  });;
});

app.get('/spotify/search', (req, res) => {
  retryForUnauthorized(() =>
    spotifyApi.search(req.query.q, [req.query.type], {
      "limit": req.query.limit
    })
  ).then(searchResult => {
    res.send(searchResult.body);
  });
});

app.use(express.static('public'))
app.listen(process.env.PORT || 3000)