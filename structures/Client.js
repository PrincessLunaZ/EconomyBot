const { Client, Collection } = require("discord.js");
class EconomyClient extends Client {
  constructor() {
    super();
    this.discord = require("discord.js");
    this.fs = require("fs");
    this.path = require("path");
    this.ms = require("ms");
    this.mongoose = require("mongoose");
    this.commands = new Collection();
    this.timeouts = new Collection();
    this.config = {
      prefix: "e!",
    };
    this.schema = this.mongoose.model(
      "economy",
      new this.mongoose.Schema({
        User: String,
        Coins: Number,
      })
    );
    const self = this;
    this.economy = {
      async getBal(User) {
        return await self.schema
          .findOne({ User })
          .then((d) => (d ? d.Coins : 0));
      },
      async addBal(User, Coins) {
        return await self.schema.findOne({ User }, async (err, data) => {
          if (err) throw err;
          if (data) {
            data.Coins += Coins;
          } else {
            data = new self.schema({ User, Coins });
          }
          data.save();
        });
      },
    };
  }
  commandHandler(path) {
    this.fs.readdirSync(this.path.normalize(path)).map((f) => {
      const File = require(this.path.join(__dirname, "..", path, f));
      this.commands.set(File.name, File);
    });
  }
  getCommand(cmd) {
    return this.commands.has(cmd) ? this.commands.get(cmd) : false;
  }
  start(token, path) {
    this.commandHandler(path);
    this.login(token);
    this.mongoose.connect(
      "mongodb+srv://EconomyBotTest:panda500@cluster0.il24c.mongodb.net/test?authSource=admin&replicaSet=atlas-pdjjdc-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    this.mongoose.connection.on("connected", () => console.log("DB CONNECTED"));
    this.on("ready", () => console.log(`${this.user.tag} is now online!`));
    this.on("message", async (message) => {
      if (
        message.author.bot ||
        !message.guild ||
        !message.content.toLowerCase().startsWith(this.config.prefix)
      )
        return;
      const args = message.content
        .slice(this.config.prefix.length)
        .trim()
        .split(/ +/g);
      const cmd = args.shift().toLowerCase();
      const command = this.getCommand(cmd);
      if (!command) return;
      if (command.timeout) {
        if (this.timeouts.has(`${command.name}${message.author.id}`))
          return message.channel.send(
            this.embed(
              {
                description: `Please wait ${this.ms(
                  this.timeouts.get(`${command.name}${message.author.id}`) -
                    Date.now(),
                  { long: true }
                )}`,
              },
              message
            )
          );
        command.run(this, message, args).catch(console.error);
        this.timeouts.set(
          `${command.name}${message.author.id}`,
          Date.now() + command.timeout
        );
        setTimeout(() => {
          this.timeouts.delete(`${command.name}${message.author.id}`);
        }, command.timeout);
      } else return command.run(this, message, args).catch(console.error);
    });
  }
  embed(data, message) {
    return new this.discord.MessageEmbed({
      ...data,
      color: "RANDOM",
    }).setFooter(
      message.author.tag,
      message.author.displayAvatarURL({ dynamic: true, format: "png" })
    );
  }
}
module.exports = EconomyClient;
