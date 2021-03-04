const EconomyClient = require("./structures/Client");
new EconomyClient().start(require("./config").token, "./commands");
