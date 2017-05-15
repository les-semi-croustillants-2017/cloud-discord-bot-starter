const Discord = require('discord.js')
const config = require('./config.js')
const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`)
})

client.on('message', msg => {
  // Check if the message has been posted in a channel where the bot operates
  // and that the author is not the bot itself
  if (msg.channel.type !== 'dm' && (config.channel !== msg.channel.id || msg.author.id === client.user.id)) return
  if (msg.content.substring(msg.content.lastIndexOf('!trad')) === '!trad') {
    msg.channel.sendMessage('Pour traduire taper !trad votre_texte key_de_la_langue')
  }

  if (msg.content.lastIndexOf('!trad') !== -1) {
    var target
    var q
    // var key = 'AIzaSyDAT89ZOp4FiQocVj8AUho0zwSFkWzLjmM'
    target = 'en'
    q = msg.content.substring(msg.content.lastIndexOf('!trad') + '!trad'.length, msg.content.length)
    msg.channel.sendMessage('Traduire ' + q + ' en ' + target)
    // GET https://www.googleapis.com/language/translate/v2?key=INSERT-YOUR-KEY&source=fr&target=en&q=Hello%20world
  }

  // msg.channel.sendMessage(msg.content.lastIndexOf('!trad'))
})

client.login(config.token)
