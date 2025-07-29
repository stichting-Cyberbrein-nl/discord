const passport = require('passport');
var DiscordStrategy = require('passport-discord').Strategy;

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

module.exports = function(passport) {
    var scopes = ['identify', 'email', 'guilds', 'guilds.join'];
 
    passport.use(new DiscordStrategy({
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL,
        scope: scopes
    },
    function(accessToken, refreshToken, profile, cb) {
        if(config.Admin.includes(profile.id)){
            return cb(null, profile);
        }else{
            return cb(null, false, { message: 'Unauthorised! Please add your client ID to the config!' })
        }
    }));

    passport.serializeUser(function(user, done) {
        done(null, user);
      });
      
      passport.deserializeUser(function(user, done) {
        done(null, user);
      });
}
