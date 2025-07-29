const express = require('express')
const discord = require('./bot')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const fileUpload = require('express-fileupload');

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

// Add startup logging
console.log('🚀 Starting Discord Bot Dashboard...');
console.log('📊 Environment Configuration:');
console.log(`  - NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`  - PORT: ${config.port}`);
console.log(`  - DISCORD_CLIENT_ID: ${config.clientID ? 'SET' : 'NOT SET'}`);
console.log(`  - DISCORD_CALLBACK_URL: ${config.callbackURL}`);
console.log(`  - DISCORD_ADMIN_IDS: ${config.Admin.length > 0 ? 'SET' : 'NOT SET'}`);
console.log(`  - DISCORD_BOT_TOKEN: ${config.token ? 'SET' : 'NOT SET'}`);

// Validate required environment variables
if (!config.clientID || !config.clientSecret || !config.token) {
  console.error('❌ ERROR: Missing required Discord credentials!');
  console.error('Please set DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, and DISCORD_BOT_TOKEN');
  process.exit(1);
}

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

port = config.port;

app.use(express.static('./public'));
app.use(express.static('./themes'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true,limit: '5mb' }));
app.use(fileUpload());

require('./auth/passport')(passport);

// Express session
app.use(
    session({
      secret: process.env.SESSION_SECRET || '4135231b7f33c66406cdb2a78420fa76',
      resave: true,
      saveUninitialized: true
    })
);
  
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', require('./routes/home.js'));
app.use('/', require('./routes/settings.js'));
app.use('/', require('./routes/guilds.js'));
app.use('/', require('./routes/support.js'));
app.use('/', require('./routes/plugins.js'));

app.use('/login', require('./routes/login.js'));

// Add health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Start server with error handling
const server = http.listen(port, () => {
  console.log(`✅ Server started successfully on port ${port}`);
  console.log(`🌐 Dashboard available at: http://localhost:${port}`);
});

// Error handling for server
server.on('error', (error) => {
  console.error('❌ Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use`);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

io.sockets.on('connection', function(sockets){
  setInterval(function(){ 
    // Uptime Count
    let days = Math.floor(discord.client.uptime / 86400000);
    let hours = Math.floor(discord.client.uptime / 3600000) % 24;
    let minutes = Math.floor(discord.client.uptime / 60000) % 60;
    let seconds = Math.floor(discord.client.uptime / 1000) % 60;
  
    var BOTuptime = `${days}d ${hours}h ${minutes}m ${seconds}s` 
    
    // Emit count to browser 
    sockets.emit('uptime',{uptime:BOTuptime}); }, 1000);
})

// Error Pages
app.use(function(req,res){
  res.status(404).render('error_pages/404');
});
