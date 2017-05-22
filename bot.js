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
  // Check if the message has been posted in a channel where the bot operates
  // and that the author is not the bot itself
  if (msg.channel.type !== 'dm' && (config.channel !== msg.channel.id || msg.author.id === client.user.id)) return

  // If message is hello, post hello too
  if (msg.content === 'hello') {
    msg.channel.sendMessage('Hello to you too, fellow !')
  }

  if (msg.content.match('twitter*') !== null) {
    const city = msg.content.substring(8, msg.content.length)
    clientTwitter.post('statuses/update', {status: city}, function (error, tweet, response) {
      if (error) throw error
      console.log(tweet)
      console.log(response)
    })
  }
})

client.login(config.token)
