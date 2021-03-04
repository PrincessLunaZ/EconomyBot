const { Message } = require("discord.js");
const Client = require("../structures/Client");
module.exports = {
  name: "ping",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const msg = await message.channel.send("**Pinging...**");
    await msg.edit(
      client.embed(
        {
          description: `**PONG!\nMessage Edit: ${
            msg.createdAt - message.createdAt
          }\nWS: ${client.ws.ping}**`,
        },
        message
      )
    );
    await msg.edit("Pong!");
  },
  timeout: 10000,
};
