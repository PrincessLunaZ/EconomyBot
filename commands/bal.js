const { Message } = require("discord.js");
const Client = require("../structures/Client");
module.exports = {
  name: "bal",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
      await message.channel.send(client.embed({ description: `$${await client.economy.getBal(message.author.id)}` }, message))
  },
  timeout: 5000
}