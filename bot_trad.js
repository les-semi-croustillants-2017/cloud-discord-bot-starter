const Discord = require('discord.js')
const config = require('./config.js')
const client = new Discord.Client()

var API_KEY = 'AIzaSyCvwWHyl3-w3fVPCgOrWbfqWFTi7fxJ_yg'

var translate = require('@google-cloud/translate')({
  key: API_KEY
})

// https://www.npmjs.com/package/@google-cloud/translate

var elem

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`)
})

client.on('message', msg => {
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
}
)

client.login(config.token)
