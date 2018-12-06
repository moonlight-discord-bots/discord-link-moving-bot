const {moveHook} = require('../config')
const {WebhookClient} = require('discord.js')
const webhook = new WebhookClient(moveHook.id, moveHook.token, {disableEveryone: true})

const pattern = /http(s)?:\/\/[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:\/?#[\]@!\$&'\(\)\*\+,;=.]+/gmi

exports.run = async (client, message) => {

  if(!message.content.match(pattern)) return
  if(!message.guild) return

  if(message.channel.topic && message.channel.topic.includes('{allowlinks}')) return
  if(!message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES')) return

  try {

    webhook.send(message.content, {username: message.author.username, avatarURL: message.author.displayAvatarURL})
    message.delete('Message contains links, but the channel does not allow that')

    message.channel.send(`${message.author}, :information_source: You cannot send links here! You can find the message you sent in <#${webhook.channelID}>`)
    .then(m=>{m.delete(15000)})

  } catch(e) {
    console.error(e)
  }

}

exports.help = {
  name: 'filter-links',
  info: 'Filters links',
  usage: '',
  unlisted: true,
}

exports.config = {
  guildOnly: true,
  ownerOnly: true,
  aliases: [],
}
