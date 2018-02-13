// Import the discord.js module
const Discord = require('discord.js');
const Scrape = require('./scraper');
var fs = require('fs'); 

const commandList = "ChanBot Command List: \n\n" +
					"c$gimmedoggo : gives you a random dog picture. \n" +
					"c$gimmeturtle : gives you a random turtle picture. \n" +
					"c$time : gives the time (currently for testing)\n" + 
					"c$roll [number] : does a dice roll of a dice with the number of sides specified.";

var date = new Date();



// Create an instance of a Discord client
const client = new Discord.Client();

// The token of your bot - https://discordapp.com/developers/applications/me
const token = '[Removed for git]';

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
	console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {

	var formattedMessage = message.content.toLowerCase().replace(/ /g, ''); 

	if(message.author.username != 'ChanBot') // Keeps bot from reacting to self
	{
		if(formattedMessage == "c$gimmedoggo")
		{
			message.channel.send("Here's your pupper!", {tts: false});
			message.channel.send(getLink('doggo'), {tts: false});
		}
		if(formattedMessage == "c$gimmeturtle")
		{
			message.channel.send("Oh yeah! Turtle Power!", {tts: false});
			message.channel.send(getLink('turtles'), {tts: false});
		}
		if(formattedMessage == "c$commands")
		{
			message.channel.send(commandList);
		}
		if(formatedMessage.content.includes("c$roll"))
		{
			let number = formattedMessage.slice(6, formattedMessage.length).trim();
			message.channel.send("You roll a: " + randInt(1, parseInt(number)),{tts: false});
		}

	}

	if(message.author.id == '153281116520841226')
	{
		if(formattedMessage == "!scrapedoggos")
		{
			Scrape.doggos(); // Scrape /r/doggos subreddit for dog pictures
		}
		if(formattedMessage == "!scrapeturtles")
		{
			Scrape.turtles(); // Scrape /r/turtles subreddit for turtle pictures
		}		
	}

});

client.on('voiceStateUpdate', function(oldMember, newMember)
{
	if(!oldMember.voiceChannel && newMember.voiceChannel)
	{
		newMember.guild.defaultChannel.send(newMember.user.username + ' has joined ' + newMember.voiceChannel + '.'
			, {tts: false});
	}
});

client.on('guildMemberUpdate', function(oldMember, newMember)
{
	if(oldMember.nickname != newMember.nickname)
	{
		newMember.guild.defaultChannel.send(oldMember.user.username + 'changed their nickname to ' + newMember.nickname + '.'
			, {tts: false});
	}

});


// Log our bot in
client.login(token);

if(date.getHours() % 4 == 0)
{
	console.log('Scraping for everything!');
	Scrape.doggos();
	Scrape.turtles();
}


function randInt(min, max)
{
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

function getLink(file)
{
	var data = fs.readFileSync(file + '.txt', 'utf8').split('\n');
	
	var workingLink;

	while(!workingLink)
	{
		workingLink = data[randInt(0, data.length - 1)];
	}

	return workingLink;
}

