const Discord = require('discord.js')
const config = require('./config.js')
const client = new Discord.Client()
const restClient = require('node-rest-client-promise').Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`)
})

client.on('message', msg => {
  // Check if the message has been posted in a channel where the bot operates
  // and that the author is not the bot itself
  if (msg.channel.type !== 'dm' && (config.channel !== msg.channel.id || msg.author.id === client.user.id)) return

  // If message is hello, post hello too
  if (msg.substring(0, 4) === 'meteo') {
    restClient.getPromise('http://api.openweathermap.org/data/2.5/weather?q=London&APPID=b05787eda8d8f7967925692ea52134d2')
    // Il faudra récupérer un ID pour l'API, sur le site d'openweathermap
      .catch((error) => {
        throw error
      })
      .then((res) => {
        console.log(res)
        msg.channel.sendMessage(res.data.main.temp)
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
