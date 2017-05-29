const Discord = require('discord.js')
const config = require('./config.js')
const client = new Discord.Client()

const Twitter = require('twitter')

const clientTwitter = new Twitter({
  consumer_key: 'MrlErdRtTFsTISbCTVsrTfe4c',
  consumer_secret: 'vTPusVlQVCrkT7Mp0W0EdYDNSayanR9XdZMdMaJENApsVQO0VJ',
  access_token_key: '2584464448-eakfNNGHKwnt2NWDoH4NHlSJsbCfDb8cpsoIyXe',
  access_token_secret: 'v8Y6fWpxwdJn3xYiyjdO2LeZeEXjIAj2XYGc7HVStWbBe'
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`)
  clientTwitter.get('search/tweets', {q: 'JuniorISEP'}, function webhook (error, tweets, response) {
    if (error) throw error
    var webhook = tweets.statuses[0].text
    console.log(webhook)
  })
})

client.on('message', msg => {
  // Check if the message has been posted in a channel where the bot operates
  // and that the author is not the bot itself
  if (msg.channel.type !== 'dm' && (config.channel !== msg.channel.id || msg.author.id === client.user.id)) return

  // If message is hello, post hello too
  if (msg.content === 'hello') {
    msg.channel.sendMessage('Hello to you too, fellow !')
  }

  if (msg.content.match('!tweet*') !== null) {
    const tweety = msg.content.substring(8, msg.content.length)
    if (tweety.length <= 140) {
      clientTwitter.post('statuses/update', {status: tweety}, function (error, tweet, response) {
        if (error) throw error
        console.log(tweet)
        console.log(response)
        msg.channel.sendMessage('Ton tweet a bien été posté !')
      })
    } else {
      msg.channel.sendMessage('Ton tweet contient plus de 140 caractères !')
    }
  }

  /*
  if (msg.content === 'tests') {
    clientTwitter.get('search/tweets', {q: 'JuniorISEP'}, function (error, tweets, response) {
      if (error) throw error
      console.log(tweets.statuses[0].text)
      msg.channel.sendMessage(tweets.statuses[0].text)
    })
  }
  */
})

client.login(config.token)
