const { Client } = require("discord.js")
class EconomyClient extends Client {
    constructor() {
        super();
        this.discord = require("discord.js");
        this.fs = require('fs');
        this.path = require('path');
        this.ms = require('ms')
        this.mongoose = require('mongoose')
        this.commands = new Collection;
        this.timeouts = new Collection;
        this.config = {
            prefix: 'e!',
        }
    }
    commandHandler(path) {
        this.fs.readdirSync(this.path.normalize(path)).map((f) => {
            const File = require(this.path.join(__dirname, "..", path, f))
            this.commands.set(File.name, File)
            })
        }
        start(token, path) {
            this.commandHandler(path);
            this.login(token);
            this.mongoose.connect("mongodb+srv://EconomyBot:panda500@cluster0.il24c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
                useNewUrlParser: true,
                useUnifiedTopology: true
                });
                this.mongoose.connection.on('connected', () => console.log("DB CONNECTED"))
            }
}
module.exports = EconomyClient