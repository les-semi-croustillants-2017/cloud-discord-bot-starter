  const Discord = require('discord.js')
  const config = require('./config.js')
  const client = new Discord.Client()
  var restClient = require('node-rest-client-promise').Client()
  var city = ''
  var temperature

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
      restClient.getPromise('http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&APPID=602b7069e6bd9de7d27ad28bfca04cc3')
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
        msg.channel.sendMessage('L\'humidité est de ' + res.data.main.humidity + '% C\'est l\'idéal pour sortir les marmots et aller à la plage!')
        msg.channel.sendMessage('Le vent ira à ' + res.data.wind.speed + ' km/h')
        console.log(res.response.statusCode)
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
