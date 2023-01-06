require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
const { handleError } = require('./utils/errorHandler');
const aiimage = require('./commands/aiimage');
const aiimagevariation = require('./commands/aiimagevariation');
const chatai = require('./commands/chatai');
const aiimageedit = require('./commands/aiimageedit');
const randomimage = require('./commands/randomimage');
const codeai = require('./commands/codeai');
const express = require('express');
var engines = require('consolidate');
const cors = require('cors');
const bodyParser = require('body-parser');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

client.commands = new Collection();

client.login(process.env.DISCORD_TOKEN);

client.on('ready', () => {
  console.log("Beep boop, I'm online!");

  // Listening to xxx users
  client.user.setActivity(
    `${client.guilds.cache
      .map((guild) => {
        return guild.memberCount;
      })
      .reduce((acc, cv) => acc + cv)} users`,
    { type: 'LISTENING' }
  );

  if (process.env.NODE_ENV === 'production') {
    client.channels.cache
      .get('1059855592795144192')
      .send("Beep boop, I'm online!");
  }
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/message', async (req, res) => {
  client.channels.cache.get(req.body.channel).send(req.body.message);

  return res.status(200).json({
    statusText: 'success',
  });
});

app.listen(8000, () => {
  console.log(`Server is running on port ${8000}.`);
});
