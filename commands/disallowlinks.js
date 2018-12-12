exports.run = async (client, message, args) => {

  if(!message.member.hasPermission('MANAGE_MESSAGES'))
    return message.channel.send(':no_entry: You do not have permission to manage channels')

  const channel = args[0] ? message.guild.channels.get(client.utils.parseMention(args[0] || '')) : message.channel

  if(!channel || channel.type !== 'text')
    return message.channel.send(':warning: Could not find that channel')

  const sameChannel = channel.id === message.channel.id

  if(!channel.permissionsFor(message.guild.me).has(['MANAGE_CHANNELS', 'VIEW_CHANNEL']))
    return message.channel.send(`:no_entry: I do not have permission to manage ${sameChannel ? 'this' : 'that'} channel`)

  if(!channel.topic.includes('{allowlinks}'))
    return message.channel.send(`:warning: Links in ${sameChannel ? 'this' : 'that'} channel are already disallowed`)

  await channel.edit({
    topic: channel.topic.replace(/{allowlinks}/g, '')
  },
  `Allowing links: action taken by ${message.author.tag}`
  )

  message.channel.send(`:white_check_mark: Links are no longer allowed to be posted in ${sameChannel ? 'this' : 'that'} channel`)

}

exports.help = {
  name: 'disallowlinks',
  info: 'Disallows links to be sent in a channel',
  usage: '[channel]',
  unlisted: false,
}

exports.config = {
  guildOnly: true,
  ownerOnly: false,
  aliases: [],
}
