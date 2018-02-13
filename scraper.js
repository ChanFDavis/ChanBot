var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

const scrapeTypes = {
	doggos: ['rarepuppers', 'doggo'],
	turtles:['turtle', 'turtles']
}


function scrape(type)
{
	var currentLinks;

	request = request.defaults({jar: true});

	var url = 'https://www.reddit.com/r/' + scrapeTypes[type][0] + '/new';

	fs.readFile(scrapeTypes[type][1] + '.txt', 'utf8', function(error, data)
		{
			if(error)
			{
				console.log("Error: " + error);
			}

			currentLinks = data.split('\n');

		});

	console.log('Attempting to scrape for ', type, '...');

	var j = request.jar();

	request({url: (url)}, function(error, response, body) {
		if(error) {
			console.log("Error: " + error);
		}

		var $ = cheerio.load(body);

		$('div.sitetable > div.link').each(function( index ) {
			var imageLink = $(this).find('a.thumbnail').attr('href');
			if(imageLink && imageLink.includes('imgur') && !currentLinks.includes(imageLink))
			{
				console.log(imageLink);
				fs.appendFileSync(scrapeTypes[type][1] + '.txt', imageLink + '\n');
			}
		});

		var cookies = j.getCookies(url);

		console.log("done!");
	});

	console.log(j.getCookies(url));
}

module.exports = {
	doggos: function()
	{
		scrape('doggos');
	},
	turtles: function()
	{
		scrape('turtles');
	}

}