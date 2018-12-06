module.exports = async (client, message) => {

  if(client.config.allowMentionPrefix) message.content = message.content.replace(new RegExp(`^<@!?${client.user.id}> `), client.config.prefix)

  if (message.author.bot) return

  const filter = client.commands.get('filter-links')
  if(filter) await filter.run(client, message)

  if (!message.content.startsWith(client.config.prefix)) return
  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()

  const cmd = client.commands.get(command) || client.commands.find(c => c.config.aliases.includes(command))
  if (!cmd) return

  if(cmd.config.guildOnly && !message.guild) return
  if(cmd.config.ownerOnly && !client.config.owners.includes(message.author.id)) return

  try {
    await cmd.run(client, message, args)
  } catch (error) {
    console.error(error)
    message.channel.send(':x: Something went wrong while executing the command').catch(console.error)
  }
}
