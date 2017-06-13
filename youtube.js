const Discord = require('discord.js')
const config = require('./config.js')
const client = new Discord.Client()
var YouTube = require('youtube-node')
var youTube = new YouTube()
youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU')
var rech = ''
var rechType = 'all'
var nbResultat = 0

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`)
})

client.on('message', msg => {
  // Check if the message has been posted in a channel where the bot operates
  // and that the author is not the bot itself
  if (msg.channel.type !== 'dm' && (config.channel !== msg.channel.id || msg.author.id === client.user.id)) return

  if (msg.content.match('^!youtube*') || msg.content.match('^!video_youtube*') || msg.content.match('^!chaine_youtube*') || msg.content.match('^!playist_youtube*')) {
    var rechParam = msg.content.length
    if (msg.content.match('^!video_youtube*')) {
      rechParam = 14
      rechType = 'video'
    } else if (msg.content.match('^!chaine_youtube*')) {
      rechParam = 15
      rechType = 'chaine'
    } else if (msg.content.match('^!playist_youtube*')) {
      rechParam = 16
      rechType = 'playist'
    } else if (msg.content.match('^!youtube*')) {
      rechParam = 8
      rechType = 'all'
    } else {
      rechParam = msg.content.length
    }
    rech = msg.content.substring(rechParam, msg.content.length)
    if (rech === ' help') {
      msg.channel.sendMessage('Commande autorisé : !youtube, !video_youtube, !chaine_youtube, !playist_youtube : ')
      msg.channel.sendMessage('=> !youtube : effectuer une recherche youtube avec 3 résultats renvoyés au maximum')
      msg.channel.sendMessage('=> !video_youtube renvoie uniquement les vidéos ')
      msg.channel.sendMessage('=> !chaine_youtube renvoie uniquement les chaines ')
      msg.channel.sendMessage('=> !playist_youtube renvoie uniquement les playists, astuce : tapes playist dans le contenu de ta recherche pour facilier la recherche ')
    } else if (rech !== ' help') {
      youTube.search(rech, 3, function (error, result) {
        if (error) {
          console.log(error)
          msg.channel.sendMessage('Une erreur est survenue lors de la recherche')
        } else {
          console.log(JSON.stringify(result, null, 3))
          for (var k in result.items) {
            var type = result.items[k].id.kind
            switch (type) {
              case 'youtube#video':
                var urlVideo = 'https://www.youtube.com/watch?v='
                var idVideo = result.items[k].id.videoId
                // Le bot envoie le lien de la vidéo
                if ((rechType === 'all') || (rechType === 'video')) {
                  msg.channel.sendMessage('Tu as de la chance !! On a trouvé une bonne vidéo pour toi, le lien est ci-dessous :')
                  msg.channel.sendMessage(urlVideo.concat(idVideo))
                  nbResultat = nbResultat + 1
                }
                break
              case 'youtube#playlist':
                var urlPlayist = 'https://www.youtube.com/playlist?list='
                var idPlayist = result.items[k].id.playlistId
                // Le bot envoie le lien de la playist
                if ((rechType === 'all') || (rechType === 'playist')) {
                  msg.channel.sendMessage('Une playist a été retrouvée !! Cliques sur le lien qui est juste en dessous')
                  msg.channel.sendMessage(urlPlayist.concat(idPlayist))
                  nbResultat = nbResultat + 1
                }
                break
              case 'youtube#channel':
                var urlChannel = 'https://www.youtube.com/channel/'
                var idChannel = result.items[k].id.channelId
                // Le bot envoie le lien de la chaine
                if ((rechType === 'all') || (rechType === 'chaine')) {
                  msg.channel.sendMessage('Biiingo !! Une chaine de l\'un de mes youtubers préférés !! Cliques vite !! ')
                  msg.channel.sendMessage(urlChannel.concat(idChannel))
                  nbResultat = nbResultat + 1
                }
                break
            }
          }
        }
        msg.channel.sendMessage('Nombre de résultat trouvé : ' + nbResultat)
        nbResultat = 0
      })
    }
  }
})

client.login(config.token)
