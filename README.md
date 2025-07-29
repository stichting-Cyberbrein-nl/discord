<h2 align="center">🎉 UPDATED TO LATEST DISCORD JS VERSION 🎉 </h2>
<h4 align="center">Thank you to mrranger for bring the project back to life</h4>

<h1 align="center">
    <br>
    <p>Discord BOT Dashboard - V2</p>
<img src="./content/headerimage.png">
    
[![Github all releases](https://img.shields.io/github/downloads/LachlanDev/Discord-BOT-Dashboard-V2/total.svg?style=for-the-badge)](https://GitHub.com/LachlanDev/Discord-BOT-Dashboard-V2/releases/) [![GitHub release](https://img.shields.io/github/release/LachlanDev/Discord-BOT-Dashboard-V2.svg?style=for-the-badge)](https://GitHub.com/LachlanDev/Discord-BOT-Dashboard-V2/releases/) [![GitHub issues](https://img.shields.io/github/issues/LachlanDev/Discord-BOT-Dashboard-V2.svg?style=for-the-badge)](https://GitHub.com/LachlanDev/Discord-BOT-Dashboard-V2/issues/) [![DiscordServer](https://img.shields.io/discord/587842272167723028?label=Discord%20Server&logo=Discord&colorB=5865F2&style=for-the-badge&logoColor=white)](https://discord.com/invite/w7B5nKB)


</h1>

# 📚 About
Discord BOT Dashboard V2 is the successor of <a href="https://github.com/LachlanDev/Discord-BOT-Dashboard" target="_blank">Discord BOT Dashboard</a>, Discord BOT Dashboard V2 is made to make **Discord BOT Development** easy, designed to create applications without having to write a single line of code while using a user friendly Web-Dashboard!

# Dashboard Preview:
<img src="./content/dashprev.JPG">

## 🚀 Installation / Setup
Head over to the Docs to find all the instructions for setting up and running Discord BOT Dashboard V2.
#### ⌚ Installing Requirements
Download the latest version from [Releases](https://github.com/LachlanDev/Discord-BOT-Dashboard-V2/releases), open up the root directory and run the following command.
```bash
npm install
```

#### 🖥️ Setting up BOT
Rename ``config.default.json`` to ``config.json`` and open up the file, this can be found found in the **config** folder and input the required fields. More info on these fields can be found on the Docs page [here!](https://dbd.lachlan-dev.com/docs/)
```json
{
    "clientID":"BOTclientID",
    "clientSecret":"BOTclientSecret",
    "callbackURL":"http://localhost:1337/login/api",
    "Admin":["userAdminID"],
    "token":"BOTtoken",
    "prefix":"-",
    "port":"3000"
}

```

Redirects
You must specify at least one URI for authentication to work. If you pass a URI in an OAuth request, it must exactly match one of the URIs you enter here.
http://localhost:1337/login/api

Make sure to enable both "Privileged Gateway Intents" on the [**Discord Developer Dashboard**](https://discord.com/developers). This is to fix errors  with "Kick / Ban" Commands!

#### 📡 Starting the application 
Open up the root directory and run the following command.
```bash
node index.js
```
You should now be able to access the dashboard at **http://localhost:3000**.

#### 🐳 Docker Installation (Alternative)
If you prefer to use Docker, you can run the application using Docker Compose:

1. **Clone the repository:**
```bash
git clone https://github.com/LachlanDev/Discord-BOT-Dashboard-V2.git
cd Discord-BOT-Dashboard-V2
```

2. **Configure your bot settings:**
   - Copy `src/config/config.default.json` to `src/config/config.json`
   - Edit `src/config/config.json` with your Discord bot credentials

3. **Build and run with Docker Compose:**
```bash
docker-compose up -d
```

4. **Access the dashboard:**
   - Open your browser and go to **http://localhost:3000**

**Docker Commands:**
```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down

# Rebuild the container
docker-compose up -d --build
```

**Note:** Make sure Docker and Docker Compose are installed on your system.

## 🧰 Features
A list of some of the features that are included in Discord BOT Dashboard V2
* 🔐 **Authentication** - Discord BOT Dashboard is locked with a secure authentication method that only allows users who are added into the config file to access the dashboard.
* 🔒 **Security** - Discord BOT Dashboard ensures that your application is secure.
* 💎 **Modern UI** - Discord BOT Dashboard is built with a modern UI to ensure its ease of use for anyone.
* 🖥️ **Open Source** - Discord BOT Dashboard is an open source project meaning anyone can contribute to make it even better.
* 🔌 **Stability** - Running your application using Discord BOT Dashboard ensures that it is stable and you wont have any errors.
* ⏲️ **24/7 Uptime** - Running you application using Discord BOT Dashboard allows you to have 24/7 uptime.
* ⛏️ **Multiple Tools** - Discord BOT Dashboard is packed with multiple tools that are easy to use.
* 🔌 **Plugins** - Develop and share plugins that can be imported into your project.

## 💡 Contribute
If you would like to contribute to the project please open a PR (Pull Request) clearly showing your changes.

## 🔒 Requirements
* [Node.JS](https://nodejs.org/en/) (Node.js v20.16.0)

## 📞 Issues
If you have any issues feel free to open an issue or join the [Discord Server.](https://discord.com/invite/TkZzRBaxP9)

## 🧲 Extra
__Created by LachlanDev#8014__
* [Twitter](https://twitter.com/LachlanDev)
* [Instagram](https://www.instagram.com/LachlanDev/)
* [Discord Server](https://discord.com/invite/TkZzRBaxP9)
* [Marketplace](https://github.com/LachlanDev/Discord-BOT-Dashboard-Marketplace)
</br>
