const Discord = require('discord.js')
const config = require('./config.js')
const client = new Discord.Client()

// Youtube //
var YouTube = require('youtube-node')
var youTube = new YouTube()
youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU')
var rech = ''
var rechType = 'all'
var nbResultat = 0

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
/*
const Twitter = require('twitter')
const clientTwitter = new Twitter({
  consumer_key: 'MrlErdRtTFsTISbCTVsrTfe4c',
  consumer_secret: 'vTPusVlQVCrkT7Mp0W0EdYDNSayanR9XdZMdMaJENApsVQO0VJ',
  access_token_key: '2584464448-eakfNNGHKwnt2NWDoH4NHlSJsbCfDb8cpsoIyXe',
  access_token_secret: 'v8Y6fWpxwdJn3xYiyjdO2LeZeEXjIAj2XYGc7HVStWbBe'
})
*/
/*
const params = {screen_name: 'nodejs'}
clientTwitter.get('statuses/user_timeline', params, function (error, tweets, response) {
  if (!error) {
    console.log(tweets)
  }
})
*/

// Openweather //
var restClient = require('node-rest-client-promise').Client()
var city = ''
var temperature
var idMeteo
var hour
var heureDetectee
var Jour
var Mois
var Iso
var Time
var Weekday = new Array(7)
Weekday[0] = 'Dimanche'
Weekday[1] = 'Lundi'
Weekday[2] = 'Mardi'
Weekday[3] = 'Mercredi'
Weekday[4] = 'Jeudi'
Weekday[5] = 'Vendredi'
Weekday[6] = 'Samedi'

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`)
})

client.on('message', msg => {
// Message //
  if (msg.content === 'hello') {
    msg.channel.send('Yeepeeee ! Enfin quelqu\'un qui s\'intéresse à moi ! ' + 'Je connais les commandes weather + ville || forecast + numéro + ville || help, qui t\'aidera à utiliser forecast --- N\'oublie pas le ! avant')
  } else if (msg.content === 'how are you?') {
    msg.channel.send('It\'s all so complicated with the flowers and the romance, and the lies upon lies!')
  } else if (msg.content === 'where are you?') {
    msg.channel.send('You’ll never guess where I’ve been!')
  }
// Bot Openweather //
  function meteo (idWeather) {
    if (idMeteo >= 200 && idMeteo < 300) {
      msg.channel.send('Courage ! Fuyons ! C\'est emballé :thunder_cloud_rain: ')
    } else if (idMeteo >= 300 && idMeteo < 500) {
      msg.channel.send('On peut en profiter pour prendre notre douche du mois :cloud_rain:')
    } else if (idMeteo >= 500 && idMeteo <= 501) {
      msg.channel.send('Bon, certes, il pleut, mais de l\'eau ! C\'est mieux que la pluie de météores de l\'autre fois :cloud_rain:')
    } else if (idMeteo >= 502 && idMeteo < 600) {
      msg.channel.send('Woop Woop Woop Woop :cloud_rain:')
    } else if (idMeteo >= 600 && idMeteo < 700) {
      msg.channel.send('Il neige, je crois que c\'est le plus beau jour de ma vie, je cherchais quelque chose de beau et pas cher pour une femme qui est un peu comme ça :cloud_snow:')
    } else if (idMeteo === 800) {
      msg.channel.send('Cette météo me rend tout chose, j\'en ai d\'ailleurs profité pour fertiliser votre caviar :sunny:')
    } else if (idMeteo > 800 && idMeteo < 900) {
      msg.channel.send('Les petits pois, pour que ça pousse, faut les arroser ! :cloud:')
    }
  }
  if (msg.content.match('meteo*') !== null) {
    city = msg.content.substring(6, msg.content.length)
    msg.channel.send(city + ' ')
    restClient.getPromise('http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&lang=fr&APPID=602b7069e6bd9de7d27ad28bfca04cc3')
    .catch((error) => {
      throw error
    })
    .then((res) => {
      temperature = res.data.main.temp
      if (temperature <= 15) {
        msg.channel.send('Pense à ton petit pull ! la temperature est de ' + temperature + ' degrés !')
      } else {
        msg.channel.send('Tu peux enlever ta coquille, la température est de ' + temperature + ' degrés !')
      }
      msg.channel.send('La pression est de ' + res.data.main.pressure + ' hpa. Cette pression, elle n\'est pas potable !')
      msg.channel.send('L\'humidité est de ' + res.data.main.humidity + '%. C\'est l\'idéal pour sortir les marmots et aller à la plage!')
      msg.channel.send('Le vent va à ' + res.data.wind.speed + ' km/h. On approche du mur du son!')
      msg.channel.send('En bref... ' + res.data.weather[0].description)
      idMeteo = res.data.weather[0].id
      meteo(idMeteo)
      console.log(res.response.statusCode)
    })
  } else if (msg.content.match('!help') !== null) {
    msg.channel.send('Ne sois pas triste, tu as toujours ton docteur Zoidberg.')
    restClient.getPromise('http://api.openweathermap.org/data/2.5/forecast?q=Paris&units=metric&lang=fr&APPID=602b7069e6bd9de7d27ad28bfca04cc3')
    .catch((error) => {
      throw error
    })
    .then((res) => {
      for (var k = 0; k <= 7; k++) {
        heureDetectee = parseFloat(res.data.list[k].dt_txt.substring(11, 13))
        msg.channel.send('Pour ' + heureDetectee + 'h, tapez ' + k + ' entre Forecast et le nom de la ville')
      }
    })
  } else if (msg.content.match('!forecast*') !== null) {
    city = msg.content.substring(12, msg.content.length)
    hour = msg.content.substring(10, 11)
    if (hour.match(/[0-7]/) === null) {
      msg.channel.send('Entre forecast et le nom de la ville il faut un numéro pour indiquer l\'horaire. En échange d\'un foie je peux t\'aider ... consommation personnelle exclusivement. Tape !help')
    } else {
      hour = parseFloat(hour)
      restClient.getPromise('http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=metric&lang=fr&APPID=602b7069e6bd9de7d27ad28bfca04cc3')
      .catch((error) => {
        throw error
      })
      .then((res) => {
        if (res.data.cod === '404') {
          msg.channel.send('Cette ville n\'est pas une ville tertienne ! Croyez-moi, je suis docteur.')
        } else {
          msg.channel.send('Laisse-moi voir ce que je prévois pour ' + city)
            // msg.channel.send(Date.now())
            // msg.channel.send(res.data.list[0].dt)
            // msg.channel.send(res.data.list[0].dt_txt)
            // msg.channel.send(res.data.list[0].dt_txt.substring(11, 13))
          client.login(config.token)
          // msg.channel.send(hour + ' ' + res.data.list.length)
          for (var heure = hour; heure <= res.data.list.length; heure = heure + '😎') {
            Iso = new Date(res.data.list[heure].dt_txt)
            Jour = Iso.getDate()
            Mois = Iso.getMonth()
            Time = Iso.getHours()
            msg.channel.send('Le ' + Weekday[Iso.getDay()] + ' ' + Jour + '/' + Mois + ' à ' + Time + 'h' + ' il fait ' + res.data.list[heure].main.temp + ' degrés ! ')
            idMeteo = res.data.list[heure].weather[0].id
            meteo(idMeteo)
          }
        }
      })
    }
  }
// Bot Youtube//
  if (msg.content.match('!youtube*') || msg.content.match('!video_youtube*') || msg.content.match('!chaine_youtube*') || msg.content.match('!playlist_youtube*')) {
    var rechParam = msg.content.length
    if (msg.content.match('!video_youtube*')) {
      rechParam = 14
      rechType = 'video'
    } else if (msg.content.match('!chaine_youtube*')) {
      rechParam = 15
      rechType = 'chaine'
    } else if (msg.content.match('!playlist_youtube*')) {
      rechParam = 16
      rechType = 'playlist'
    } else if (msg.content.match('!youtube*')) {
      rechParam = 8
      rechType = 'all'
    } else {
      rechParam = msg.content.length
    }
    rech = msg.content.substring(rechParam, msg.content.length)
    youTube.search(rech, 3, function (error, result) {
      if (error) {
        console.log(error)
        msg.channel.send('Une erreur est survenue lors de la recherche')
      } else {
        // console.log(JSON.stringify(result, null, 3))
        for (var k in result.items) {
          var type = result.items[k].id.kind
          switch (type) {
            case 'youtube#video':
              var urlVideo = 'https://www.youtube.com/watch?v='
              var idVideo = result.items[k].id.videoId
              // Le bot envoie le lien de la vidéo
              if ((rechType === 'all') || (rechType === 'video')) {
                msg.channel.send('Tu as de la chance !! On a trouvé une bonne vidéo pour toi, le lien est ci-dessous :')
                msg.channel.send(urlVideo.concat(idVideo))
                nbResultat = nbResultat + 1
              }
              break
            case 'youtube#playlist':
              var urlplaylist = 'https://www.youtube.com/playlist?list='
              var idplaylist = result.items[k].id.playlistId
              // Le bot envoie le lien de la playlist
              if ((rechType === 'all') || (rechType === 'playlist')) {
                msg.channel.send('Une playlist a été retrouvée !! Cliques sur le lien qui est juste en dessous')
                msg.channel.send(urlplaylist.concat(idplaylist))
                nbResultat = nbResultat + 1
              }
              break
            case 'youtube#channel':
              var urlChannel = 'https://www.youtube.com/channel/'
              var idChannel = result.items[k].id.channelId
              // Le bot envoie le lien de la chaine
              if ((rechType === 'all') || (rechType === 'chaine')) {
                msg.channel.send('Biiingo !! Une chaine de l\'un de mes youtubers préférés !! Cliques vite !! ')
                msg.channel.send(urlChannel.concat(idChannel))
                nbResultat = nbResultat + 1
              }
              break
          }
        }
      }
      if (nbResultat === 0) {
        msg.channel.send('Aucun résulat trouvé')
      }
    })
  }
  // Bot Google_traduction //
  if (msg.content.match('!trad *')) {
    if (msg.content.match('!trad help*')) {
      msg.channel.send('Taper !trad lg:Votre_langue Votre_texte pour traduire votre texte dans une langue spécifique')
      msg.channel.send('Taper !trad Votre_texte pour traduire votre texte en anglais')
    } else if (msg.content.match('!trad lg:[A-Za-z][A-Za-z] *') && !msg.content.match('Taper !trad Votre_texte pour traduire votre texte en anglais') && !msg.content.match('Taper !trad lg:Votre_langue Votre_texte pour traduire votre texte dans une langue spécifique')) {
      elem = msg.content.substring(11, msg.content.length)
      var language = msg.content.substring(9, 11, msg.content.length)
      translate.translate(elem, language, function (err, translation) {
        if (!err) {
          msg.channel.send(translation)
        }
      })
    } else if (msg.content.match('!trad*') && !msg.content.match('Taper !trad Votre_texte pour traduire votre texte en anglais') && !msg.content.match('Taper !trad lg:Votre_langue Votre_texte pour traduire votre texte dans une langue spécifique')) {
      elem = msg.content.substring(msg.content.lastIndexOf('!trad ') + '!trad '.length, msg.content.length)
      translate.translate(elem, 'en', function (err, translation) {
        if (!err) {
          msg.channel.send(translation)
        }
      })
    }
  }
  // Bot Spotify //
  if (msg.content.match('!spotify*') !== -1) {
    spotifyApi.clientCredentialsGrant()
      .then(function (data) {
        /*
        console.log('The access token expires in ' + data.body['expires_in'])
        console.log('The access token is ' + data.body['access_token'])
        */
        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token'])
        if (msg.content.match('!spotify help')) {
          msg.channel.send('Taper !spotify track et votre choix pour afficher le top 3 des chansons associées à votre choix')
          msg.channel.send('Taper !spotify artiste et votre choix pour afficher le top 3 des artistes associés à votre choix')
          msg.channel.send('Taper !spotify album et votre choix pour afficher le top 3 des albums associés à votre choix')
          msg.channel.send('Taper !spotify et votre choix pour afficher le top 3 des chansons, artistes et albums associées à votre choix')
        } else if (msg.content.match('!spotify track *') && !msg.content.match('Taper !spotify*')) {
          track = msg.content.substring(msg.content.lastIndexOf('!spotify track ') + '!spotify track '.length, msg.content.length)
          spotifyApi.searchTracks(track)
          .then(function (data) {
            msg.channel.send('Top 3 des chansons pour votre recherche : ' + track)
            for (var i = 0; i < 3; i++) {
              msg.channel.send('"' + data.body.tracks.items[i].name + '" de ' + data.body.tracks.items[i].artists[0].name)
            }
          }, function (err) {
            console.error(err)
          })
        } else if (msg.content.match('!spotify artiste *') && !msg.content.match('Taper !spotify*')) {
          track = msg.content.substring(msg.content.lastIndexOf('!spotify artiste ') + '!spotify artiste '.length, msg.content.length)
          spotifyApi.searchArtists(track)
          .then(function (data) {
            msg.channel.send('Top 3 des artistes pour votre recherche : ' + track)
            for (var i = 0; i < 3; i++) {
              if (data.body.artists.items[i].genres[0] !== undefined) {
                msg.channel.send('"' + data.body.artists.items[i].name + '" Genre : ' + data.body.artists.items[i].genres[0])
              } else {
                msg.channel.send(data.body.artists.items[i].name)
              }
            }
          }, function (err) {
            console.error(err)
          })
        } else if (msg.content.match('!spotify album *') && !msg.content.match('Taper !spotify*')) {
          track = msg.content.substring(msg.content.lastIndexOf('!spotify album ') + '!spotify album '.length, msg.content.length)
          spotifyApi.searchTracks('album:' + track)
            .then(function (data) {
              msg.channel.send('Top 3 des albums pour votre recherche : ' + track)
              for (var i = 0; i < 3; i++) {
                msg.channel.send('"' + data.body.tracks.items[0].album.name + '" de ' + data.body.tracks.items[i].album.artists[0].name)
              }
            }, function (err) {
              console.error(err)
            })
        } else if (msg.content.match('!spotify *') && !msg.content.match('Taper !spotify*')) {
          track = msg.content.substring(msg.content.lastIndexOf('!spotify ') + '!spotify '.length, msg.content.length)
          spotifyApi.searchTracks('album:' + track)
          .then(function (data) {
            msg.channel.send('Top 3 des albums pour votre recherche : ' + track)
            for (var i = 0; i < 3; i++) {
              msg.channel.send('"' + data.body.tracks.items[i].album.name + '" de ' + data.body.tracks.items[i].artists[0].name)
            }
          }, function (err) {
            console.error(err)
          })
          spotifyApi.searchTracks('track:' + track)
          .then(function (data) {
            msg.channel.send('Top 3 des chansons pour votre recherche : ' + track)
            for (var i = 0; i < 3; i++) {
              msg.channel.send('"' + data.body.tracks.items[i].name + '" de ' + data.body.tracks.items[i].artists[0].name)
            }
          }, function (err) {
            console.error(err)
          })
          spotifyApi.searchArtists(track)
          .then(function (data) {
            msg.channel.send('Top 3 des artists pour votre recherche : ' + track)
            for (var i = 0; i < 3; i++) {
              msg.channel.send('"' + data.body.artists.items[i].name + '"')
            }
          }, function (err) {
            console.error(err)
          })
        }
      }, function (err) {
        console.log('Something went wrong when retrieving an access token', err.message)
      })
  }
  /*
  const params = {screen_name: 'nodejs'}
  clientTwitter.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
      console.log(tweets)
    }
    if (msg.content === 'twitter') {
      clientTwitter.post('statuses/update', {status: 'I Love Twitter'}, function (error, tweet, response) {
        if (error) throw error
        console.log(tweet)
        console.log(response)
      })
    }
  })
  */
}
)
client.login(config.token)
