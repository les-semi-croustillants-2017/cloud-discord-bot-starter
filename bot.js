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

  // If message is hello, post hello too
  if (msg.content === 'hello') {
    msg.channel.sendMessage('Hello darkness my old friend...')
  }
  if (msg.content === 'bonjour') {
    msg.channel.sendMessage('Moi pas parler baguette, sorry')
  }
  if (msg.content === 'hola') {
    msg.channel.sendMessage('Hola tapas, nachos,tacos!!!')
  }
})

client.login(config.token)
