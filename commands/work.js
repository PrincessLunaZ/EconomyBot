const { Message } = require("discord.js");
const Client = require("../structures/Client");
module.exports = {
  name: "work",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const Jobs = ["Programmer", "YouTuber", "Moderator"];
    const Job = Jobs[Math.floor(Math.random() * (Jobs.length))];
    const Coins = Math.floor(Math.random() * 300);
    message.channel.send(
      client.embed(
        { description: `You worked as a ${Job} and got ${Coins} coins` },
        message
      )
    );
    return await client.economy.addBal(message.author.id, Coins);
  },
  timeout: 30000
};
