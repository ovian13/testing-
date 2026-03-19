import { Client, Events, GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

const token = process.env.DISCORD_BOT_TOKEN;

if (token) {
  client.login(token);
} else {
  console.error('DISCORD_BOT_TOKEN is not defined in environment variables.');
}
