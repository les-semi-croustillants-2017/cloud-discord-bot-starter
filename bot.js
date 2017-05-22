  const Discord = require('discord.js')
  const config = require('./config.js')
  const client = new Discord.Client()
  var restClient = require('node-rest-client-promise').Client()
  var city = ''
  var temperature
  var idMeteo

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}!`)
  })

  client.on('message', msg => {
  // Check if the message has been posted in a channel where the bot operates
  // and that the author is not the bot itself
    if (msg.channel.type !== 'dm' && (config.channel !== msg.channel.id || msg.author.id === client.user.id)) return

  // If message is hello, post hello too
    if (msg.content.match('meteo*') !== null) {
      city = msg.content.substring(6, msg.content.length)
      msg.channel.sendMessage(city + ' ')
      restClient.getPromise('http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&lang=fr&APPID=602b7069e6bd9de7d27ad28bfca04cc3')
      .catch((error) => {
        throw error
      })
      .then((res) => {
        console.log(res)
        temperature = res.data.main.temp
        if (temperature <= 15) {
          msg.channel.sendMessage('Pense à ton petit pull ! la temperature est de ' + temperature + ' degrés !')
        } else {
          msg.channel.sendMessage('Tu peux enlever ta coquille, la température est de ' + temperature + ' degrés !')
        }
        msg.channel.sendMessage('La pression est de ' + res.data.main.pressure + ' hpa. Cette pression, elle n\'est pas potable !')
        msg.channel.sendMessage('L\'humidité est de ' + res.data.main.humidity + '%. C\'est l\'idéal pour sortir les marmots et aller à la plage!')
        msg.channel.sendMessage('Le vent va à ' + res.data.wind.speed + ' km/h. On approche du mur du son!')
        msg.channel.sendMessage('En bref... ' + res.data.weather[0].description)
        idMeteo = res.data.weather[0].id
        if (idMeteo >= 200 && idMeteo < 300) {
          msg.channel.sendMessage('Courage ! Fuyons ! C\'est emballé :thunder_cloud_rain: ')
        } else if (idMeteo >= 300 && idMeteo < 500) {
          msg.channel.sendMessage('On peut en profiter pour prendre notre douche du mois :cloud_rain:')
        } else if (idMeteo >= 500 && idMeteo <= 501) {
          msg.channel.sendMessage('Bon, certes, il pleut, mais de l\'eau ! C\'est mieux que la pluie de météores de l\'autre fois :cloud_rain:')
        } else if (idMeteo >= 502 && idMeteo < 600) {
          msg.channel.sendMessage('Woop Woop Woop Woop :cloud_rain:')
        } else if (idMeteo >= 600 && idMeteo < 700) {
          msg.channel.sendMessage('Il neige, je crois que c\'est le plus beau jour de ma vie, je cherchais quelque chose de beau et pas cher pour une femme qui est un peu comme ça :cloud_snow:')
        } else if (idMeteo === 800) {
          msg.channel.sendMessage('Cette météo me rend tout chose, j\'en ai d\'ailleurs profité pour fertiliser votre caviar :sunny:')
        } else if (idMeteo > 800 && idMeteo < 900) {
          msg.channel.sendMessage('Les petits pois, pour que ça pousse, faut les arroser ! :cloud:')
        }
        console.log(res.response.statusCode)
      })
    } else if (msg.content.match('!forecast*') !== null) {
      city = msg.content.substring(10, msg.content.length)
      msg.channel.sendMessage(city)
      restClient.getPromise('')
      .catch((error) => {
        throw error
      })
      .then((res) => {
        console.log(res)
      })
    } else if (msg.content === 'help') {
      msg.channel.sendMessage('Don\'t be sad, you still have a zoidberg')
    } else if (msg.content === 'how are you?') {
      msg.channel.sendMessage('It\'s all so complicated with the flowers and the romance, and the lies upon lies!')
    } else if (msg.content === 'where are you?') {
      msg.channel.sendMessage('You’ll never guess where I’ve been!')
    }
  })
  client.login(config.token)
