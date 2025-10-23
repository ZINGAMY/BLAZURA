const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

// Handlers
const eventHandler = require("./handlers/eventHandler");
const commandHandler = require("./handlers/commandHandler");

eventHandler(client);
commandHandler(client);

client.login(process.env.DISCORD_TOKEN);
