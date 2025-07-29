const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");
// Optional chalk for better logging
let chalk;
try {
  chalk = require('chalk');
} catch (error) {
  // Fallback if chalk is not available
  chalk = {
    green: (text) => `✅ ${text}`,
    red: (text) => `❌ ${text}`,
    yellow: (text) => `⚠️ ${text}`,
    blue: (text) => `ℹ️ ${text}`
  };
}
const commands = require('./commands/index');

const { GatewayIntentBits } = require('discord.js');

const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds, // Access to guilds (servers)
    GatewayIntentBits.GuildMembers, // Access to guild members
    GatewayIntentBits.GuildBans, // Access to user bans
    GatewayIntentBits.GuildEmojisAndStickers, // Access to emojis and stickers
    GatewayIntentBits.GuildIntegrations, // Access to integrations
    GatewayIntentBits.GuildWebhooks, // Access to webhooks
    GatewayIntentBits.GuildInvites, // Access to invitations
    GatewayIntentBits.GuildVoiceStates, // Access to voice channels and user states
    GatewayIntentBits.GuildPresences, // Access to presence statuses (online/offline)
    GatewayIntentBits.GuildMessages, // Access to guild messages
    GatewayIntentBits.GuildMessageReactions, // Access to guild message reactions
    GatewayIntentBits.GuildMessageTyping, // Access to typing indicators
    GatewayIntentBits.DirectMessages, // Access to direct messages (Direct Messages)
    GatewayIntentBits.DirectMessageReactions, // Access to direct message reactions
    GatewayIntentBits.DirectMessageTyping, // Access to typing indicators in direct messages
    GatewayIntentBits.MessageContent, // Access to message content
    GatewayIntentBits.GuildScheduledEvents, // Access to scheduled guild events
    GatewayIntentBits.AutoModerationConfiguration, // Access to automatic moderation configuration
    GatewayIntentBits.AutoModerationExecution // Access to automatic moderation rules execution moderation
  ]
});

// Use environment variables for Dokploy compatibility
const config = {
  clientID: process.env.DISCORD_CLIENT_ID || '',
  clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
  callbackURL: process.env.DISCORD_CALLBACK_URL || 'http://localhost:3000/login/api',
  Admin: process.env.DISCORD_ADMIN_IDS ? process.env.DISCORD_ADMIN_IDS.split(',') : [''],
  token: process.env.DISCORD_BOT_TOKEN || '',
  prefix: process.env.BOT_PREFIX || '-',
  port: process.env.BOT_PORT || process.env.PORT || 3000
};

const settings = require('./config/settings.json');
client.commands = new Enmap();
client.config = config;

// Add bot startup logging
console.log('🤖 Starting Discord Bot...');
console.log(`📊 Bot Configuration:`);
console.log(`  - Client ID: ${config.clientID ? 'SET' : 'NOT SET'}`);
console.log(`  - Token: ${config.token ? 'SET' : 'NOT SET'}`);
console.log(`  - Prefix: ${config.prefix}`);
console.log(`  - Admin IDs: ${config.Admin.join(', ')}`);

// Validate bot token
if (!config.token) {
  console.error('❌ ERROR: Discord bot token is not set!');
  console.error('Please set DISCORD_BOT_TOKEN environment variable');
  process.exit(1);
}

// Loading events
fs.readdir("./events/", (err, files) => {
  if (err) {
    console.error('❌ Error loading events:', err);
    return;
  }
  console.log(`📁 Loading ${files.length} event files...`);
  files.forEach(file => {
    try {
      const event = require(`./events/${file}`);
      let eventName = file.split(".")[0];
      client.on(eventName, event.bind(null, client));
      console.log(`✅ Loaded event: ${eventName}`);
    } catch (error) {
      console.error(`❌ Error loading event ${file}:`, error);
    }
  });
});

// Loading commands
console.log('📁 Loading commands...');
Object.keys(commands).forEach(commandName => {
  let props = commands[commandName];
  if (settings.includes(commandName)) {
    console.log(`⏭️ Skipping command: ${commandName} (disabled in settings)`);
    return;
  }
  
  try {
    client.commands.set(commandName, props);
    console.log(`✅ Loaded command: ${commandName}`);
  } catch (error) {
    console.error(`❌ Error loading command ${commandName}:`, error);
  }
});

// Command processing
client.on('messageCreate', message => {
  if (message.author.bot) return; // Ignore the bots
  if (!message.content.startsWith(config.prefix)) return; // Prefix check

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!command) {
    console.log(`Command not found: ${commandName}`);
    return;
  }

  // Checking for the presence of the execute function
  if (typeof command.execute !== 'function') {
    console.error(`Command ${commandName} does not have an execute function`);
    return;
  }

  try {
    // Pass the client, message and arguments
    command.execute(client, message, args);
  } catch (error) {
    console.error(`Error executing command ${commandName}:`, error);
    message.reply('There was an error trying to execute that command!');
  }
});

// Bot ready event with better logging
client.on("ready", () => {
  console.log('🎉 Bot is ready!');
  console.log(`📊 Bot Information:`);
  console.log(`  - Username: ${client.user.username}`);
  console.log(`  - ID: ${client.user.id}`);
  console.log(`  - Servers: ${client.guilds.cache.size}`);
  console.log(`  - Users: ${client.users.cache.size}`);
  
  client.user.setActivity('Set Activity', { type: 'WATCHING' });
  console.log('✅ Bot activity set');
});

// Error handling for bot
client.on('error', (error) => {
  console.error('❌ Discord bot error:', error);
});

client.on('disconnect', () => {
  console.log('🔌 Bot disconnected');
});

client.on('reconnecting', () => {
  console.log('🔄 Bot reconnecting...');
});

// Login with error handling
console.log('🔐 Logging in to Discord...');
client.login(config.token).catch(error => {
  console.error('❌ Failed to login to Discord:', error);
  console.error('Please check your bot token and permissions');
  process.exit(1);
});

exports.client = client;
