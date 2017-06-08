const Discord = require('discord.js')
const config = require('./config.js')
const client = new Discord.Client()

// https://github.com/thelinmichael/spotify-web-api-node
// Spotify //
var SpotifyWebApi = require('spotify-web-api-node')
var clientid = '132f44ff456c41d29d544a608b448bbd'
var clientSecret = '25d2c3ee445140bfa9aaa3d6bcdc194b'
var spotifyApi = new SpotifyWebApi({
  clientId: clientid,
  clientSecret: clientSecret
})
var track

// Google traduction //
var API_KEY = 'AIzaSyCvwWHyl3-w3fVPCgOrWbfqWFTi7fxJ_yg'
var translate = require('@google-cloud/translate')({
  key: API_KEY
})
var elem
// Twitter //
const Twitter = require('twitter')

const clientTwitter = new Twitter({
  consumer_key: 'MrlErdRtTFsTISbCTVsrTfe4c',
  consumer_secret: 'vTPusVlQVCrkT7Mp0W0EdYDNSayanR9XdZMdMaJENApsVQO0VJ',
  access_token_key: '2584464448-eakfNNGHKwnt2NWDoH4NHlSJsbCfDb8cpsoIyXe',
  access_token_secret: 'v8Y6fWpxwdJn3xYiyjdO2LeZeEXjIAj2XYGc7HVStWbBe'
})

const params = {screen_name: 'nodejs'}
clientTwitter.get('statuses/user_timeline', params, function (error, tweets, response) {
  if (!error) {
    console.log(tweets)
  }
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`)
})

client.on('message', msg => {
  // Bot Google_traduction //
  if (msg.content.match('!trad *')) {
    console.log(msg.content)
    if (msg.content.match('!trad help*')) {
      msg.channel.sendMessage('Taper !trad lg:Votre_langue Votre_texte pour traduire votre texte dans une langue spécifique')
      msg.channel.sendMessage('Taper !trad Votre_texte pour traduire votre texte en anglais')
    } else if (msg.content.match('!trad lg:[A-Za-z][A-Za-z] *') && !msg.content.match('Taper !trad Votre_texte pour traduire votre texte en anglais') && !msg.content.match('Taper !trad lg:Votre_langue Votre_texte pour traduire votre texte dans une langue spécifique')) {
      elem = msg.content.substring(11, msg.content.length)
      console.log(msg.content)
      console.log('ici')
      var language = msg.content.substring(9, 11, msg.content.length)
      translate.translate(elem, language, function (err, translation) {
        if (!err) {
          msg.channel.sendMessage(translation)
        }
      })
    } else if (msg.content.match('!trad*') && !msg.content.match('Taper !trad Votre_texte pour traduire votre texte en anglais') && !msg.content.match('Taper !trad lg:Votre_langue Votre_texte pour traduire votre texte dans une langue spécifique')) {
      console.log(msg.content)
      console.log('la')
      elem = msg.content.substring(msg.content.lastIndexOf('!trad ') + '!trad '.length, msg.content.length)
      translate.translate(elem, 'en', function (err, translation) {
        if (!err) {
          msg.channel.sendMessage(translation)
        }
      })
    }
  }
  // Bot Spotify //
  if (msg.content.lastIndexOf('!spotify') !== -1) {
    spotifyApi.clientCredentialsGrant()
      .then(function (data) {
        console.log('The access token expires in ' + data.body['expires_in'])
        console.log('The access token is ' + data.body['access_token'])
        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token'])
        if (msg.content.match('!spotify help*')) {
          msg.channel.sendMessage('Taper !spotify track et votre choix pour afficher le top 3 des chansons associées à votre choix')
          msg.channel.sendMessage('Taper !spotify artiste et votre choix pour afficher le top 3 des artistes associés à votre choix')
          msg.channel.sendMessage('Taper !spotify album et votre choix pour afficher le top 3 des albums associés à votre choix')
          msg.channel.sendMessage('Taper !spotify et votre choix pour afficher le top 3 des chansons, artistes et albums associées à votre choix')
        } else if (msg.content.match('!spotify track *') & !msg.content.match('Taper !spotify track et votre choix pour afficher le top 3*')) {
          track = msg.content.substring(msg.content.lastIndexOf('!spotify track ') + '!spotify track '.length, msg.content.length)
          spotifyApi.searchTracks(track)
            .then(function (data) {
              msg.channel.sendMessage('Top 3 des chansons pour votre recherche : ' + track)
              for (var i = 0; i < 3; i++) {
                msg.channel.sendMessage('"' + data.body.tracks.items[i].name + '" de ' + data.body.tracks.items[i].artists[0].name)
              }
            }, function (err) {
              console.error(err)
            })
        } else if (msg.content.match('!spotify artiste *') & !msg.content.match('Taper !spotify artiste et votre choix pour afficher le top 3*')) {
          track = msg.content.substring(msg.content.lastIndexOf('!spotify artiste ') + '!spotify artiste '.length, msg.content.length)
          spotifyApi.searchArtists(track)
            .then(function (data) {
              msg.channel.sendMessage('Top 3 des artistes pour votre recherche : ' + track)
              for (var i = 0; i < 3; i++) {
                if (data.body.artists.items[i].genres[0] !== undefined) {
                  msg.channel.sendMessage('"' + data.body.artists.items[i].name + '" Genre : ' + data.body.artists.items[i].genres[0])
                } else {
                  msg.channel.sendMessage(data.body.artists.items[i].name)
                }
              }
            }, function (err) {
              console.error(err)
            })
        } else if (msg.content.match('!spotify album *') & !msg.content.match('Taper !spotify album et votre choix pour afficher le top 3*')) {
          track = msg.content.substring(msg.content.lastIndexOf('!spotify album ') + '!spotify album '.length, msg.content.length)
          spotifyApi.searchTracks('album:' + track)
            .then(function (data) {
              msg.channel.sendMessage('Top 3 des albums pour votre recherche : ' + track)
              for (var i = 0; i < 3; i++) {
                msg.channel.sendMessage('"' + data.body.tracks.items[0].album.name + '" de ' + data.body.tracks.items[i].album.artists[0].name)
              }
            }, function (err) {
              console.error(err)
            })
        } else if (msg.content.match('!spotify *') & !msg.content.match('Taper !spotify et votre choix pour afficher le top 3*')) {
          track = msg.content.substring(msg.content.lastIndexOf('!spotify ') + '!spotify '.length, msg.content.length)
          spotifyApi.searchTracks('album:' + track)
            .then(function (data) {
              msg.channel.sendMessage('Top 3 des albums pour votre recherche : ' + track)
              for (var i = 0; i < 3; i++) {
                msg.channel.sendMessage('"' + data.body.tracks.items[i].album.name + '" de ' + data.body.tracks.items[i].artists[0].name)
              }
            }, function (err) {
              console.error(err)
            })
          spotifyApi.searchTracks('track:' + track)
            .then(function (data) {
              msg.channel.sendMessage('Top 3 des chansons pour votre recherche : ' + track)
              for (var i = 0; i < 3; i++) {
                msg.channel.sendMessage('"' + data.body.tracks.items[i].name + '" de ' + data.body.tracks.items[i].artists[0].name)
              }
            }, function (err) {
              console.error(err)
            })
          spotifyApi.searchArtists(track)
            .then(function (data) {
              msg.channel.sendMessage('Top 3 des artists pour votre recherche : ' + track)
              for (var i = 0; i < 3; i++) {
                msg.channel.sendMessage('"' + data.body.artists.items[i].name + '"')
              }
            }, function (err) {
              console.error(err)
            })
        }
      }, function (err) {
        console.log('Something went wrong when retrieving an access token', err.message)
      })
  }
  if (msg.content === 'twitter') {
    clientTwitter.post('statuses/update', {status: 'I Love Twitter'}, function (error, tweet, response) {
      if (error) throw error
      console.log(tweet)
      console.log(response)
    })
  }
}
)
client.login(config.token)
